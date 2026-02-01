import {h, GenericEventHandler} from 'preact';
import {ThemePrimary, Theme, themes} from "../states/theme";
import {get, map} from "lodash";
import {useContext} from "preact/hooks";

export function Settings() {

    const { theme, setTheme } = useContext(ThemePrimary) || {};
    const onSelectTheme: GenericEventHandler<HTMLSelectElement> = (ev) => setTheme?.(get(ev.target, 'value', theme) as Theme)

    return (
        <div className="drawer-content h-dvh bg-base-200">
            <nav className="navbar w-full bg-base-300 grow-0 flex justify-between">
                <div className="px-4">
                    <p className="font-bold">Settings</p>
                </div>
            </nav>
            <div className="flex items-center justify-between">
                <table className="grow">
                    <tbody>
                    <tr>
                        <td className="w-5/12 text-right align-text-top p-8">
                            <p className="font-bold">Themes:</p>
                            <p className="text-sm">(preview)</p>
                        </td>
                        <td className="w-7/12 p-8">
                            <fieldset className="fieldset">
                                <select className="select" value={theme} onChange={onSelectTheme}>
                                    {map(themes, (v) =>
                                        <option value={v}>{v}</option>
                                    )}
                                </select>
                            </fieldset>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
