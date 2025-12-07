import {ListContainers} from "../../wailsjs/go/main/DockerApp";
import {container} from "../../wailsjs/go/models";
import {useEffect, useState} from "preact/hooks";
import {h, Fragment} from 'preact';

const isK8sContainer = (container: container.Summary) =>
    Object.keys(container.Labels).some(label => label.startsWith('io.kubernetes'));

const isComposeContainer = (container: container.Summary) =>
    Object.keys(container.Labels).some(label => label.startsWith('com.docker.compose'));

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
        ListContainers().then(updateContainers);
    }, []);

    return (
        <>
            <div>
                <div>
                    {containers.length === 0 ? (
                        <div>
                            <p>No containers found. Click "Fetch Containers" to load.</p>
                        </div>
                    ) : (
                        <div>
                            <ul>

                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}