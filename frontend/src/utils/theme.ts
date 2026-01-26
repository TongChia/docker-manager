import {sample} from "lodash";
import {ITheme} from "@xterm/xterm";

const classNames = [
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


// Source from https://github.com/sonph/onehalf/blob/141c775ace6b71992305f144a8ab68e9a8ca4a25/fluentterminal/OneHalfDark.flutecolors
export const OneHalfDark: ITheme = {
    foreground: '#DCDFE4',
    background: 'rgba(0,0,0,0)',
    cursor: '#DCDFE4', // #313640
    cursorAccent: '#282C34',

    selectionBackground: '#474E5D',
    // selectionForeground: '#DCDFE4',
    selectionInactiveBackground: '#474E5D',

    black: '#282C34',
    brightBlack: '#282C34',

    red: '#E06C75',
    brightRed: '#E06C75',

    green: '#98C379',
    brightGreen: '#98C379',

    yellow: '#E5C07B',
    brightYellow: '#E5C07B',

    blue: '#61AFEF',
    brightBlue: '#61AFEF',

    magenta: '#C678DD',
    brightMagenta: '#C678DD',

    cyan: '#56B6C2',
    brightCyan: '#56B6C2',

    white: '#DCDFE4',
    brightWhite: '#DCDFE4'
}

// Source from https://github.com/sonph/onehalf/blob/141c775ace6b71992305f144a8ab68e9a8ca4a25/fluentterminal/OneHalfLight.flutecolors
export const OneHalfLight: ITheme = {
    foreground: '#383A42',
    background: 'rgba(0,0,0,0)',
    cursor: '#383A42', // #F0F0F0
    cursorAccent: '#FAFAFA',

    selectionBackground: '#BFCEFF',
    // selectionForeground: '#383A42',
    selectionInactiveBackground: '#BFCEFF',

    black: '#383A42',
    brightBlack: '#383A42',

    red: '#E45649',
    brightRed: '#E45649',

    green: '#50A14F',
    brightGreen: '#50A14F',

    yellow: '#C18401',
    brightYellow: '#C18401',

    blue: '#0184BC',
    brightBlue: '#0184BC',

    magenta: '#A626A4',
    brightMagenta: '#A626A4',

    cyan: '#0997B3',
    brightCyan: '#0997B3',

    white: '#FAFAFA',
    brightWhite: '#FAFAFA'
}

const daisyThemeDark = {
    "color-scheme": "dark",
    "--color-base-100": "oklch(25.33% 0.016 252.42)",
    "--color-base-200": "oklch(23.26% 0.014 253.1)",
    "--color-base-300": "oklch(21.15% 0.012 254.09)",
    "--color-base-content": "oklch(97.807% 0.029 256.847)",
    "--color-primary": "oklch(58% 0.233 277.117)",
    "--color-primary-content": "oklch(96% 0.018 272.314)",
    "--color-secondary": "oklch(65% 0.241 354.308)",
    "--color-secondary-content": "oklch(94% 0.028 342.258)",
    "--color-accent": "oklch(77% 0.152 181.912)",
    "--color-accent-content": "oklch(38% 0.063 188.416)",
    "--color-neutral": "oklch(14% 0.005 285.823)",
    "--color-neutral-content": "oklch(92% 0.004 286.32)",
    "--color-info": "oklch(74% 0.16 232.661)",
    "--color-info-content": "oklch(29% 0.066 243.157)",
    "--color-success": "oklch(76% 0.177 163.223)",
    "--color-success-content": "oklch(37% 0.077 168.94)",
    "--color-warning": "oklch(82% 0.189 84.429)",
    "--color-warning-content": "oklch(41% 0.112 45.904)",
    "--color-error": "oklch(71% 0.194 13.428)",
    "--color-error-content": "oklch(27% 0.105 12.094)",
}

const daisyThemeLight = {
    "color-scheme": "light",
    "--color-base-100": "oklch(100% 0 0)",
    "--color-base-200": "oklch(98% 0 0)",
    "--color-base-300": "oklch(95% 0 0)",
    "--color-base-content": "oklch(21% 0.006 285.885)",
    "--color-primary": "oklch(45% 0.24 277.023)",
    "--color-primary-content": "oklch(93% 0.034 272.788)",
    "--color-secondary": "oklch(65% 0.241 354.308)",
    "--color-secondary-content": "oklch(94% 0.028 342.258)",
    "--color-accent": "oklch(77% 0.152 181.912)",
    "--color-accent-content": "oklch(38% 0.063 188.416)",
    "--color-neutral": "oklch(14% 0.005 285.823)",
    "--color-neutral-content": "oklch(92% 0.004 286.32)",
    "--color-info": "oklch(74% 0.16 232.661)",
    "--color-info-content": "oklch(29% 0.066 243.157)",
    "--color-success": "oklch(76% 0.177 163.223)",
    "--color-success-content": "oklch(37% 0.077 168.94)",
    "--color-warning": "oklch(82% 0.189 84.429)",
    "--color-warning-content": "oklch(41% 0.112 45.904)",
    "--color-error": "oklch(71% 0.194 13.428)",
    "--color-error-content": "oklch(27% 0.105 12.094)",
}

export const toXtermjsTheme: (src: Record<string, string>) => ITheme = (src) => ({
    foreground: src["--color-accent"],
    background: src["--color-base-100"],
    cursor: src["--color-primary"],
    cursorAccent: src["--color-primary"],

    selectionBackground: src["--color-primary"],
    selectionForeground: src["--color-primary-content"],
    selectionInactiveBackground: src["--color-primary"],

    black: src["--color-accent-content"],
    brightBlack: src["--color-accent-content"],

    red: src["--color-error"],
    brightRed: src["--color-error"],

    green: src["--color-success"],
    brightGreen: src["--color-success"],

    yellow: src["--color-warning"],
    brightYellow: src["--color-warning"],

    blue: src["--color-info"],
    brightBlue: src["--color-info"],

    magenta: '#A626A4',
    brightMagenta: '#A626A4',

    cyan: '#0997B3',
    brightCyan: '#0997B3',

    white: src["--color-base-content"],
    brightWhite: src["--color-base-content"]
})

export const XTermThemeDark: ITheme = toXtermjsTheme(daisyThemeDark)
export const XTermThemeLight: ITheme = toXtermjsTheme(daisyThemeLight)

// TODO: System.IsDarkMode()
export const XTermDefaultTheme: ITheme = XTermThemeDark
