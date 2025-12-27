import {isEmpty, map} from "lodash";
import {CopyText} from "./CopyText";
import {h, Fragment} from "preact";

export const LabelsTable = ({Labels}: { Labels: Record<string, string> }) => {
    if (isEmpty(Labels)) return ""
    return (
        <>
            <h4 className="py-4 px-2 mt-4 font-bold text-sm text-base-content/30">Labels</h4>
            <div className="overflow-x-auto rounded-box border border-base-content/20">
                <table className="table table-sm table-zebra table-fixed truncate text-nowrap">
                    <thead>
                    <tr>
                        <th className="w-6/12">Key</th>
                        <th className="w-6/12">Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {map(Labels, (value, label) => (
                        <tr key={label}>
                            <td>
                                <CopyText text={label}/>
                            </td>
                            <td>
                                <CopyText text={value}/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}