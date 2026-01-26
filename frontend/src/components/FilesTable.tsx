import {Fragment, h} from "preact";
import {FileNode} from "../../bindings/docker-manager";
import {map} from "lodash";
import {useState} from "preact/hooks";
import {FileMode} from "../../bindings/io/fs";
import {formatSize} from "../utils/docker";
import {DraftIcon, FileExportIcon, FolderIcon, FolderOpenIcon, TerminalIcon} from "./icons";
import {cx} from "../utils/classnames";
import {DiffType} from "../../bindings/github.com/wagoodman/dive/dive/filetree";
import {format} from "date-fns";

type FileType = "Folder" | "Symlink" | "File"

export const FilesTable = ({data, perm}: { data: FileNode | null, perm?: boolean }) => {
    return (
        <table className="table table-zebra table-xs table-fixed truncate">
            <thead className="text-xs">
            <tr>
                <th className="w-6/12">Name</th>
                {perm ? <th className="w-20">Permission</th> : <th className="w-34">Date Modified</th>}
                <th className="w-14">Size</th>
                <th className="w-16">Kind</th>
            </tr>
            </thead>
            <tbody>
            {map(data?.child, f => (<FileRow key={f?.n} data={f} perm={perm}/>))}
            </tbody>
        </table>
    )
}

const FileRow = ({data, depth = 1, perm = false}: { data: FileNode | null, depth?: number, perm?: boolean }) => {
    if (!data) return ""

    const {n: name, p: path, s: size, m, mod, dir, diff, child} = data
    const rwx = map("rwxrwxrwx", (c, i) => ((m & (1 << (9 - 1 - i))) != 0) ? c : "-")
    const executable = rwx[2] == "x"
    const fileType: FileType = (m & FileMode.ModeDir) != 0 ? "Folder" : (m & FileMode.ModeSymlink) != 0 ? "Symlink" : "File"
    const fileColor = {
        "fill-info": dir && diff == DiffType.Unmodified,
        "fill-neutral-content": !dir && diff == DiffType.Unmodified,
        "fill-warning": diff == DiffType.Modified,
        "fill-error": diff == DiffType.Removed,
        "fill-success": diff == DiffType.Added,
    }
    const [open, setOpen] = useState(false)

    return (
        <>
            <tr onDblClick={dir ? () => setOpen(!open) : undefined}>
                <td className="flex gap-1" style={{"padding-left": depth * 8 + "px"}}>
                    <FileIcon fileType={fileType} open={open} executable={executable} className={cx("w-4", fileColor)}/>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">{name}</div>
                </td>
                {perm ?
                    <td>{rwx}</td> :
                    <td className="overflow-hidden text-ellipsis whitespace-nowrap">{mod ? format(mod, "PP 'at' HH:mm") : ""}</td>
                }
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">{size ? formatSize(size) : ""}</td>
                <td className="overflow-hidden text-ellipsis whitespace-nowrap">{fileType}</td>
            </tr>
            {open && dir && map(child, (f, i) =>
                <FileRow key={`[${i}]/${f?.p}/${f?.n}`} data={f} depth={depth + 1} perm={perm}/>)}
        </>
    )
}

const FileIcon = ({open, executable, fileType, className}: {
    open: boolean,
    executable: boolean,
    fileType: FileType,
    className: string
}) => {
    return (
        <div>
            {
                fileType == "Folder" ?
                    <label className={cx("swap", {"swap-active": open}, className)}>
                        <FolderOpenIcon className="w-4 swap-on"/>
                        <FolderIcon className="w-4 swap-off"/>
                    </label> :
                    fileType == "Symlink" ? <FileExportIcon className={className}/> :
                        executable ? <TerminalIcon className={className}/> :
                            <DraftIcon className={className}/>
            }
        </div>
    )
}
