import {sample} from "lodash";

const classNames =[
    "fill-orange-300",
    "fill-amber-300",
    "fill-lime-300",
    "fill-teal-300",
    "fill-sky-400",
    "fill-indigo-400",
    "fill-violet-300",
    "fill-fuchsia-400",
    "fill-rose-300",
]

export const randomColor = () => sample(classNames) || "fill-teal-300"

export const memoizeWithStorage = <T>(func: (arg: string) => T) => (arg: string): T => {
    const key = `${func.name}_${arg}`;
    const cachedResult = localStorage.getItem(key);
    if (cachedResult) return JSON.parse(cachedResult);
    const result = func(arg);
    localStorage.setItem(key, JSON.stringify(result));
    return result;
}

export const memoizeColor = memoizeWithStorage(randomColor)
