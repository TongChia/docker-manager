import {VolumeList} from "../../wailsjs/go/main/App";
import {volume} from "../../wailsjs/go/models";
import {useEffect, useState} from "preact/hooks";
import {h, Fragment} from 'preact';


export function Volumes(props: any) {
    const [volumes, setVolumes] = useState<Array<volume.Volume>>([]);
    const updateVolumes = (list: Array<volume.Volume>) => setVolumes(list);

    useEffect(() => {
        VolumeList().then(updateVolumes);
    }, []);


    return (
        <>
            <div>
                <div>
                    {volumes.length === 0 ? (
                        <div>
                            <p>No containers found. Click "Fetch Containers" to load.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-sm">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Mount point</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {volumes.map((vol) => (
                                    <tr key={vol.Name}>
                                        <td>{vol.Name}</td>
                                        <td>{vol.Mountpoint}</td>
                                        <td>{vol.Status}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}