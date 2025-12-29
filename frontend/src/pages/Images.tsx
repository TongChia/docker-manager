import {useEffect} from "preact/hooks";
import {Fragment, h} from 'preact';
import * as container from "../states/container";
import {map} from "lodash";
import {cx} from "../utils/classnames";
import {VolumeFillIcon} from "../components/icons";
import {DeleteBtn, PlusBtn, ShareBtn} from "../components/buttons";
import {Route, Router} from "preact-iso";
import {NoContent} from "../components/NoContent";
import {listen, state, total, update} from "../states/image";
import {ImageInfo} from "./ImageInfo";

export function Images(props: any) {
    const images = state.value
    // const selected = find(images, {Id: props.id})

    useEffect(() => {
        container.update().then(() => update()).catch(console.error)
        return listen()
    }, []);

    return (
        <div className="drawer-content h-dvh grid grid-cols-[max-content_auto]">
            <div className="flex flex-col content-normal w-90 h-dvh">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300 grow-0 flex justify-between">
                    <div className="px-4">
                        <p className="font-bold">Volumes</p>
                        <p className="text-xs text-base-content/50">{total.value} total</p>
                    </div>
                </nav>
                {/* Page content here */}
                <div className="flex-1 h-full bg-base-200 overflow-y-scroll">
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
                </div>
            </div>

            <div className="h-dvh flex flex-col bg-base-100 w-full">

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

                <div className="p-4 overflow-y-auto grow">
                    <Router>
                        <Route path="/info" component={ImageInfo}/>
                        <Route path="/files" component={NoContent}/>
                        <Route default component={NoContent}/>
                    </Router>
                </div>
            </div>
        </div>
    )
}