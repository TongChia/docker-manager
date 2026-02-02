import {EventHandler, h, TargetedEvent} from 'preact';
import {ErrorBoundary, LocationProvider, Route, Router} from "preact-iso";
import {Containers} from './pages/container/Containers';
import {Volumes} from "./pages/Volumes";
import {Images} from "./pages/image/Images";
import {MainMenu} from "./components/MainMenu";
import {DefaultPage} from "./pages/DefaultPage";
import {Networks} from "./pages/network/Networks";
import {Settings} from "./pages/Settings";
import {TerminalPage} from "./pages/Terminal";
import {Theme, ThemePrimary} from "./states/theme";
import {useLocalStorage} from "./utils/localstorage";

export function App(props: any) {
    const onDrawerChange: EventHandler<TargetedEvent<HTMLInputElement>> = (event) => {
        // setDrawerState(event.currentTarget?.checked || false)
    }
    const [theme, setTheme] = useLocalStorage<Theme>("theme", "default");

    return (
        <ThemePrimary.Provider value={{theme, setTheme}}>
            <LocationProvider>
                <div className="drawer sm:drawer-open h-full select-none" data-theme={theme}>
                    <input id="my-drawer-4" type="checkbox" className="drawer-toggle" defaultChecked
                           onChange={onDrawerChange}/>

                    {/* Layout Content */}
                    <ErrorBoundary onError={(e) => {
                        console.error("ErrorBoundary: ", e);
                        // window.location.replace('/')
                    }}>
                        <Router>
                            <Route component={Containers} path="/containers/:id/*"/>
                            <Route component={Volumes} path="/volumes/:id/*"/>
                            <Route component={Images} path="/images/:id/*"/>
                            <Route component={Networks} path="/networks/:id/*"/>
                            <Route component={TerminalPage} path="/terminal"/>
                            <Route component={Settings} path="/settings"/>
                            <Route component={DefaultPage} default/>
                        </Router>
                    </ErrorBoundary>

                    {/* Layout Sidebar */}
                    <div className="drawer-side h-dvh is-drawer-close:overflow-visible">
                        <div className="flex min-h-full flex-col items-start is-drawer-close:w-16 is-drawer-open:w-43">

                            <div className="navbar w-full is-drawer-close:pt-10 flex flex-row-reverse p-3">
                                <label htmlFor="my-drawer-4" aria-label="open sidebar"
                                       className="btn btn-square btn-ghost fill-current hover:bg-base-300/80">
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
        </ThemePrimary.Provider>
    )
}
