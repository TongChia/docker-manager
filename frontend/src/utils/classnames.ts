import {concat, isEmpty, isString, join, reduce} from "lodash";
import {Signalish} from "preact";

export const cx = (...rest: Array<string | undefined | Record<string, boolean> | Signalish<string | undefined>>) =>
    join(reduce(rest, (r, cls) => isEmpty(cls) ? r : concat(r, isString(cls) ? cls : reduce(cls, (r, v, k) => v ? concat(r, k) : r, [] as string[])), [] as string[]), " ")


