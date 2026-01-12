import {h} from 'preact';

export function Settings() {
    return (
        <div className="drawer-content h-dvh bg-base-100">
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
                                <label className="flex gap-2 cursor-pointer items-center">
                                    <input type="radio" name="theme-radios" className="radio radio-sm theme-controller" value="default"/>
                                    Default
                                </label>
                                <label className="flex gap-2 cursor-pointer items-center">
                                    <input type="radio" name="theme-radios" className="radio radio-sm theme-controller" value="retro"/>
                                    Retro
                                </label>
                                <label className="flex gap-2 cursor-pointer items-center">
                                    <input type="radio" name="theme-radios" className="radio radio-sm theme-controller" value="cyberpunk"/>
                                    Cyberpunk
                                </label>
                                <label className="flex gap-2 cursor-pointer items-center">
                                    <input type="radio" name="theme-radios" className="radio radio-sm theme-controller" value="valentine"/>
                                    Valentine
                                </label>
                                <label className="flex gap-2 cursor-pointer items-center">
                                    <input type="radio" name="theme-radios" className="radio radio-sm theme-controller" value="aqua"/>
                                    Aqua
                                </label>
                            </fieldset>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
