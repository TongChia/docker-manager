import {h} from "preact";
import {useEffect, useState} from "preact/hooks";
import {ContainerLogs} from "../../../bindings/docker-manager/app";
import {RoutePropsForPath} from "preact-iso";
import {find, map} from "lodash";
// import {grouped, state} from "../../states/container";


export const LogsPage = ({params}: RoutePropsForPath<"/:id/*">) => {
    // const selected = (find(state.peek(), {id: params.id}) || find(grouped.peek(), {id: params.id}))
    // if (!selected) return ""

    const [logs, setLogs] = useState<string[]>([])

    useEffect(() => {
        ContainerLogs(params.id).then((r) => {
            setLogs(r)
        }).catch(console.error)
    }, []);

    return (
        <div className="size-full text-xs overflow-x-scroll w-full">
            {map(logs, (l, i) => (
                <pre data-prefix={i}><code>{l}</code></pre>
            ))}
        </div>
    )
}