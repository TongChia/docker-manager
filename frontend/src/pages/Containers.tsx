import {ContainerList} from "../../wailsjs/go/main/App";
import {container} from "../../wailsjs/go/models";
import {useEffect, useState} from "preact/hooks";
import {h, Fragment} from 'preact';
import {DeleteBtn, PlayStopBtn} from "../components/buttons";

const isK8sContainer = (container: container.Summary) =>
    Object.keys(container.Labels).some(label => label.startsWith('io.kubernetes'));

const isComposeContainer = (container: container.Summary) =>
    Object.keys(container.Labels).some(label => label.startsWith('com.docker.compose'));

const isStopped = (container: container.Summary) =>
    container.State === 'exited' || container.State === 'paused';

export function Containers(props: any) {
    const [containers, setContainers] = useState<Array<container.Summary>>([]);
    const updateContainers = (list: Array<container.Summary>) => {
        let k8sContainers = [], composeContainers = [], otherContainers = [];

        for (const c of list) {
            if (isK8sContainer(c)) {
                k8sContainers.push(c);
            } else if (isComposeContainer(c)) {
                composeContainers.push(c);
            } else {
                otherContainers.push(c);
            }
        }

        setContainers(otherContainers);
    }

    useEffect(() => {
        // window.addEventListener('resize', onResize);
        // return () => window.removeEventListener('resize', onResize);
        ContainerList().then(updateContainers);
    }, []);

    return (
        <div>
            {containers.length === 0 ? (
                <div>
                    <p>No containers found. Click "Fetch Containers" to load.</p>
                </div>
            ) : (
                <div>
                    <ul className="menu my-menu w-full">
                        <li className="menu-title text-left text-xs font-bold text-base-content/20 is-drawer-close:hidden">Stopped</li>
                        <li>
                            <details>
                                <summary>
                                    <svg className="fill-cyan-500 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-400 40-640l440-240 440 240-440 240Zm0 160L63-467l84-46 333 182 333-182 84 46-417 227Zm0 160L63-307l84-46 333 182 333-182 84 46L480-80Zm0-411 273-149-273-149-273 149 273 149Zm0-149Z"/></svg>
                                    <div>ns-workspace</div>
                                        {/* Status */}
                                    <PlayStopBtn status={"Stopped"} />
                                    <DeleteBtn />
                                </summary>
                                <ul>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li><a>Item 3</a></li>
                    </ul>
                </div>
            )}
        </div>
    )
}