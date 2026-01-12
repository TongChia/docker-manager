import {batch, computed, signal, Signal} from "@preact/signals";
import {NetworkList} from "../../bindings/docker-manager/app";
import {assign, get, map, size} from "lodash";
import {Summary} from "../../bindings/github.com/moby/moby/api/types/network";
import {Events} from "@wailsio/runtime";
import {WailsEvent} from "@wailsio/runtime/types/events";
import {Message} from "../../bindings/github.com/moby/moby/api/types/events";

export interface $Network extends Summary {
    id: string
    subnet: string
    gateway: string
}

const to$Network = (item: Summary): $Network => assign(item, {
    id: item.Id.slice(0, 12),
    subnet: get(item, ["IPAM", "Config", 0, "Subnet"], ""),
    gateway: get(item, ["IPAM", "Config", 0, "Gateway"], ""),
})

export const state: Signal<$Network[]> = signal([])
export const total = computed(() => size(state.value))
export const loaded: Signal<boolean> = signal(false)

export const update = () => NetworkList().then(list => {
    batch(() => {
        loaded.value = true
        state.value = map(list, to$Network)
    })
})

export const listen = () => Events.On("message:network", (ev: WailsEvent<"message:network">) => {
    const msg = ev.data as Message
    console.debug("message:network", msg)
    update().catch(console.error)
    // TODO: switch network event action
})
