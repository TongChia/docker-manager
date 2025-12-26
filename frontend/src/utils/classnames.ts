import {concat, isEmpty, isString, isUndefined, join, reduce} from "lodash";

export const cx = (...rest: Array<string | undefined | Record<string, boolean>>) =>
    join(reduce(rest, (r, cls) => isEmpty(cls) ? r : concat(r, isString(cls) ? cls : reduce(cls, (r, v, k) => v ? concat(r, k) : r, [] as string[])), [] as string[]), " ")


