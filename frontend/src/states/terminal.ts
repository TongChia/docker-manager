import {debounce} from "lodash";
import {Term} from "../../bindings/docker-manager";
import {Terminal} from "@xterm/xterm";
import {FitAddon} from "@xterm/addon-fit";
import {signal} from "@preact/signals";
import {RefObject} from "preact";
import {Browser, System} from "@wailsio/runtime";
import {XTermThemeDark, XTermThemeLight} from "../utils/theme";
import {WebLinksAddon} from "@xterm/addon-web-links";
import {AttachAddon} from "@xterm/addon-attach";
import {useEffect, useRef} from "preact/hooks";

const doResize = debounce((cols: number, rows: number) => {
    Term.Resize(cols, rows).catch(console.error)
}, 250, {'maxWait': 1000})

interface $TerminalRender {
    instance: Terminal
    container: HTMLDivElement
    fitAddon: FitAddon
    wsConn: WebSocket
}

const termRender = signal<$TerminalRender | null>(null)

const initTerminal = async (terminalRef: RefObject<HTMLDivElement>) => {
    if (!terminalRef.current) return

    if (termRender.value != null) {
        const {instance, container, fitAddon, wsConn} = termRender.value
        if (wsConn.readyState === WebSocket.OPEN) {
            terminalRef.current.appendChild(container)
            fitAddon.fit()
            await Term.Resize(instance.cols, instance.rows)
            return
        }
    }

    const isDark = await System.IsDarkMode()
    const addr = await Term.Serve()

    const term = new Terminal({
        cursorBlink: true,
        theme: isDark ? XTermThemeDark : XTermThemeLight,
        fontFamily: `"Fira Code", monospace`,
        fontWeight: 'normal',
        fontWeightBold: 'bold',
        fontSize: 12,
    });
    const fitAddon = new FitAddon();
    const webLinks = new WebLinksAddon((event, uri) => {
        let openLinkTargetKey = System.IsMac() ? event.metaKey : event.ctrlKey;

        if (
            event.type === 'mouseup' &&
            event.button === 0 &&
            openLinkTargetKey
        ) {
            Browser.OpenURL(uri).catch(console.error);
        }
    })
    const wsConn = new WebSocket(addr)
    const attachAddon = new AttachAddon(wsConn);

    term.loadAddon(fitAddon);
    term.loadAddon(webLinks);
    term.loadAddon(attachAddon);

    const container = document.createElement("div")
    container.style = "width: 100%; height: 100%;"
    terminalRef.current.appendChild(container)
    term.open(container);

    // 调整尺寸
    fitAddon.fit();
    await Term.Resize(term.cols, term.rows)

    // 注册 resize 事件
    const obs = new ResizeObserver(() => {
        fitAddon.fit()
        doResize(term.cols, term.rows)
    })
    obs.observe(container)

    termRender.value = {
        instance: term,
        container: container,
        fitAddon: fitAddon,
        wsConn: wsConn,
    }
}


export const useTerminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initTerminal(terminalRef).catch(console.error)

        return () => {
            if (terminalRef.current != null && termRender.value != null) {
                terminalRef.current.removeChild(termRender.value.container)
            }
        }
    })

    return terminalRef
}