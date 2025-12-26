import {computed, Signal, signal} from "@preact/signals";
import {container, events} from "../../wailsjs/go/models";
import {EventsOnMultiple} from "../../wailsjs/runtime";
import {ContainerById, ContainerList, StartContainer, StopContainer} from "../../wailsjs/go/main/App";
import {memoizeUUID} from "../utils/uuid";
import {isCompose, isK8s} from "../utils/container";
import {
    assign,
    concat,
    every,
    filter,
    get,
    groupBy,
    head,
    includes,
    map,
    reject,
    replace, set,
    size,
    some,
    sortBy
} from "lodash";

type SummaryType = "Kubernetes" | "Compose" | "Container" | "Pod"

export interface $Summary {
    type: SummaryType
    id: string
    name: string
    state: "stopped" | "running" | "paused" | "loading"
    isStop: boolean
}

export class $Container extends container.Summary implements $Summary {
    public type: $Summary["type"] = "Container"

    constructor(
        source: container.Summary,
        public id: string = source.Id.slice(0, 12),
        public name: string = replace(head(source.Names) || "no_name", "/", ""),
        public raw: container.Summary = source,
    ) {
        super(source)
    }

    #state?: $Summary["state"]

    get state() {
        if (this.#state)
            return this.#state
        switch (this.raw.State) {
            case "running":
                return "running"
            case "paused":
                return "paused"
            case "exited":
            case "dead":
                return "stopped"
            case "created":
            case "restarting":
            case "removing":
            default:
                return "loading"
        }
    }

    set state(v) {
        this.#state = v
    }

    get isStop() {
        return this.state == 'stopped'
    }
}

export class $Compose implements $Summary {
    public type: $Summary["type"] = "Compose"

    constructor(
        source: $Container[],
        public name: string,
        public id: string = memoizeUUID(name),
        public items: $Container[] = source,
    ) {
    }

    get state() {
        if (every(this.items, {state: "stopped"})) // 所以子容器关闭
            return "stopped"
        if (every(this.items, ({state}) => includes(["stopped", "paused"], state))) // 子容器有的关闭、有的暂停
            return "paused"
        if (some(this.items, {state: "loading"})) // 有子容器处于 loading 状态
            return "loading"
        return "running"
    }

    get isStop() {
        return this.state == 'stopped'
    }
}

export class $Kubernetes extends $Compose implements $Summary {
    public type: SummaryType = "Kubernetes"

    constructor(source: $Container[]) {
        super(source, "Kubernetes");
    }
}

export const is$Container = (item: $Summary): item is $Container => item.type === 'Container'
export const is$Compose = (item: $Summary): item is $Compose => item.type === 'Compose'

export const state: Signal<Array<$Container>> = signal([])

export const update = () => ContainerList().then((list) => {
    state.value = map(list, item => new $Container(item))
})

export const addOne = (Id: string) => ContainerById(Id).then(item => {
    state.value = concat(state.peek(), new $Container(item))
})

export const updateOne = (Id: string) => ContainerById(Id).then(item => {
    state.value = map(state.peek(), ($item) => $item.Id == Id ? new $Container(item) : $item)
})

export const removeOne = (Id: string) => {
    state.value = reject(state.peek(), {Id})
}

export const setState = (Ids: string[], s: $Summary["state"]) => {
    state.value = map(state.peek(), ($item) => includes(Ids, $item.id) ? set($item, "state", s) : $item)
}

export const execStartOrStop = (Ids: string[], isStop: boolean) => {
    setState(Ids, "loading")
    const promise = isStop ? StartContainer(Ids) : StopContainer(Ids)
    promise.catch(err => console.error("exec start container, Ids: ", Ids, err))
}

export const grouped = computed<$Summary[]>(() => {
    const groupByType = groupBy(state.value, item => isK8s(item.raw) ? "k8s" : isCompose(item.raw) ? "compose" : "others")
    const groupByProject = groupBy(get(groupByType, "compose", []), item => get(item.raw.Labels, ["com.docker.compose.project"]))
    const projects = map(groupByProject, (items, name) => new $Compose(items, name)) as $Summary[]
    const k8s = groupByType["kubernetes"] ? new $Kubernetes(groupByType["k8s"]) as $Summary : []
    const others = get(groupByType, "others", []) as $Summary[]
    return sortBy(concat([], k8s, projects, others), "isStop")
});

export const running = computed(() => size(filter(state.value, {"state": "running"})))

export const listen = () => {

    /*
    ActionCreate       Action = "create"
	ActionStart        Action = "start"
	ActionRestart      Action = "restart"
	ActionStop         Action = "stop"
	ActionCheckpoint   Action = "checkpoint"
	ActionPause        Action = "pause"
	ActionUnPause      Action = "unpause"
	ActionAttach       Action = "attach"
	ActionDetach       Action = "detach"
	ActionResize       Action = "resize"
	ActionUpdate       Action = "update"
	ActionRename       Action = "rename"
	ActionKill         Action = "kill"
	ActionDie          Action = "die"
	ActionOOM          Action = "oom"
	ActionDestroy      Action = "destroy"
	ActionRemove       Action = "remove"
	ActionCommit       Action = "commit"
	ActionTop          Action = "top"
	ActionCopy         Action = "copy"
	ActionArchivePath  Action = "archive-path"
	ActionExtractToDir Action = "extract-to-dir"
	ActionExport       Action = "export"
	ActionImport       Action = "import"
	ActionSave         Action = "save"
	ActionLoad         Action = "load"
	ActionTag          Action = "tag"
	ActionUnTag        Action = "untag"
	ActionPush         Action = "push"
	ActionPull         Action = "pull"
	ActionPrune        Action = "prune"
	ActionDelete       Action = "delete"
	ActionEnable       Action = "enable"
	ActionDisable      Action = "disable"
	ActionConnect      Action = "connect"
	ActionDisconnect   Action = "disconnect"
	ActionReload       Action = "reload"
	ActionMount        Action = "mount"
	ActionUnmount      Action = "unmount"
     */

    return EventsOnMultiple("message:container", (msg: events.Message) => {
        console.debug("get action", msg.Action, msg.Actor.ID, msg)
        switch (msg.Action) {
            case "create":
                return addOne(msg.Actor.ID)
            case "start":
                return updateOne(msg.Actor.ID)
            case "kill":
                return setState([msg.Actor.ID], "loading")
            case "stop": // TODO: 处理此事件
            case "die":
                return updateOne(msg.Actor.ID)
            case "destroy":
                return removeOne(msg.Actor.ID)
            default :
                console.debug("Unhandled action", msg.Action)
        }
    }, 0)
}