import {useState} from "preact/hooks";
import {EventHandler, h, TargetedEvent} from 'preact';
import {Containers} from './pages/Containers';
import {Volumes} from "./pages/Volumes";
import {Images} from "./pages/Images";
import {ErrorBoundary, LocationProvider, Route, Router} from "preact-iso";
import {MainMenu} from "./components/MainMenu";
import {NoContent} from "./components/NoContent";

export function App(props: any) {
    const [isDrawerOpen, setDrawerState] = useState(true);

    const onDrawerChange: EventHandler<TargetedEvent<HTMLInputElement>> = (event) => {
        setDrawerState(event.currentTarget?.checked || false)
    }

    return (
        <LocationProvider>
            <div className="drawer sm:drawer-open h-full select-none">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" defaultChecked
                       onChange={onDrawerChange}/>

                {/* Layout Content */}
                <div className="drawer-content h-dvh grid grid-cols-[max-content_auto]">

                    <ErrorBoundary onError={(e) => console.error(e)}>
                        <Router>
                            <Containers path="/containers/:id/*"/>
                            <Route component={Volumes} path="/volumes/:id/*" />
                            <Route component={Images} path="/images/:id/*" />
                            <Route component={NoContent} default />
                        </Router>
                    </ErrorBoundary>

                </div>

                {/* Layout Sidebar */}
                <div className="drawer-side h-dvh is-drawer-close:overflow-visible">
                    {/*<label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>*/}
                    <div className="flex min-h-full flex-col items-start is-drawer-close:w-16 is-drawer-open:w-43">

                        <div className="navbar w-full is-drawer-close:pt-10 flex flex-row-reverse p-3">
                            <label htmlFor="my-drawer-4" aria-label="open sidebar"
                                   className="btn btn-square btn-ghost fill-current hover:bg-base-300/80">
                                {/* Sidebar toggle icon */}
                                {/*<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M660-320v-320L500-480l160 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/></svg>*/}
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                                     viewBox="0 -960 960 960" width="24px">
                                    <path
                                        d="M500-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/>
                                </svg>
                            </label>
                        </div>

                        <MainMenu/>
                    </div>
                </div>
            </div>
        </LocationProvider>
    )
}
