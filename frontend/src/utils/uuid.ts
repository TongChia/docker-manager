import {memoize} from "lodash";

export const memoizeUUID = memoize((str: string) => self.crypto.randomUUID())