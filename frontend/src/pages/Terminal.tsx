import {h} from "preact";
import {useTerminal} from "../states/terminal";

export const TerminalPage = () => {

    const terminalRef = useTerminal();

    return (
        <div className="drawer-content h-dvh bg-base-100 flex flex-col w-full">
            <nav className="navbar w-full bg-base-300 grow-0 flex justify-between">
                <div className="px-4">
                    <p className="font-bold">Terminal</p>
                </div>
            </nav>
            <div className="grow">
                <div id="terminal" ref={terminalRef}></div>
            </div>
        </div>
    )
}