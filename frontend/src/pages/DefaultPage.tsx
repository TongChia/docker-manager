import {NoContent} from "../components/NoContent";
import {h} from "preact";

export const DefaultPage = () => (
    <div className="drawer-content h-dvh bg-base-100">
        <nav className="navbar w-full bg-base-300 grow-0 flex justify-between" />
        <NoContent />
    </div>
)