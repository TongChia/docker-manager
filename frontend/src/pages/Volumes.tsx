import {VolumeList} from "../../bindings/docker-manager/app";
import * as volume from "../../bindings/github.com/moby/moby/api/types/volume";
import {useEffect, useState} from "preact/hooks";
import {Fragment, h} from 'preact';
import {running} from "../states/Container";
import {DeleteBtn, PlusBtn, ShareBtn} from "../components/buttons";
import {find, map} from "lodash";
import {cx} from "../utils/classnames";
import {Route, RoutePropsForPath, RoutableProps, Router} from "preact-iso";
import {NoContent} from "../components/NoContent";
import {VolumeFillIcon} from "../components/icons";
import {VolumeInfo} from "./VolumeInfo";


export function Volumes(props: RoutePropsForPath<"/:id/*">) {
    const [volumes, setVolumes] = useState<Array<volume.Volume>>([]);
    const updateVolumes = (list: Array<volume.Volume>) => setVolumes(list);
    const selected = find(volumes, {Name: props.id})

    useEffect(() => {
        VolumeList().then(updateVolumes);
    }, []);


    return (
        <>
            <div className="flex flex-col content-normal w-90 h-dvh">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300 grow-0 flex justify-between">
                    <div className="px-4">
                        <p className="font-bold">Volumes</p>
                        <p className="text-xs text-base-content/50">{running.value || "None"} running</p>
                    </div>
                </nav>
                {/* Page content here */}
                <div className="flex-1 h-full bg-base-200 overflow-y-scroll">
                    <ul className="menu my-menu w-full">
                        {map(volumes, item => (
                            <li className={""}>
                                <span className={cx("grid-cols-[auto_max-content]", {"menu-active": item.Name == props.id})}>
                                    <a className="grid grid-cols-[min-content_auto] gap-2 items-center h-12"
                                       href={`/volumes/${item.Name}/info`}>
                                        <span className="icon  fill-info">
                                            <VolumeFillIcon className="w-8 h-8"/>
                                        </span>
                                        <div className="truncate text-nowrap">
                                            <p className="overflow-hidden text-ellipsis">{item.Name}</p>
                                            <p className="overflow-hidden text-ellipsis text-current/50">{item.CreatedAt}</p>
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
                        <Route path="/info" component={VolumeInfo} data={selected}/>
                        <Route path="/files" component={NoContent}/>
                        <Route default component={NoContent}/>
                    </Router>
                </div>
            </div>
        </>
    )
}