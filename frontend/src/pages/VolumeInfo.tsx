import {h} from "preact";
import {KVTable, PropTable} from "../components/PropTable";
import {$Volume} from "../states/volume";


export const VolumeInfo = ({data}: { data: $Volume }) => {
    console.debug({volume: data})
    return (
        <div className="flex flex-col gap-4">
            <KVTable data={[
                {key: "Name", value: data.Name, copyable: true},
                {key: "Mount point", value: data.Mountpoint, copyable: true},
                {key: "Created", value: data.created},
                {key: "Size", value: data.size},
            ]}/>
            <PropTable title="Labels" data={data.Labels}/>
        </div>
    )
}