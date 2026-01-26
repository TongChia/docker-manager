import {h} from "preact";
import {useEffect, useState} from "preact/hooks";
import {ImageFilesDive} from "../../../bindings/docker-manager/app";
import {FileNode, Layer} from "../../../bindings/docker-manager";
import {Loading} from "../../components/Loading";
import {RoutePropsForPath} from "preact-iso";
import {NoContent} from "../../components/NoContent";
import {FilesTable} from "../../components/FilesTable";
import {filter, first, isNil, last, map} from "lodash";
import {Group, Panel, Separator} from "react-resizable-panels";
import {CopyText} from "../../components/CopyText";
import {cx} from "../../utils/classnames";

export const FilesPage = ({params}: RoutePropsForPath<"/:id/*">) => {
    if (params.id == "0") return <NoContent />

    const [layers, setLayers] = useState<Layer[]>([])
    const [root, setRoot] = useState<FileNode | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ImageFilesDive(params.id).then((r) => {
            setLayers(filter(r, l => !isNil(l)))
            setRoot(first(r)?.Tree || null)
        }).catch(console.error).finally(() => setLoading(false))
    }, []);

    if (loading) return <Loading />

    return (
        <Group className="w-full" orientation="vertical">
            <Panel defaultSize={200} className="overflow-y-scroll w-full bg-amber-100 text-gray-600">
                <table className="table table-xs w-full table-fixed truncate">
                    <tbody>
                    {map(layers, (l, i) => <tr className={cx({"bg-amber-300": root == l.Tree})}>
                        <td className="w-5 text-gray-400">{i}</td>
                        <td className="overflow-hidden text-ellipsis whitespace-nowrap" onClick={() => setRoot(l.Tree)}>
                            {/* TODO: replace `file:xxx` to `blob` */}
                            <CopyText text={l.Command} clickIconOnly />
                        </td>
                    </tr>)}
                    </tbody>
                </table>
            </Panel>
            <Separator className="h-2 w-full bg-base-content/10 hover:bg-base-content/20 cursor-row-resize focus:outline-none"
                       aria-orientation="vertical"/>
            <Panel className="overflow-y-scroll">
                <FilesTable data={root} perm />
            </Panel>
        </Group>
    )
}