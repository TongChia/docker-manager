import {useEffect} from "preact/hooks";
import {h} from 'preact';
import {PlusBtn, SearchBtn, ShareBtn} from "../components/buttons";
import {map} from "lodash";
import {ContainerInfo} from "./ContainerInfo";
import {Route, Router} from "preact-iso";
import {grouped, is$Compose, is$Container, listen, running, update} from "../states/container";
import {ContainerDropdown, ContainerItem} from "../components/ContainerMenu";
import {cx} from "../utils/classnames";
import {NoContent} from "../components/NoContent";

export function Containers(props: any) {
    const containers = grouped.value

    useEffect(() => {
        update().catch((err) => console.error("failed to update containers", err))
        return listen()
    }, []);

    return (
        <div className="drawer-content h-dvh grid grid-cols-[max-content_auto]">
            <div className="flex flex-col content-normal w-90 h-dvh">
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
                    <ul className="menu my-menu container-menu w-full">
                        {map(containers, item =>
                            is$Container(item) ? <ContainerItem key={item.id} data={item}/> :
                                is$Compose(item) ? <ContainerDropdown key={item.id} data={item}/> : ""
                        )}
                    </ul>
                </div>
            </div>

            <div className="h-dvh flex flex-col bg-base-100 w-full">

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

                <div className="p-4 overflow-y-auto grow">
                    <Router>
                        <Route component={ContainerInfo} path="/info"/>
                        <Route default component={NoContent}/>
                    </Router>
                </div>
            </div>
        </div>
    )
}
