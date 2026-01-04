import {useEffect} from "preact/hooks";
import {h} from 'preact';
import {DeleteBtn, PlusBtn, ShareBtn} from "../components/buttons";
import {find, isEmpty, map} from "lodash";
import {cx} from "../utils/classnames";
import {Route, RoutePropsForPath, Router} from "preact-iso";
import {NoContent} from "../components/NoContent";
import {VolumeFillIcon} from "../components/icons";
import {VolumeInfo} from "./VolumeInfo";
import {state, total, loaded, update} from "../states/volume"
import {Loading} from "../components/Loading";

export function Volumes(props: RoutePropsForPath<"/:id/*">) {
    const items = state.value
    const selected = find(items, {Name: props.id})

    useEffect(() => {
        update().catch(console.error)
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
                    {!loaded.value ? <Loading/> : isEmpty(items) ? <NoContent/> :
                        <ul className="menu my-menu image-menu w-full">
                            {map(items, item => (
                                <li key={item.Name} className={cx({"disabled": item.unused})}>
                                <span
                                    className={cx("grid-cols-[auto_max-content]", {"menu-active": item.Name == props.id})}>
                                    <a className="grid grid-cols-[min-content_auto] gap-2 items-center h-12"
                                       href={`/volumes/${item.Name}/info`}>
                                        <span className="icon  fill-info">
                                            <VolumeFillIcon className="w-6 h-6"/>
                                        </span>
                                        <div className="truncate text-nowrap">
                                            <p className="overflow-hidden text-ellipsis">{item.Name}</p>
                                            <p className="overflow-hidden text-ellipsis text-xs text-current/50">{item.size}</p>
                                        </div>
                                    </a>
                                    <span>
                                        <DeleteBtn/>
                                    </span>
                                </span>
                                </li>
                            ))}
                        </ul>}
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
        </div>
    )
}