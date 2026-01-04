import {NoContent} from "../components/NoContent";
import {h} from "preact";
import {useLocation} from "preact-iso";
import {useEffect} from "preact/hooks";

export const DefaultPage = () => {
    const {route, path} = useLocation();

    useEffect(() => {
        if (path == "/") setTimeout(() => route("/containers/0/none", true), 0)
    }, [path])

    return (
        <div className="drawer-content h-dvh bg-base-100">
            <nav className="navbar w-full bg-base-300 grow-0 flex justify-between"/>
            <NoContent/>
        </div>
    )
}