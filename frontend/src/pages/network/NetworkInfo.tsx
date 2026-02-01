import {h} from "preact";
import {KVTable, PropTable} from "../../components/PropTable";
import {$Network} from "../../states/network";


export const NetworkInfo = ({data}: { data: $Network }) => {
    console.debug({Network: data})
    return (
        <div className="flex flex-col gap-4">
            <KVTable data={[
                {key: "Name", value: data.Name, copyable: true},
                {key: "ID", value: data.id, copyText: data.Id},
                {key: "Created", value: data.Created},
                {key: "Gateway", value: data.gateway},
                {key: "Driver", value: data.Driver},
                {key: "Scope", value: data.Scope},
            ]}/>
            <PropTable title="Options" data={data.Options}/>
            <PropTable title="Labels" data={data.Labels}/>
        </div>
    )
}