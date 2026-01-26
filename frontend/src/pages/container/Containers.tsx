import {useEffect, useState} from "preact/hooks";
import {h} from 'preact';
import {PlusBtn, SearchBtn, ShareBtn} from "../../components/buttons";
import {map} from "lodash";
import {InfoPage} from "./InfoPage";
import {Route, Router} from "preact-iso";
import {grouped, is$Compose, is$Container, listen, running, update} from "../../states/container";
import {ContainerDropdown, ContainerItem} from "../../components/ContainerMenu";
import {cx} from "../../utils/classnames";
import {NoContent} from "../../components/NoContent";
import {FilesPage} from "./FilesPage";
import {LogsPage} from "./LogsPage";
import {Group, Panel, Separator, useDefaultLayout} from "react-resizable-panels";
import {Loading} from "../../components/Loading";

export function Containers(props: any) {
    const {defaultLayout, onLayoutChanged} = useDefaultLayout({
        id: "containers-page",
        storage: localStorage
    });
    const containers = grouped.value
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        update().catch(console.error).finally(() => setLoading(false))
        return listen()
    }, []);

    return (
        // <div className="drawer-content h-dvh grid grid-cols-[max-content_auto]">
        <Group id="containers-page" className="drawer-content h-dvh bg-base-100" orientation="horizontal"
               defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
            <Panel id="containers-list" className="flex flex-col content-normal h-dvh" defaultSize={320} minSize={240}
                   maxSize={"50%"}>
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300 grow-0 flex justify-between">
                    <div className="px-4">
                        <p className="font-bold">Containers</p>
                        <p className="text-xs text-base-content/50">{running.value || "None"} running</p>
                    </div>
                    <SearchBtn/>
                </nav>
                {/* Page content here */}
                <div className="flex-1 h-full bg-base-200 overflow-y-scroll">
                    {loading ? <Loading/> :
                        <ul className="menu my-menu container-menu w-full">
                            {map(containers, item =>
                                is$Container(item) ? <ContainerItem key={item.id} data={item}/> :
                                    is$Compose(item) ? <ContainerDropdown key={item.id} data={item}/> : ""
                            )}
                        </ul>
                    }
                </div>
            </Panel>
            <Separator id="containers-separator"
                       className="w-1 bg-base-content/10 hover:bg-base-content/20 focus:outline-0 cursor-col-resize outline-nonde z-10"
                       aria-orientation="horizontal"/>
            <Panel id="containers-tabs" className="h-dvh flex flex-col bg-base-100">
                <nav className="navbar w-full grow-0 flex justify-between px-4">
                    <PlusBtn/>
                    <div role="tablist" className="tabs tabs-box capitalize">
                        {map(["info", "logs", "terminal", "files"], (tab) => (
                            <a key={tab} role="tab" className={cx("tab w-18", {"tab-active": props.rest == `/${tab}`})}
                               href={tab}>{tab}</a>
                        ))}
                    </div>
                    <ShareBtn/>
                </nav>

                <div className="overflow-y-scroll grow">
                    <Router>
                        <Route component={InfoPage} path="/info"/>
                        <Route component={LogsPage} path="/logs"/>
                        <Route component={FilesPage} path="/files"/>
                        <Route default component={NoContent}/>
                    </Router>
                </div>
            </Panel>
        </Group>
    )
}
