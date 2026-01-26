import {ButtonHTMLAttributes, h} from "preact";
import {cx} from "../utils/classnames";
import {$Summary} from "../states/container";
import {Browser} from "@wailsio/runtime";
import {RefreshIcon, RemoveIcon} from "./icons";


export const LinkBtn = ({url}: {url: string}) => (
    <button className="btn btn-ghost btn-xs btn-square fill-current" onClick={() => {
        Browser.OpenURL(url).catch(console.error)
    }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 -960 960 960"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>
    </button>
)

export const PlayBtn = ({state, ...rest}: { state: $Summary["state"] } & ButtonHTMLAttributes) => (
    <button
        className={cx("btn btn-ghost btn-xs btn-square fill-current text-current", {"btn-disabled": state == "loading"})} {...rest}>
        {state == "loading" ?
            <span className="loading loading-spinner loading-xs"></span> :
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="20px" width="20px">
                {state == "stopped" ? <path d="M320-200v-560l440 280-440 280Z"/> :
                    <path d="M240-240v-480h480v480H240Z"/>}
            </svg>
        }
    </button>
)

export const DeleteBtn = () => (
    <button className="btn btn-ghost btn-xs btn-square fill-current">
        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
    </button>
)

export const SearchBtn = () => (
    <button className="btn btn-ghost btn-square fill-current">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
            <path
                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
        </svg>
    </button>
)

export const ShareBtn = () => (
    <button className="btn btn-ghost btn-xs btn-square fill-current">
        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
                d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z"/>
        </svg>
    </button>
)

export const PlusBtn = ({className, ...rest}: ButtonHTMLAttributes) => (
    <button className={cx("btn btn-ghost btn-xs btn-square fill-current", className)} {...rest}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="size-full">
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
        </svg>
    </button>
)

export const RefreshBtn = ({className, ...rest}: ButtonHTMLAttributes) => (
    <button className={cx("btn btn-ghost btn-xs btn-square fill-current", className)} {...rest}>
        <RefreshIcon className="size-full" />
    </button>
)
export const MinusBtn = ({className, ...rest}: ButtonHTMLAttributes) => (
    <button className={cx("btn btn-ghost btn-xs btn-square fill-current", className)} {...rest}>
        <RemoveIcon className="size-full" />
    </button>
)