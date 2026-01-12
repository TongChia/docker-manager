import {get, isEmpty, map} from "lodash";
import {CopyText} from "./CopyText";
import {Fragment, h} from "preact";
import {MountPoint, PortSummary} from "../../bindings/github.com/moby/moby/api/types/container";

export const TableTitle = ({title}: { title?: string }) => (
    <h4 className="mt-4 px-2 font-bold text-sm text-base-content/30">{title}</h4>
)

export const PropTable = ({data, title}: { data?: Record<string, string>, title?: string }) => {
    if (isEmpty(data)) return ""
    return (
        <>
            {!title ? "" : <TableTitle title={title}/>}
            <div className="overflow-x-auto rounded-box border border-base-content/20">
                <table className="table table-sm table-zebra table-fixed truncate text-nowrap">
                    <thead>
                    <tr>
                        <th className="w-6/12">Key</th>
                        <th className="w-6/12">Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {map(data, (value, label) => (
                        <tr key={label}>
                            <td>
                                <CopyText text={label}/>
                            </td>
                            <td>
                                <CopyText text={value}/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export const KVTable = ({data, title}: {
    data?: Array<{ key: string, value?: string, copyable?: boolean, copyText?: string }>,
    title?: string
}) => {
    if (isEmpty(data)) return ""
    return (
        <>
            {!title ? "" : <TableTitle title={title}/>}
            <div className="overflow-x-auto rounded-box border border-base-content/20">
                <table className="table table-sm table-fixed truncate text-nowrap">
                    <tbody>
                    {map(data, ({key, value, copyable, copyText}) => (
                        <tr>
                            <th className="w-2/12">{key}</th>
                            {copyable || copyText ?
                                <td className="w-10/12"><CopyText text={value} copyText={copyText} right/></td> :
                                <td className="w-10/12 text-right overflow-hidden text-ellipsis">{value}</td>
                            }
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export const PortTable = ({data}: { data: PortSummary[] }) => {
    if (isEmpty(data)) return ""
    return (
        <>
            <TableTitle title="Port Forwards"/>
            <div className="overflow-x-auto rounded-box border border-base-content/20">
                <table className="table table-sm table-zebra table-fixed truncate text-nowrap">
                    <thead>
                    <tr>
                        <th className="w-4/12">Host Port</th>
                        <th className="w-4/12">Container Port</th>
                        <th className="w-4/12">Protocol</th>
                    </tr>
                    </thead>
                    <tbody>
                    {map(data, (p, k) => (
                        <tr key={`port-${k}`}>
                            {/*TODO: 打开浏览器链接*/}
                            <td><CopyText text={String(p.PublicPort)}/></td>
                            <td>{p.PrivatePort}</td>
                            <td className="uppercase">{p.Type}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
export const MountTable = ({data}: { data: MountPoint[] }) => {
    if (isEmpty(data)) return ""
    return (
        <>
            <TableTitle title="Mounts"/>
            <div className="overflow-x-auto rounded-box border border-base-content/20">
                <table className="table table-sm table-zebra table-fixed truncate text-nowrap">
                    <thead>
                    <tr>
                        <th className="w-6/12">Source</th>
                        <th className="w-6/12">Destination</th>
                    </tr>
                    </thead>
                    <tbody>
                    {map(data, (m, k) => (
                        <tr key={`mount-${k}`}>
                            {/*TODO: 打开文件夹*/}
                            <td><CopyText text={String(m.Source)}/></td>
                            <td>{m.Destination}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
