import {Fragment, h, HTMLAttributes} from "preact";
import {FileNode} from "../../bindings/docker-manager";
import {cond, eq, get, map} from "lodash";
import {useState} from "preact/hooks";
import {FileMode} from "../../bindings/io/fs";
import {formatSize} from "../utils/docker";
import {DraftIcon, FileExportIcon, FolderIcon, FolderOpenIcon, TerminalIcon} from "./icons";
import {cx} from "../utils/classnames";
import {DiffType} from "../../bindings/github.com/wagoodman/dive/dive/filetree";
import {format} from "date-fns";

type FileType = "Folder" | "Symlink" | "File"

export const FilesTable = ({data, perm}: { data: FileNode | null, perm?: boolean }) => {
    const [selected, setSelected] = useState("")

    return (
        <table className="table table-zebra table-xs table-fixed">
            <thead className="text-xs">
            <tr>
                <th className="w-6/12">Name</th>
                {perm ? <th className="w-20">Permission</th> : <th className="w-34">Date Modified</th>}
                <th className="w-14">Size</th>
                <th className="w-16">Kind</th>
            </tr>
            </thead>
            <tbody>
            {map(data?.child, f => {
                if (!f) return ""
                const fullPath = `${f.p}/${f.n}`
                return <FileRow key={f.n} data={f} perm={perm} onClick={() => setSelected(fullPath)}
                             className={cx("hover:bg-primary/30", {"bg-primary/30": selected === fullPath})} />
            })}
            </tbody>
        </table>
    )
}

type FileRowProps = { data: FileNode | null, depth?: number, perm?: boolean } & HTMLAttributes<HTMLTableRowElement>
const FileRow = ({data, depth = 1, perm = false, ...rest}: FileRowProps) => {
    if (!data) return ""

    const {n: name, p: path, s: size, m, mod, dir, diff, child} = data
    const rwx = map("rwxrwxrwx", (c, i) => ((m & (1 << (9 - 1 - i))) != 0) ? c : "-")
    const executable = rwx[2] == "x"
    const fileType: FileType = (m & FileMode.ModeDir) != 0 ? "Folder" : (m & FileMode.ModeSymlink) != 0 ? "Symlink" : "File"
    const [open, setOpen] = useState(false)

    return (
        <>
            <tr onDblClick={dir ? () => setOpen(!open) : undefined} {...rest}>
                <td className="flex gap-1" style={{"padding-left": depth * 8 + "px"}}>
                    <FileIcon fileType={fileType} diffType={diff} open={open} executable={executable} />
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

const FileIcon = ({open, executable, fileType, diffType}: {
    open: boolean,
    executable: boolean,
    fileType: FileType,
    diffType: DiffType,
}) => {
    const color = get({
        [DiffType.Unmodified]: fileType === "Folder" ? "fill-info" : "fill-neutral-content",
        [DiffType.Modified]: "fill-warning",
        [DiffType.Removed]: "fill-error",
        [DiffType.Added]: "fill-success",
    }, diffType, "fill-neutral-content")
    const clz = "w-4 " + color

    if (fileType == "Folder") return (
        <label className={cx("swap", {"swap-active": open}, clz)}>
            <FolderOpenIcon className="w-4 swap-on"/>
            <FolderIcon className="w-4 swap-off"/>
        </label>
    )
    if (fileType == "Symlink") return <FileExportIcon className={clz}/>
    if (executable) return <TerminalIcon className={clz}/>
    return <DraftIcon className={clz}/>
}
