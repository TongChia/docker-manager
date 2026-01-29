import {h} from "preact";
import {useEffect, useRef, useState} from "preact/hooks";
import {ContainerLogs} from "../../../bindings/docker-manager/app";
import {RoutePropsForPath} from "preact-iso";
import {find, last, map} from "lodash";
import {Group, Panel, Separator} from "react-resizable-panels";
import {state} from "../../states/container";
import {NoContent} from "../../components/NoContent";
import {Loading} from "../../components/Loading";
import {cx} from "../../utils/classnames";
// import {grouped, state} from "../../states/container";


export const LogsPage = ({params}: RoutePropsForPath<"/:id/*">) => {
    const selected = find(state.peek(), {id: params.id})
    if (!selected) return <NoContent/>

    const [logs, setLogs] = useState<string[]>([])
    const [text, setSelectText] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isAutoScroll, setIsAutoScroll] = useState(true);

    useEffect(() => {
        ContainerLogs(params.id).then((r) => {
            setLogs(r)
            setSelectText(last(r) || "")
        }).catch(console.error).finally(() => setLoading(false))
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAutoScroll)
                scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
        }, 0)
        return () => clearTimeout(timer);
    }, [logs, isAutoScroll])

    const isScrolledBottom = () => {
        if (!scrollRef.current) return true;
        const {scrollTop, scrollHeight, clientHeight} = scrollRef.current;
        return scrollHeight - scrollTop - clientHeight < 10
    };
    const onScroll = () => setIsAutoScroll(isScrolledBottom());

    if (loading) return <Loading/>
    return (
        <Group orientation="vertical">
            <Panel>
                <div className="size-full text-xs overflow-auto bg-neutral text-neutral-content" ref={scrollRef}
                     onScroll={onScroll}>
                    {map(logs, (l, i) => (
                        <pre data-prefix={i}
                             className={cx("hover:bg-neutral-content/35", {"bg-neutral-content/35": text == l})}
                             onClick={() => setSelectText(l)}><code>{l}</code></pre>
                    ))}
                </div>
            </Panel>
            <Separator
                className="h-2 w-full bg-base-content/10 hover:bg-base-content/20 cursor-row-resize focus:outline-none"
                aria-orientation="vertical"/>
            <Panel defaultSize={120}>
                <div className="size-full bg-amber-100 text-gray-700 text-sm py-1 px-2 select-text">
                    <code>{text}</code>
                </div>
            </Panel>
        </Group>

    )
}