import {h} from "preact";
import {useLocation} from "preact-iso";
import {
    ContainerFillIcon,
    ContainerIcon,
    ImageIcon,
    NetworkIcon,
    ServiceIcon,
    SettingsIcon,
    TerminalIcon,
    VolumeIcon
} from "./icons";
import {map, startsWith} from "lodash";
import {cx} from "../utils/classnames";

export const MainMenu = () => {
    const {path, route} = useLocation()

    // console.debug("main menu", {path, route})

    const menus = {
        "Docker": [
            {name: "Containers", href: "/containers/0/none", root: "/containers", icon: ContainerIcon},
            {name: "Volumes", href: "/volumes/0/none", root: "/volumes", icon: VolumeIcon},
            {name: "Images", href: "/images/0/none", root: "/images", icon: ImageIcon},
            {name: "Networks", href: "/networks/0/none", root: "/networks", icon: NetworkIcon},
        ],
        "Kubernetes": [
            {name: "Pods", href: "/pods", icon: ContainerFillIcon},
            {name: "Services", href: "/services", icon: ServiceIcon}
        ],
        "General": [
            {name: "Terminal", href: "/terminal", icon: () => <TerminalIcon className="w-6" />},
            {name: "Settings", href: "/settings", icon: SettingsIcon},
        ]
    }

    return (
        <ul className="menu main-menu w-full grow">

            <li className="menu-title text-left text-xs font-bold text-base-content/20 is-drawer-close:hidden">Docker</li>

            {map(menus.Docker, (m) => (
                <li key={m.name}>
                    <a className={cx("is-drawer-close:tooltip is-drawer-close:tooltip-right", {
                        "menu-active": path == m.href,
                        "menu-active-2": startsWith(path, m.root)
                    })}
                       data-tip={m.name} href={m.href}>
                        {m.icon()}
                        <span className="is-drawer-close:hidden">{m.name}</span>
                    </a>
                </li>
            ))}

            <li className="is-drawer-open:hidden"/>
            <li className="menu-title text-left text-xs font-bold text-base-content/20 pt-6 is-drawer-close:hidden">Kubernetes</li>

            {map(menus.Kubernetes, m => (
                <li>
                    <a className={cx("is-drawer-close:tooltip is-drawer-close:tooltip-right", {
                        "menu-active": path == m.href,
                        "menu-active-2": startsWith(path, m.href)
                    })}
                       data-tip={m.name} href={m.href}>
                        {m.icon()}
                        <span className="is-drawer-close:hidden">{m.name}</span>
                    </a>
                </li>
            ))}

            <li className="is-drawer-open:hidden"/>
            <li className="menu-title text-left text-xs font-bold text-base-content/20 pt-6 is-drawer-close:hidden">General</li>

            {map(menus.General, m => (
                <li>
                    <a className={cx("is-drawer-close:tooltip is-drawer-close:tooltip-right", {
                        "menu-active": path == m.href,
                        "menu-active-2": startsWith(path, m.href)
                    })}
                       data-tip={m.name} href={m.href}>
                        {m.icon()}
                        <span className="is-drawer-close:hidden">{m.name}</span>
                    </a>
                </li>
            ))}
        </ul>
    )
}