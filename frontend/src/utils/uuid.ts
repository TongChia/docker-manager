import {join, memoize, sampleSize} from "lodash";

export const memoizeUUID = memoize((str: string) => self.crypto.randomUUID())

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const randomId = (length: number) => join(sampleSize(chars, length), '')
