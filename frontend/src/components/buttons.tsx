import {h} from "preact";

export const PlayStopBtn = ({status: x}: { status: string }) => (
    <button className="btn btn-ghost btn-xs btn-square fill-current">
        {
            x == "Stopped" ?
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M240-240v-480h480v480H240Z"/></svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M320-200v-560l440 280-440 280Z"/></svg>
        }
    </button>
)
export const DeleteBtn = () => (
    <button className="btn btn-ghost btn-xs btn-square fill-current">
        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
    </button>
)
