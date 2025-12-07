import './App.css'
import {Greet} from "../wailsjs/go/main/App";
import {useState} from "preact/hooks";
import {Fragment, h} from 'preact';
import {Containers} from './pages/Containers';
import {Volumes} from "./pages/Volumes";
import {Images} from "./pages/Images";
import {Router} from 'preact-router';
import {Link} from 'preact-router/match';

export function App(props: any) {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [name, setName] = useState('');
    const updateName = (e: any) => setName(e.target.value);
    const updateResultText = (result: string) => setResultText(result);

    function greet() {
        Greet(name).then(updateResultText);
    }

    // @ts-ignore
    return (
        <>
            <div className="drawer sm:drawer-open h-full">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" checked={true}/>

                {/* Layout Content */}
                <div className="drawer-content h-dvh bg-base-100 flex flex-row">

                    <div className="flex flex-col content-normal w-100 h-dvh">
                        {/* Navbar */}
                        <nav className="navbar w-full bg-base-300 grow-0 is-drawer-open:pl-0 is-drawer-close:pl-100">
                            <div className="px-4">Containers</div>
                        </nav>
                        {/* Page content here */}
                        <div className="p-4 flex-1 h-full overflow-y-auto ">
                            <div>
                                <Router>
                                    <Containers default path="/containers"/>
                                    <Volumes path="/volumes"/>
                                    <Images path="/images"/>
                                </Router>
                            </div>
                        </div>
                    </div>

                    <div className="grow h-dvh">
                        <div className="p-4 overflow-y-auto grow">
                            <h1>No content</h1>
                        </div>
                    </div>

                </div>

                {/* Layout Sidebar */}
                <div className="drawer-side h-dvh is-drawer-close:overflow-visible">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="flex min-h-full flex-col items-start is-drawer-close:w-16 is-drawer-open:w-42">

                        <div className="w-full is-drawer-close:bg-base-300 flex flex-row-reverse p-3">
                            <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                {/* Sidebar toggle icon */}
                                {/*<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M660-320v-320L500-480l160 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/></svg>*/}
                                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" height="24px"
                                     viewBox="0 -960 960 960" width="24px">
                                    <path
                                        d="M500-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/>
                                </svg>
                            </label>
                        </div>

                        <ul className="menu w-full grow">

                            <li className="menu-title text-left text-xs font-bold text-base-content/20 is-drawer-close:hidden">Docker</li>

                            <li>
                                {/* @ts-ignore */}
                                <Link activeClassName="active" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Containers" href="/containers">
                                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" height="24px"
                                         viewBox="0 -960 960 960" width="24px">
                                        <path
                                            d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-40-343 237-137-237-137-237 137 237 137ZM160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11L160-252Zm320-228Z"/>
                                    </svg>
                                    <span className="is-drawer-close:hidden">Containers</span>
                                </Link>
                            </li>

                            <li>
                                {/* @ts-ignore */}
                                <Link activeClassName="active" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Volumes" href="/volumes">
                                    {/*<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M120-160v-160h720v160H120Zm80-40h80v-80h-80v80Zm-80-440v-160h720v160H120Zm80-40h80v-80h-80v80Zm-80 280v-160h720v160H120Zm80-40h80v-80h-80v80Z"/></svg>*/}
                                    {/*<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-280h640v-240H160v240Zm520-60q25 0 42.5-17.5T740-400q0-25-17.5-42.5T680-460q-25 0-42.5 17.5T620-400q0 25 17.5 42.5T680-340Zm200-260H767l-80-80H273l-80 80H80l137-137q11-11 25.5-17t30.5-6h414q16 0 30.5 6t25.5 17l137 137ZM160-200q-33 0-56.5-23.5T80-280v-320h800v320q0 33-23.5 56.5T800-200H160Z"/></svg>*/}
                                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" height="24px"
                                         viewBox="0 -960 960 960" width="24px">
                                        <path
                                            d="M160-280h640v-240H160v240Zm520-60q25 0 42.5-17.5T740-400q0-25-17.5-42.5T680-460q-25 0-42.5 17.5T620-400q0 25 17.5 42.5T680-340Zm200-260H767l-80-80H273l-80 80H80l137-137q11-11 25.5-17t30.5-6h414q16 0 30.5 6t25.5 17l137 137ZM160-200q-33 0-56.5-23.5T80-280v-320h800v320q0 33-23.5 56.5T800-200H160Z"/>
                                    </svg>
                                    <span className="is-drawer-close:hidden">Volumes</span>
                                </Link>
                            </li>

                            <li>
                                {/* @ts-ignore */}
                                <Link activeClassName="active" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" href="/images">
                                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" height="24px"
                                         viewBox="0 -960 960 960" width="24px">
                                        <path
                                            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-507h560v-133H200v133Zm0 214h560v-134H200v134Zm0 213h560v-133H200v133Zm40-454v-80h80v80h-80Zm0 214v-80h80v80h-80Zm0 214v-80h80v80h-80Z"/>
                                    </svg>
                                    <span className="is-drawer-close:hidden">Images</span>
                                </Link>
                            </li>

                            <li>
                                {/* @ts-ignore */}
                                <Link activeClassName="active" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" href="/networks">
                                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" height="24px"
                                         viewBox="0 -960 960 960" width="24px">
                                        <path
                                            d="M220-80q-58 0-99-41t-41-99q0-58 41-99t99-41q18 0 35 4.5t32 12.5l153-153v-110q-44-13-72-49.5T340-740q0-58 41-99t99-41q58 0 99 41t41 99q0 48-28 84.5T520-606v110l154 153q15-8 31.5-12.5T740-360q58 0 99 41t41 99q0 58-41 99t-99 41q-58 0-99-41t-41-99q0-18 4.5-35t12.5-32L480-424 343-287q8 15 12.5 32t4.5 35q0 58-41 99t-99 41Zm520-80q25 0 42.5-17.5T800-220q0-25-17.5-42.5T740-280q-25 0-42.5 17.5T680-220q0 25 17.5 42.5T740-160ZM480-680q25 0 42.5-17.5T540-740q0-25-17.5-42.5T480-800q-25 0-42.5 17.5T420-740q0 25 17.5 42.5T480-680ZM220-160q25 0 42.5-17.5T280-220q0-25-17.5-42.5T220-280q-25 0-42.5 17.5T160-220q0 25 17.5 42.5T220-160Z"/>
                                    </svg>
                                    <span className="is-drawer-close:hidden">Networks</span>
                                </Link>
                            </li>

                            <li className="is-drawer-open:hidden"/>
                            <li className="menu-title text-left text-xs font-bold text-base-content/20 pt-6 is-drawer-close:hidden">Kubernetes</li>

                            <li>
                                {/* @ts-ignore */}
                                <Link activeClassName="active" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" href="/images">
                                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" height="24px"
                                         viewBox="0 -960 960 960" width="24px">
                                        <path
                                            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-507h560v-133H200v133Zm0 214h560v-134H200v134Zm0 213h560v-133H200v133Zm40-454v-80h80v80h-80Zm0 214v-80h80v80h-80Zm0 214v-80h80v80h-80Z"/>
                                    </svg>
                                    <span className="is-drawer-close:hidden">Pods</span>
                                </Link>
                            </li>

                            <li>
                                {/* @ts-ignore */}
                                <Link activeClassName="active" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" href="/images">
                                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" height="24px"
                                         viewBox="0 -960 960 960" width="24px">
                                        <path
                                            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-507h560v-133H200v133Zm0 214h560v-134H200v134Zm0 213h560v-133H200v133Zm40-454v-80h80v80h-80Zm0 214v-80h80v80h-80Zm0 214v-80h80v80h-80Z"/>
                                    </svg>
                                    <span className="is-drawer-close:hidden">Services</span>
                                </Link>
                            </li>

                            <li className="is-drawer-open:hidden"/>
                            <li className="menu-title text-left text-xs font-bold text-base-content/20 pt-6 is-drawer-close:hidden">General</li>

                            <li>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                                        data-tip="Terminal">
                                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" height="24px"
                                         viewBox="0 -960 960 960" width="24px">
                                        <path
                                            d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H160v400Zm140-40-56-56 103-104-104-104 57-56 160 160-160 160Zm180 0v-80h240v80H480Z"/>
                                    </svg>
                                    <span className="is-drawer-close:hidden">Terminal</span>
                                </button>
                            </li>

                            <li>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                                        data-tip="Settings">
                                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" height="24px"
                                         viewBox="0 -960 960 960" width="24px">
                                        <path
                                            d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z"/>
                                    </svg>
                                    <span className="is-drawer-close:hidden">Settings</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
