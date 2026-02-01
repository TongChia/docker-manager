import {useEffect, useState} from "preact/hooks";
import {h} from 'preact';
import {find, map} from "lodash";
import {cx} from "../../utils/classnames";
import {DeleteBtn, PlusBtn, ShareBtn} from "../../components/buttons";
import {Route, Router} from "preact-iso";
import {NoContent} from "../../components/NoContent";
import {listen, state, total, update} from "../../states/network";
import {NetworkInfo} from "./NetworkInfo";
import {Loading} from "../../components/Loading";
import {Group, Panel, Separator, useDefaultLayout} from "react-resizable-panels";


export function Networks(props: any) {
    const {defaultLayout, onLayoutChanged} = useDefaultLayout({
        id: "network-page",
        storage: localStorage
    });
    const networks = state.value
    const selected = find(state.value, {Id: props.id})
    const [loading, setLoading] = useState(true)

    // console.debug(selected)

    useEffect(() => {
        update().catch(console.error).finally(() => setLoading(false))
        return listen()
    }, []);

    return (
        <Group id="network-page" className="drawer-content h-dvh bg-base-100" orientation="horizontal"
               defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
            <Panel id="network-menu" className="flex flex-col content-normal" defaultSize={320} minSize={240} maxSize={"50%"}>
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300 grow-0 flex justify-between">
                    <div className="px-4">
                        <p className="font-bold">Networks</p>
                        <p className="text-xs text-base-content/50">{total} total</p>
                    </div>
                </nav>
                {/* Page content here */}
                <div className="flex-1 h-full bg-base-200 overflow-y-scroll">
                    {loading ? <Loading /> :
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
                    }
                </div>
            </Panel>
            <Separator id="containers-separator"
                       className="w-1 bg-base-content/10 hover:bg-base-content/20 focus:outline-0 cursor-col-resize outline-nonde z-10"
                       aria-orientation="horizontal"/>
            <Panel id="network-info" className="flex flex-col bg-base-100">

                <nav className="navbar w-full grow-0 flex justify-between px-4">
                    {/*<PlusBtn/>*/}
                    <div />
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
            </Panel>
        </Group>
    )
}