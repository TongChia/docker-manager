import {VolumeList} from "../../bindings/docker-manager/app";
import {assign, get, map, sortBy} from "lodash";
import {batch, signal, Signal} from "@preact/signals";
import {Volume} from "../../bindings/github.com/moby/moby/api/types/volume";
import {formatSize} from "../utils/docker";
import {format, formatDistanceToNowStrict} from "date-fns";
import {Events} from "@wailsio/runtime";
import {WailsEvent} from "@wailsio/runtime/types/events";
import {Message} from "../../bindings/github.com/moby/moby/api/types/events";

export interface $Volume extends Volume {
    size: string
    created: string
    unused: boolean
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

export const state: Signal<$Volume[]> = signal([])
export const total: Signal<string> = signal(formatSize(0))
export const loaded: Signal<boolean> = signal(false)

export const update = () => VolumeList().then(resp => {
    batch(() => {
        loaded.value = true
        state.value = sortBy(map(resp?.Items, to$Volume), ["unused", "CreatedAt"])
        total.value = formatSize(resp?.TotalSize)
    })
})

export const listen = () => {
    return Events.On("message:volume", (ev: WailsEvent<"message:volume">) => {
        const msg = ev.data as Message
        update().catch(console.error)
        // TODO: switch volume event action
        console.debug("message:volume", msg)
    })
}
