import {h, InputHTMLAttributes, SelectHTMLAttributes} from "preact";
import {find, kebabCase, map} from "lodash";
import {cx} from "../../src/utils/classnames";

type Option = {
    value: string, dft?: boolean, txt?: string,
}

type InputParams = {
    label: string, desc?: string, err?: string, type?: string, placeholder?: string, id?: string
}
export const MyInput = ({
                            label,
                            type = "text",
                            desc,
                            err,
                            placeholder = "",
                            id = kebabCase(label),
                            ...rest
                        }: InputParams & InputHTMLAttributes) => {
    return (
        <div className={cx("flex flex-row py-2 px-3", {"tooltip tooltip-error tooltip-open": !!err})} data-tip={err}>
            <label for={id}>
                {label}
                <p className="text-xs text-base-content/50">{desc}</p>
            </label>
            <input id={id} type={type} className="outline-none text-right grow h-5"
                   placeholder={placeholder} {...rest}/>
        </div>)
}

type SelectParams = { label: string, desc?: string, id?: string, options: Option[] }
export const MySelect = ({
                             label,
                             id = kebabCase(label),
                             desc,
                             options,
                             ...rest
                         }: SelectParams & SelectHTMLAttributes) => {
    const dftValue = find(options, opt => opt.dft)
    return (<div className="flex flex-row py-2 px-3">
        <label className="grow" for={id}>
            {label}
            <p className="text-xs text-base-content/50">{desc}</p>
        </label>
        <select id={id} className="outline-none text-right h-5" defaultValue={dftValue?.value} {...rest}>
            {map(options, ({dft, value, txt = value}) => <option default={dft} value={value}>{txt}</option>)}
        </select>
    </div>)
}

type ToggleParams = { label: string, desc?: string, id?: string }
export const MyToggle = ({label, id = kebabCase(label), desc, ...rest}: ToggleParams & InputHTMLAttributes) => (
    <div className="flex flex-row py-2 px-3">
        <label className="text-sm grow" htmlFor={id}>
            {label}
            <p className="text-xs text-base-content/50">{desc}</p>
        </label>
        <input id={id} type="checkbox" className="toggle toggle-sm" {...rest}/>
    </div>
)

export const MyDivider = () => <div className="w-11.5/12 mx-2 border-t border-base-content/10"/>
