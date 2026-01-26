import {h} from "preact";
import {compact, filter, find, fromPairs, join, map, pick, split, values} from "lodash";
import {KVTable, PropTable} from "../../components/PropTable";
import {state} from "../../states/image";
import * as container from "../../states/container";
import {ImageOne} from "../../../bindings/docker-manager/app";
import {useCallback, useEffect, useState} from "preact/hooks";
import {InspectResponse} from "../../../bindings/github.com/moby/moby/api/types/image";
import {RoutePropsForPath} from "preact-iso";


export const InfoPage = ({params}: RoutePropsForPath<"/:id/*">) => {
    const img = find(state.value, {Id: params.id})
    const [inspect, setInspect] = useState<InspectResponse | null>()
    const used = img?.unused ? [] : filter(container.state.value, (c: container.$Container) => c.ImageID === img?.Id)

    const fetchData = useCallback(async () => {
        if (!params.id) return
        const resp = await ImageOne(params.id)
        setInspect(resp)
        // console.debug("fetch image", resp, img)
    }, [params.id]);

    useEffect(() => {
        fetchData().catch(console.error)
    }, [fetchData])

    return (
        <div className="flex flex-col gap-4 p-4">
            <KVTable data={[
                {key: "ID", value: img?.id, copyText: img?.Id},
                {key: "Tag", value: img?.tag, copyable: true},
                {key: "Created", value: img?.created && `${img?.distance} (${img?.created})`},
                {key: "Size", value: img?.size},
                {key: "Platform", value: join(compact(values(pick(inspect, ["Os", "Architecture", "Variant"]))), '/')},
            ]}/>
            <KVTable title="Config" data={[
                {key: "Entrypoint", value: join(inspect?.Config?.Entrypoint, " "), copyable: true},
                {key: "Working Directory", value: inspect?.Config?.WorkingDir, copyable: true}
            ]}/>
            <PropTable title="Environment" data={fromPairs(map(inspect?.Config?.Env, e => split(e, "=")))}/>
            <PropTable title="Labels" data={inspect?.Config?.Labels}/>
            <KVTable title="Exposed Ports" data={map(inspect?.Config?.ExposedPorts, (v, key) => ({key}))}/>
            <KVTable title="Used By" data={map(used, ({name}) => ({key: name}))}/>
        </div>
    )
}