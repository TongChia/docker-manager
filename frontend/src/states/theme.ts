import {createContext} from "preact";
import {Dispatch, StateUpdater, useEffect, useState} from "preact/hooks";

export const themes = ["default", "light", "dark", "synthwave", "dracula", "nord", "coffee", "retro", "winter", "cupcake"] as const
export type Theme = typeof themes[number]
export const ThemePrimary = createContext<{
    theme: Theme;
    setTheme: Dispatch<StateUpdater<Theme>>;
} | null>(null);

export const useDialogMask = (): [boolean, Dispatch<StateUpdater<boolean>>] => {
    const [mask, setMask] = useState(false)

    useEffect(() => {
        // <dialog className="modal" open={dialog} />
        let $mask = document.getElementById("dialog-mask") as HTMLDialogElement
        if (!$mask) {
            $mask = document.createElement("dialog")
            $mask.id = "dialog-mask"
            $mask.className = "modal"
            document.getElementById("app")?.appendChild($mask)
        }
        $mask.open = mask
    }, [mask])

    return [mask, setMask]
}