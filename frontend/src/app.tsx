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
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" defaultChecked/>

                {/* Layout Content */}
                <div className="drawer-content h-dvh flex flex-row">

                    <div className="flex flex-col content-normal w-80 h-dvh">
                        {/* Navbar */}
                        <nav className="navbar w-full bg-base-300 grow-0 is-drawer-open:pl-0 is-drawer-close:pl-100">
                            <div className="px-4">Containers</div>
                        </nav>
                        {/* Page content here */}
                        <div className="flex-1 h-full overflow-y-auto bg-base-200">
                            <div>
                                <Router>
                                    <Containers default path="/containers"/>
                                    <Volumes path="/volumes"/>
                                    <Images path="/images"/>
                                </Router>
                            </div>
                        </div>
                    </div>

                    <div className="grow h-dvh flex flex-col">
                        <nav className="navbar w-full bg-base-300 grow-0 is-drawer-open:pl-0 is-drawer-close:pl-100">
                        </nav>
                        <div className="p-4 overflow-y-auto grow bg-base-100">
                            <h1>No content</h1>
                        </div>
                    </div>

                </div>

                {/* Layout Sidebar */}
                <div className="drawer-side h-dvh is-drawer-close:overflow-visible">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="flex min-h-full flex-col items-start is-drawer-close:w-16 is-drawer-open:w-42">

                        <div className="w-full is-drawer-close:bg-base-300 flex flex-row-reverse p-3">
                            <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost fill-current hover:bg-base-300/80">
                                {/* Sidebar toggle icon */}
                                {/*<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M660-320v-320L500-480l160 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/></svg>*/}
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                                     viewBox="0 -960 960 960" width="24px">
                                    <path
                                        d="M500-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/>
                                </svg>
                            </label>
                        </div>

                        <ul className="menu w-full grow fill-base-content">

                            <li className="menu-title text-left text-xs font-bold text-base-content/20 is-drawer-close:hidden">Docker</li>

                            <li>
                                {/* @ts-ignore */}
                                <Link activeClassName="active" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Containers" href="/containers">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                                         viewBox="0 -960 960 960" width="24px">
                                        <path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-40-343 237-137-237-137-237 137 237 137ZM160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11L160-252Zm320-228Z"/>
                                    </svg>
                                    <span className="is-drawer-close:hidden">Containers</span>
                                </Link>
                            </li>

                            <li>
                                {/* @ts-ignore */}
                                <Link activeClassName="active" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Volumes" href="/volumes">
                                    {/*<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M120-160v-160h720v160H120Zm80-40h80v-80h-80v80Zm-80-440v-160h720v160H120Zm80-40h80v-80h-80v80Zm-80 280v-160h720v160H120Zm80-40h80v-80h-80v80Z"/></svg>*/}
                                    {/*<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-280h640v-240H160v240Zm520-60q25 0 42.5-17.5T740-400q0-25-17.5-42.5T680-460q-25 0-42.5 17.5T620-400q0 25 17.5 42.5T680-340Zm200-260H767l-80-80H273l-80 80H80l137-137q11-11 25.5-17t30.5-6h414q16 0 30.5 6t25.5 17l137 137ZM160-200q-33 0-56.5-23.5T80-280v-320h800v320q0 33-23.5 56.5T800-200H160Z"/></svg>*/}
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px"
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
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                                         viewBox="0 -960 960 960" width="24px">
                                        <path
                                            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-507h560v-133H200v133Zm0 214h560v-134H200v134Zm0 213h560v-133H200v133Zm40-454v-80h80v80h-80Zm0 214v-80h80v80h-80Zm0 214v-80h80v80h-80Z"/>
                                    </svg>
                                    <span className="is-drawer-close:hidden">Images</span>
                                </Link>
                            </li>

                            <li className="">
                                {/* @ts-ignore */}
                                <Link activeClassName="active" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" href="/networks">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" ><path d="M120-80v-280h120v-160h200v-80H320v-280h320v280H520v80h200v160h120v280H520v-280h120v-80H320v80h120v280H120Zm280-600h160v-120H400v120ZM200-160h160v-120H200v120Zm400 0h160v-120H600v120ZM480-680ZM360-280Zm240 0Z"/></svg>
                                    <span className="is-drawer-close:hidden">Networks</span>
                                </Link>
                            </li>

                            <li className="is-drawer-open:hidden"/>
                            <li className="menu-title text-left text-xs font-bold text-base-content/20 pt-6 is-drawer-close:hidden">Kubernetes</li>

                            <li>
                                {/* @ts-ignore */}
                                <Link activeClassName="active" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" href="/images">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M444-105 180-258q-17.1-9.88-26.55-26.06Q144-300.23 144-320v-320q0-19.77 9.45-35.94Q162.9-692.12 180-702l263-152q17-10 37-10t37 10l263 152q17.1 9.88 26.55 26.06Q816-659.77 816-640v320q0 19.77-9.45 35.94Q797.1-267.88 780-258L516-105q-17.13 10-36.07 10Q461-95 444-105Zm0-354v270l36 21 36-21v-270l228-132v-49l-30-17-234 135-235-135-29 17v49l228 132Z"/></svg>
                                    <span className="is-drawer-close:hidden">Pods</span>
                                </Link>
                            </li>

                            <li>
                                {/* @ts-ignore */}
                                <Link activeClassName="active" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" href="/images">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M472-159q-33 0-56.5-24T392-240q0-33 23.5-56.5T472-320l24-23q8-8 18.5-12.5T536-360q23 0 39.5 17t16.5 40v17q0 20 13 33t33 13q15 0 27-9t17-23l12-33q9-24 29-39.5t46-15.5q11-28 17.5-58t6.5-62q0-89-44.5-162.5T632-758v38q0 33-23.5 56.5T552-640h-40v80q0 17-11.5 28.5T472-520h-40v68q0 22-15 37t-37 15q-14 0-25.5-6T336-423l-64-97h-40v40q0 31-21 53t-50 26q26 104 112.5 173T472-159Zm80-241q-17 0-28.5-11.5T512-440q0-17 11.5-28.5T552-480h40q17 0 28.5 11.5T632-440q0 17-11.5 28.5T592-400h-40Zm93-120q-20 0-31.5-15.5T608-570l15-44q4-12 14-19t22-7q20 0 31.5 15.5T696-590l-15 44q-4 12-14 19t-22 7ZM472-80q-83 0-156-31.5T189-197q-54-54-85.5-127T72-480q0-83 31.5-156T189-763q54-54 127-85.5T472-880q83 0 156 31.5T755-763q54 54 85.5 127T872-480q0 83-31.5 156T755-197q-54 54-127 85.5T472-80Z"/></svg>
                                    <span className="is-drawer-close:hidden">Services</span>
                                </Link>
                            </li>

                            <li className="is-drawer-open:hidden"/>
                            <li className="menu-title text-left text-xs font-bold text-base-content/20 pt-6 is-drawer-close:hidden">General</li>

                            <li>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                                        data-tip="Terminal">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px"
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
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px"
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
