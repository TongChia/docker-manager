import {CopyText} from "../components/CopyText";
import * as volume from "../../bindings/github.com/moby/moby/api/types/volume";
import {h, Fragment} from "preact";
import {isEmpty} from "lodash";
import {LabelsTable} from "../components/LabelsTable";


export const VolumeInfo = ({data}: {data: volume.Volume}) => {
    console.debug({volume: data})
    return (
        <>
            <div className="overflow-x-auto rounded-box border border-base-content/20">
                <table className="table table-sm table-fixed truncate text-nowrap">
                    <tbody>
                    <tr>
                        <th className="text-nowrap w-2/12">Name</th>
                        <td className="w-10/12"><CopyText text={data.Name} right/></td>
                    </tr>
                    <tr>
                        <th>Mount point</th>
                        <td><CopyText text={data.Mountpoint} right/></td>
                    </tr>
                    <tr>
                        <th>Created</th>
                        <td className="text-right overflow-hidden text-ellipsis">{data.CreatedAt}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            {isEmpty(data.Labels) ? "" : <LabelsTable Labels={data.Labels} />}
        </>
    )
}