import {useEffect, useState} from "preact/hooks";
import {h} from 'preact';
import * as container from "../../states/container";
import {map} from "lodash";
import {cx} from "../../utils/classnames";
import {VolumeFillIcon} from "../../components/icons";
import {DeleteBtn, PlusBtn, ShareBtn} from "../../components/buttons";
import {Route, Router} from "preact-iso";
import {NoContent} from "../../components/NoContent";
import {listen, state, total, update} from "../../states/image";
import {InfoPage} from "./InfoPage";
import {FilesPage} from "./FilesPage";
import {Loading} from "../../components/Loading";
import {Group, Panel, Separator, useDefaultLayout} from "react-resizable-panels";

const pageId = "images-page"
export function Images(props: any) {
    const {defaultLayout, onLayoutChanged} = useDefaultLayout({id: pageId, storage: localStorage});
    const images = state.value
    const totalSize = total.value
    // const selected = find(images, {Id: props.id})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        container.update().then(update).catch(console.error).finally(() => setLoading(false))
        return listen()
    }, []);

    return (
        // <div className="drawer-content h-dvh grid grid-cols-[max-content_auto]">
        <Group id={pageId} className="drawer-content h-dvh bg-base-100" orientation="horizontal"
               defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
            {/*<div className="flex flex-col content-normal w-90 h-dvh">*/}
            <Panel id={`${pageId}-left`} className="flex flex-col content-normal h-dvh" defaultSize={320} minSize={240}
                   maxSize={"50%"}>
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300 grow-0 flex justify-between">
                    <div className="px-4">
                        <p className="font-bold">Images</p>
                        <p className="text-xs text-base-content/50">{totalSize} total</p>
                    </div>
                </nav>
                {/* Page content here */}
                <div className="flex-1 h-full bg-base-200 overflow-y-scroll">
                    {loading ? (<Loading />) : (
                        <ul className="menu my-menu image-menu w-full">
                            {map(images, item => (
                                <li className={cx({"disabled": item.unused})}>
                                <span
                                    className={cx("grid-cols-[auto_max-content]", {"menu-active": item.Id == props.id})}>
                                    <a className="grid grid-cols-[min-content_auto] gap-2 items-center h-12"
                                       href={`/images/${item.Id}/info`}>
                                        <span className="icon fill-info">
                                            <VolumeFillIcon className="w-6 h-6"/>
                                        </span>
                                        <div className="truncate text-nowrap">
                                            <p className="overflow-hidden text-ellipsis">{item.name}</p>
                                            <p className="overflow-hidden text-ellipsis text-xs text-current/50">{[item.size, item.distance].join(', ')}</p>
                                        </div>
                                    </a>
                                    <span>
                                        <DeleteBtn/>
                                    </span>
                                </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Panel>

            {/*<div className="h-dvh flex flex-col bg-base-100 w-full">*/}
            <Separator id={`${pageId}-separator`}
                       className="w-1 bg-base-content/10 hover:bg-base-content/20 focus:outline-0 cursor-col-resize outline-nonde z-10"
                       aria-orientation="horizontal"/>
            <Panel id={`${pageId}-right`} className="h-dvh flex flex-col bg-base-100">
                <nav className="navbar w-full grow-0 flex justify-between px-4">
                    <PlusBtn/>
                    <div role="tablist" className="tabs tabs-box capitalize">
                        {map(["info", "files"], (tab) => (
                            <a key={tab} role="tab" className={cx("tab w-18", {"tab-active": props.rest == `/${tab}`})}
                               href={tab}>{tab}</a>
                        ))}
                    </div>
                    <ShareBtn/>
                </nav>

                <div className="grow w-full">
                    <Router>
                        <Route path="/info" component={InfoPage}/>
                        <Route path="/files" component={FilesPage}/>
                        <Route default component={NoContent}/>
                    </Router>
                </div>
            </Panel>
        </Group>
    )
}