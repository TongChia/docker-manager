import {batch, signal, Signal} from "@preact/signals";
import {Summary} from "../../bindings/github.com/moby/moby/api/types/image";
import {ImageList} from "../../bindings/docker-manager/app";
import {Events} from "@wailsio/runtime";
import {WailsEvent} from "@wailsio/runtime/types/events";
import {Message} from "../../bindings/github.com/moby/moby/api/types/events";
import {assign, head, map, sortBy, split} from "lodash";
import {formatSize, shortId} from "../utils/docker";
import {format, formatDistanceToNowStrict} from "date-fns";


export const state: Signal<$Image[]> = signal([])
export const total: Signal<string> = signal(formatSize(0))
export const loaded: Signal<boolean> = signal(false)

export interface $Image extends Summary {
    id: string
    created: string
    size: string
    unused: boolean
    distance: string
    tag?: string

    get name(): string
}

let _now = Date.now() / 1000

const to$Image = (item: Summary): $Image => assign(item, {
    id: shortId(item.Id),
    created: format(new Date(item.Created * 1000), "PP 'at' HH:mm"),
    size: formatSize(item.Size),
    unused: !item.Containers,
    fromNow: _now - item.Created,
    distance: formatDistanceToNowStrict(new Date(item.Created * 1000), {addSuffix: true}),
    tag: head(item.RepoTags) || split(head(item.RepoDigests), "@")[0],
    get name() {
        return this.tag || this.id
    }
})

// TODO: image repo logo
export const update = () => ImageList().then(result => {
    _now = Date.now() / 1000
    batch(() => {
        loaded.value = true
        state.value = sortBy(map(result?.Items, to$Image), ["unused", "fromNow"])
        total.value = formatSize(result?.TotalSize)
    })
})

export const listen = () => {
    return Events.On("message:image", (ev: WailsEvent<"message:image">) => {
        const msg = ev.data as Message
        console.debug("message:image", msg)
    })
}
