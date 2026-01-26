import {EventHandler, h, TargetedMouseEvent} from "preact";
import {cx} from "../utils/classnames";
import {useCallback, useState} from "preact/hooks";
import {CheckIcon, CopyIcon} from "./icons";
import {Clipboard} from "@wailsio/runtime";

function useCopyToClipboard() {
    const [isCopied, setIsCopied] = useState(false);
    const [error, setError] = useState(null);

    const copy = useCallback(async (text: string) => {
        await Clipboard.SetText(text);

        setIsCopied(true);
        setError(null);

        // 3秒后重置
        setTimeout(() => setIsCopied(false), 3000);
        return true;
    }, []);

    return {copy, isCopied, error};
}

export const CopyText = ({text, copyText = text, className, right = false, clickIconOnly = false, ...rest}: {
    text?: string,
    copyText?: string,
    className?: string,
    right?: boolean,
    clickIconOnly?: boolean,
}) => {
    if (!text) return ""
    const {copy, isCopied} = useCopyToClipboard()
    const onClick: EventHandler<TargetedMouseEvent<HTMLDivElement>> = (e) => {
        e.stopPropagation()
        copy(copyText || text).catch(console.error)
    }
    return (
        <div className={cx("flex items-center gap-1 copy-text", {
            "flex-row-reverse": right,
            "copy-text-ok": isCopied
        }, className)} {...rest} onClick={!clickIconOnly ? onClick : undefined}>
            <div className="overflow-hidden text-ellipsis">{text}</div>
            <span className="copy-icon" onClick={clickIconOnly ? onClick : undefined}>
                {isCopied ?
                    <CheckIcon className="w-3.5 h-3.5 fill-success"/> :
                    <CopyIcon className="w-3.5 h-3.5 fill-current"/>
                }
            </span>
        </div>
    )
}