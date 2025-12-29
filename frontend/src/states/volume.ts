import {ImageList, VolumeList} from "../../bindings/docker-manager/app";
import {assign, get, map, sortBy} from "lodash";
import {signal, Signal} from "@preact/signals";
import {Volume} from "../../bindings/github.com/moby/moby/api/types/volume";
import {VolumesDiskUsage} from "../../bindings/github.com/moby/moby/client";
import {formatSize} from "../utils/docker";
import { formatDistanceToNowStrict, format } from "date-fns";

export interface $Volume extends Volume {
    size: string
    created: string
    unused: boolean
}

export interface $VolumesDiskUsage extends VolumesDiskUsage {
    totalSize: string
    // totalCount: string
    items: $Volume[]
}

const formatCreated = (s?: string): string => {
    if (!s) return ""
    const date = Date.parse(s)

    return `${formatDistanceToNowStrict(date)} (${format(date, "PP 'at' HH:mm")})`
}

const to$Volume = (item: Volume): $Volume => (assign(item, {
    size: formatSize(get(item, ["UsageData", "Size"], 0)),
    created: formatCreated(item.CreatedAt),
    unused: !item.UsageData?.RefCount
}))

export const state: Signal<$VolumesDiskUsage | null> = signal(null)

export const update = () => VolumeList().then(resp => {
    state.value = assign(resp, {
        totalSize: formatSize(resp?.TotalSize),
        items: sortBy(map(resp?.Items, to$Volume), ["unused", "CreatedAt"])
    })
})


