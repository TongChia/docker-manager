import {h} from "preact";


export const Loading = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <span className="skeleton skeleton-text font-title text-4xl text-current/30">Loading</span>
        </div>
    )
}