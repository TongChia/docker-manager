import {useEffect} from "preact/hooks";
import {h} from 'preact';
import {find, map} from "lodash";
import {cx} from "../utils/classnames";
import {DeleteBtn, PlusBtn, ShareBtn} from "../components/buttons";
import {Route, Router} from "preact-iso";
import {NoContent} from "../components/NoContent";
import {listen, state, total, update} from "../states/network";
import {NetworkInfo} from "./NetworkInfo";


export function Networks(props: any) {
    const networks = state.value
    const selected = find(state.value, {Id: props.id})

    console.debug(selected)

    useEffect(() => {
        update().catch(console.error)
        return listen()
    }, []);

    return (
        <div className="drawer-content h-dvh grid grid-cols-[max-content_auto]">
            <div className="flex flex-col content-normal w-90 h-dvh">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300 grow-0 flex justify-between">
                    <div className="px-4">
                        <p className="font-bold">Networks</p>
                        <p className="text-xs text-base-content/50">{total} total</p>
                    </div>
                </nav>
                {/* Page content here */}
                <div className="flex-1 h-full bg-base-200 overflow-y-scroll">
                    <ul className="menu my-menu w-full">
                        {map(networks, item => (
                            <li className={""}>
                                <span
                                    className={cx("grid-cols-[auto_max-content]", {"menu-active": item.Id == props.id})}>
                                    <a className="grid grid-cols-[min-content_auto] gap-2 items-center h-12"
                                       href={`/networks/${item.Id}/info`}>
                                        <span className="icon fill-info">
                                        </span>
                                        <div className="truncate text-nowrap">
                                            <p className="overflow-hidden text-ellipsis">{item.Name}</p>
                                            <p className="overflow-hidden text-ellipsis text-xs text-current/50">{item.subnet}</p>
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
                    </div>
                    <ShareBtn/>
                </nav>

                <div className="p-4 overflow-y-auto grow">
                    <Router>
                        <Route path="/info" component={NetworkInfo} data={selected}/>
                        <Route default component={NoContent}/>
                    </Router>
                </div>
            </div>
        </div>
    )
}