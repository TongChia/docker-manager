import {h, Fragment} from "preact";
import {RoutePropsForPath} from "preact-iso";
import {useEffect, useState} from "preact/hooks";
import {ContainerFiles} from "../../../bindings/docker-manager/app";
import {FileNode} from "../../../bindings/docker-manager";
import {FilesTable} from "../../components/FilesTable";


export function FilesPage({params}: RoutePropsForPath<"/:id/*">) {
    const [rootFile, setFiles] = useState<FileNode | null>(null)

    useEffect(() => {
        ContainerFiles(params.id).then((f) => {
            console.debug("Container Files", f)
            setFiles(f)
        }).catch(console.error)
    }, []);


    return (
        <div className="">
            <FilesTable data={rootFile} />
        </div>
    )
}

// const FilesTable = ({data}: {data: FileNode | null}) => {
//     return (
//         <div className="overflow-x-auto">
//             <table className="table table-zebra table-xs">
//
//                 {/* head */}
//                 <thead className="text-xs">
//                     <tr>
//                         <th>Name</th>
//                         <th>Date Modified</th>
//                         <th>Size</th>
//                         <th>Kind</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {map(data?.child, f => (<FileRow key={f?.n} data={f} />))}
//                 </tbody>
//             </table>
//         </div>
//     )
// }
//
// const FileRow = ({data, depth = 0}: {data: FileNode | null, depth?: number}) => {
//     if (!data) return ""
//
//     const [open, setOpen] = useState(false)
//
//     const fileType = (data.m&FileMode.ModeDir) == 0 ? "File" : "Folder"
//
//     return (
//         <>
//             <tr onDblClick={() => setOpen(!open)}>
//                 <td>{data.m}</td>
//                 {/*<td>{n.ModAt}</td>*/}
//                 <td>{format(data.mod, "PP 'at' HH:mm")}</td>
//                 <td>{formatSize(data.s)}</td>
//                 <td>{fileType}</td>
//             </tr>
//             {open && (fileType == "Folder") && map(data.child, (f, i) => <FileRow key={`[${i}]/${data.p}/${data.n}`} data={f} depth={depth + 1} />)}
//         </>
//     )
// }