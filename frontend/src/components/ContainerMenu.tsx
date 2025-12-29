import {h} from "preact";
import type {EventHandler, TargetedEvent} from "preact";
import {$Compose, $Container, execStartOrStop} from "../states/container"
import {get, map} from "lodash";
import {DeleteBtn, PlayBtn} from "./buttons";
import {useState} from "preact/hooks";
import {cx} from "../utils/classnames";
import {useRoute} from "preact-iso";
import {ContainerFillIcon, StackIcon} from "./icons";

export const ContainerDropdown = ({data}: { data: $Compose }) => {
    const {params, path} = useRoute()
    const [open, setOpen] = useState(false)
    const isSelected = data.id == params.id
    const isStop = data.state == "stopped"

    const onClickPlayBtn: EventHandler<TargetedEvent> = (event) => {
        event.stopPropagation() // 阻止事件冒泡
        event.preventDefault()
        execStartOrStop(map(data.items, "id"), isStop)
    }

    return (
        <li className={cx({"disabled": isStop})}>
            <details open={open} onToggle={(event) => setOpen(get(event.target, 'open', false))}>
                <summary onDblClick={() => setOpen(!open)} className={cx({"menu-active": isSelected})}>
                    <a className="grid grid-cols-[min-content_auto] gap-2 items-center h-12"
                       href={`/containers/${data.id}/info`}>
                        <span className="icon "><StackIcon/></span>
                        {data.name}
                    </a>
                    <span>
                        <PlayBtn state={data.state} onClick={onClickPlayBtn}/>
                        <DeleteBtn/>
                    </span>
                </summary>
                <ul>
                    {map(data.items, (item) => (<ContainerItem key={item.id} data={item}/>))}
                </ul>
            </details>
        </li>
    )
}

export const ContainerItem = ({data}: { data: $Container }) => {
    const {params} = useRoute()
    const isSelected = data.id == params.id
    const isStop = data.state == "stopped"

    const onClick = () => {
        execStartOrStop([data.id], isStop)
    }

    return (
        <li className={cx({"disabled": isStop})}>
            <span className={cx("grid-cols-[auto_max-content]", {"menu-active": isSelected})}>
            <a className="grid grid-cols-[min-content_auto] gap-2 items-center h-12"
               href={`/containers/${data.id}/info`}>
                <span className="icon mask mask-circle fill-neutral-content w-8 h-8 p-1 bg-cyan-500">
                    <ContainerFillIcon/>
                </span>
                <div className="truncate text-nowrap">
                    <p className="overflow-hidden text-ellipsis">{get(data, ["raw", "Labels", "com.docker.compose.service"], data.name)}</p>
                    <p className="overflow-hidden text-ellipsis text-current/50">{data.raw.Image}</p>
                </div>
            </a>
            <span>
                <PlayBtn state={data.state} onClick={onClick}/>
                <DeleteBtn/>
            </span>
            </span>
        </li>
    )
}
