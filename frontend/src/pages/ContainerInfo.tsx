import {Fragment, h} from 'preact';
import {find, get, head, isEmpty, map} from "lodash";
import {$Compose, $Container, $Summary, grouped, is$Compose, is$Container, state, updateOne} from "../states/Container";
import {cx} from "../utils/classnames";
import {ErrorBoundary, RoutePropsForPath} from "preact-iso";
import {useEffect} from "preact/hooks";
import {CopyText} from "../components/CopyText";
import {OpenFolder} from "../../wailsjs/go/main/App";
import {ChevronRightIcon, FolderIcon, FolderOpenIcon} from "../components/icons";

export function ContainerInfo({params}: RoutePropsForPath<"/:id/*">) {
    const selected = (find(state.value, {id: params.id}) || find(grouped.value, {id: params.id})) as $Summary

    useEffect(() => {
        if (is$Container(selected))
            updateOne(params.id).then(() => console.debug("update container info"))
    }, [params.id]);

    return is$Container(selected) ? (
        <>
            <BasicInfoTable data={selected}/>
            <LabelsTable data={selected}/>
        </>
    ) : is$Compose(selected) ? (
        <>
            <GroupTable data={selected}/>
            <OpenComposeFolder data={selected}/>
        </>
    ) : (
        <ErrorBoundary/>
    )
}

const GroupTable = ({data}: { data: $Compose }) => {
    return (
        <>
            <h4 className="py-2 px-2 font-bold text-sm text-base-content/30">Group</h4>
            <div className="overflow-x-auto rounded-box border border-base-content/20">
                <table className="table table-sm table-fixed truncate text-nowrap">
                    <tbody>
                    {map(data.items, ({name, Labels, state}) =>
                        <tr>
                            <td className="overflow-hidden text-ellipsis w-10/12">
                                <div
                                    className={cx("status status-sm ml-2 mr-4", {
                                        "status-error": state == "stopped",
                                        "status-success": state == "running"
                                    })}></div>
                                {get(Labels, ["com.docker.compose.service"], name)}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

const BasicInfoTable = ({data}: { data: $Container }) => {
    return (
        <div className="overflow-x-auto rounded-box border border-base-content/20">
            <table className="table table-sm table-fixed truncate text-nowrap">
                <tbody>
                <tr>
                    <th className="text-nowrap w-2/12">Name</th>
                    <td className="w-10/12"><CopyText text={data.name} right/></td>
                </tr>
                <tr>
                    <th>ID</th>
                    <td><CopyText text={data.id} copyText={data.Id} right/></td>
                </tr>
                <tr>
                    <th>Image</th>
                    <td><CopyText text={data.Image} right/></td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td className="text-right overflow-hidden text-ellipsis">{data.Status}</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

const LabelsTable = ({data}: { data: $Container }) => {
    if (isEmpty(data.Labels)) return ""
    return (
        <>
            <h4 className="py-4 px-2 mt-4 font-bold text-sm text-base-content/30">Labels</h4>
            <div className="overflow-x-auto rounded-box border border-base-content/20">
                <table className="table table-sm table-zebra table-fixed truncate text-nowrap">
                    <thead>
                    <tr>
                        <th className="w-6/12">Key</th>
                        <th className="w-6/12">Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {map(data.Labels, (value, label) => (
                        <tr key={label}>
                            <td>
                                <CopyText text={label} />
                            </td>
                            <td>
                                <CopyText text={value} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

const OpenComposeFolder = ({data}: { data: $Compose }) => {
    const onClick = () => {
        const path = get(head(data.items), ["Labels", "com.docker.compose.project.working_dir"])
        if (path) OpenFolder(path).catch(console.error)
    }
    return (
        <div className="overflow-x-auto rounded-box border border-base-content/20 p-2 mt-4 text-sm flex gap-2 items-center open-folder" onClick={onClick}>
            <span>
                <FolderIcon className="w-6 fill-current folder-icon" />
                <FolderOpenIcon className="w-6 fill-current folder-open-icon" />
            </span>
            <span className="grow">
                Show in Finder
            </span>
            <span>
                <ChevronRightIcon className="w-4 fill-current/50" />
            </span>
        </div>
    )
}