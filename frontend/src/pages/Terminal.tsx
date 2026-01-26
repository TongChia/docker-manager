import {h} from "preact";
import {useTerminal} from "../states/terminal";
import {MinusBtn, PlusBtn, RefreshBtn} from "../components/buttons";
import {debounce, get, toNumber} from "lodash";

export const TerminalPage = () => {

    const {terminalRef, clearScreen, fontSize, setFontSize} = useTerminal();

    return (
        <div className="drawer-content h-dvh bg-base-100 flex flex-col w-full">
            <nav className="navbar w-full bg-base-300 grow-0 flex justify-between">
                <div className="px-4">
                    <p className="font-bold">Terminal</p>
                </div>

                <div className="join pr-4">
                    <PlusBtn className="join-item p-0.5" onClick={() => {
                        setFontSize(fontSize.peek() + 1)
                    }} />
                    <input type="number" value={fontSize.value || 12} className="input input-ghost input-xs join-item w-10" onChange={(ev) => {
                        if (ev.target)
                            setFontSize(toNumber(get(ev.target, ["value"])))
                    }}/>
                    <MinusBtn className="join-item p-0.5" onClick={() => {
                        setFontSize(fontSize.peek() - 1)
                    }} />
                    <div className="divider divider-horizontal"></div>
                    <RefreshBtn className="join-item p-0.5" onClick={() => clearScreen()} />
                </div>
            </nav>
            <div className="grow">
                <div id="terminal" ref={terminalRef} onKeyPress={debounce((ev) => {
                    if (ev.metaKey && ev.key === 'k') {
                        ev.preventDefault();
                        clearScreen()
                    }
                }, 250, {maxWait: 1000})}></div>
            </div>
        </div>
    )
}