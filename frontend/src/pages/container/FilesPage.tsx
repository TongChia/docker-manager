import {h, Fragment} from "preact";
import {RoutePropsForPath} from "preact-iso";
import {useEffect, useState} from "preact/hooks";
import {ContainerFiles} from "../../../bindings/docker-manager/app";
import {FileNode} from "../../../bindings/docker-manager";
import {FilesTable} from "../../components/FilesTable";
import {Loading} from "../../components/Loading";
import {isEmpty} from "lodash";
import {NoContent} from "../../components/NoContent";


export function FilesPage({params}: RoutePropsForPath<"/:id/*">) {
    const [rootFile, setFiles] = useState<FileNode | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ContainerFiles(params.id).then((f) => {
            // console.debug("Container Files", f)
            setFiles(f)
        }).catch(console.error).finally(() => setLoading(false))
    }, []);

    if (loading) return <Loading />
    if (isEmpty(rootFile)) return <NoContent />
    return <FilesTable data={rootFile} />
}
