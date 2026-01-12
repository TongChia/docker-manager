import {FitAddon} from "@xterm/addon-fit";
import {WebLinksAddon} from "@xterm/addon-web-links";
import {Terminal} from "@xterm/xterm";
import {h} from "preact";
import {Browser, System} from "@wailsio/runtime";
import {useEffect, useRef} from "preact/hooks";
import {App, TermOption} from "../../bindings/docker-manager"
import { AttachAddon } from "@xterm/addon-attach";

export const TerminalPage = () => {

    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (terminalRef.current) {

            const term = new Terminal({
                cursorBlink: true,
                // theme: "dark",
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

            term.loadAddon(fitAddon);
            term.loadAddon(webLinks);

            term.open(terminalRef.current);
            fitAddon.fit();

            App.Terminal(new TermOption({Cols: term.cols, Rows: term.rows,})).then((addr) => {
                console.debug("addr", addr)
                const attachAddon = new AttachAddon(new WebSocket(`${addr}&cols=${term.cols}&rows=${term.rows}`));
                term.loadAddon(attachAddon)
                // TODO: resize
            }).catch(console.error)
        }
    }, [terminalRef.current]);

    return (
        <div className="drawer-content h-dvh bg-base-100 flex flex-col w-full">
            <nav className="navbar w-full bg-base-300 grow-0 flex justify-between">
                <div className="px-4">
                    <p className="font-bold">Terminal</p>
                </div>
            </nav>
            <div className="grow">
                <div id="terminal" className="w-full h-full" ref={terminalRef}></div>
            </div>
        </div>
    )
}