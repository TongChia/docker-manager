import {h} from 'preact';
import {find, get, head, isEmpty, map} from "lodash";
import {$Compose, $Summary, grouped, is$Compose, is$Container, state, updateOne} from "../states/container";
import {cx} from "../utils/classnames";
import {RoutePropsForPath} from "preact-iso";
import {useEffect} from "preact/hooks";
import {OpenFolder} from "../../bindings/docker-manager/app";
import {ChevronRightIcon, FolderIcon, FolderOpenIcon} from "../components/icons";
import {NoContent} from "../components/NoContent";
import {KVTable, MountTable, PortTable, PropTable} from "../components/PropTable";

export function ContainerInfo({params}: RoutePropsForPath<"/:id/*">) {
    const selected = (find(state.value, {id: params.id}) || find(grouped.value, {id: params.id})) || {} as $Summary

    useEffect(() => {
        if (is$Container(selected))
            updateOne(params.id).then(() => console.debug("update container info", selected))
    }, [params.id]);

    return is$Container(selected) ? (
        <div className="flex flex-col gap-4">
            <KVTable data={[
                {key: "Name", value: selected.name, copyable: true},
                {key: "ID", value: selected.id, copyText: selected.Id},
                {key: "Image", value: selected.Image, copyable: true},
                {key: "Status", value: selected.Status},
            ]}/>
            {!selected.isStop && map(selected.NetworkSettings?.Networks, (v, k) => (
                <KVTable data={[
                    {key: "Network", value: k, copyable: true},
                    {key: "IP", value: v?.IPAddress, copyable: true},
                    ...(isEmpty(v?.DNSNames) ? [] : map(v?.DNSNames, n => ({key: "DNS Name", value: n, copyable: true}))),
                    ...(isEmpty(v?.Aliases) ? [] : map(v?.Aliases, n => ({key: "Aliases", value: n, copyable: true}))),
                ]} />
            ))}
            <PortTable data={selected.ports}/>
            <MountTable data={selected.Mounts}/>
            <PropTable data={selected.Labels} title="Labels"/>
        </div>
    ) : is$Compose(selected) ? (
        <div className="flex flex-col gap-4">
            <GroupTable data={selected}/>
            <OpenComposeFolder data={selected}/>
        </div>
    ) : (
        <NoContent/>
    )
}

const GroupTable = ({data}: { data: $Compose }) => {
    return (
        <div className="flex flex-col gap-4">
            <h4 className="py-2 px-2 font-bold text-sm text-base-content/30">Group</h4>
            <div className="overflow-x-auto rounded-box border border-base-content/20">
                <table className="table table-sm table-fixed truncate text-nowrap">
                    <tbody>
                    {map(data.items, ({name, Labels, state}) =>
                        <tr>
                            <th className="overflow-hidden text-ellipsis w-10/12">
                                <div
                                    className={cx("status status-sm ml-2 mr-4", {
                                        "status-error": state == "stopped",
                                        "status-success": state == "running"
                                    })}></div>
                                {get(Labels, ["com.docker.compose.service"], name)}
                            </th>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const OpenComposeFolder = ({data}: { data: $Compose }) => {
    const onClick = () => {
        const path = get(head(data.items), ["Labels", "com.docker.compose.project.working_dir"])
        if (path) OpenFolder(path).catch(console.error)
    }
    return (
        <div
            className="overflow-x-auto rounded-box border border-base-content/20 p-2 text-sm flex gap-2 items-center open-folder"
            onClick={onClick}>
            <span>
                <FolderIcon className="w-6 fill-current/25 folder-icon"/>
                <FolderOpenIcon className="w-6 fill-current/25 folder-open-icon"/>
            </span>
            <span className="grow">
                Show in Finder
            </span>
            <span>
                <ChevronRightIcon className="w-4 fill-current/50"/>
            </span>
        </div>
    )
}