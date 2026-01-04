import {computed, signal, Signal} from "@preact/signals";
import {NetworkList} from "../../bindings/docker-manager/app";
import {assign, get, map, size} from "lodash";
import {Summary} from "../../bindings/github.com/moby/moby/api/types/network";

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

export const update = () => NetworkList().then(list => {
    state.value = map(list, to$Network)
})
