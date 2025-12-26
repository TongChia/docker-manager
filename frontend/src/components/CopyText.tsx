import {h} from "preact";
import {cx} from "../utils/classnames";
import {useCallback, useState} from "preact/hooks";
import {CheckIcon, CopyIcon} from "./icons";
import {ClipboardSetText} from "../../wailsjs/runtime";

function useCopyToClipboard() {
    const [isCopied, setIsCopied] = useState(false);
    const [error, setError] = useState(null);

    const copy = useCallback(async (text: string) => {
        await ClipboardSetText(text);

        setIsCopied(true);
        setError(null);

        // 3秒后重置
        setTimeout(() => setIsCopied(false), 3000);
        return true;
    }, []);

    return { copy, isCopied, error };
}

export const CopyText = ({text, copyText = text, className, right = false, ...rest}: {text: string, copyText?: string, className?: string, right?: boolean}) => {
    const { copy, isCopied } = useCopyToClipboard()
    return (text || copyText) ? (
        <div className={cx("flex items-center gap-1 copy-text", {"flex-row-reverse": right, "copy-text-ok": isCopied}, className)} {...rest} onClick={() => copy(copyText)} >
            <div className="overflow-hidden text-ellipsis">{text}</div>
            <span className="copy-icon">
                {isCopied ?
                    <CheckIcon className="w-3.5 h-3.5 fill-success" /> :
                    <CopyIcon className="w-3.5 h-3.5 fill-current" />
                }
            </span>
        </div>
    ) : ""
}