import {h, Fragment} from "preact";
import {GuiexpertTable} from './GuiexpertTable';
import {
    ColumnDef,
    ColumnDefIf,
    GeMouseEvent,
    px120,
    px220,
    TableApi,
    TableFactory,
    TableOptions,
    TreeFactory
} from '@guiexpert/table';
import {FileNode} from "../../bindings/docker-manager";

export const FilesTableGuiexpert = ({data}: { data: FileNode }) => {

    const tableOptions = {
        ...new TableOptions(),
        // getSelectionModel: () => selectionModel
    };
    const rows = TreeFactory.buildTreeRows<FileNode>([data], "child");
    const tableModel = TableFactory.createTableModel({
        rows,
        columnDefs: createTreePeopleColumnDefs(),
        tableOptions,
        fixedLeftColumnCount: 1,
        fixedRightColumnCount: 1
    });

    const tableReady = (api: TableApi) => {
        console.info('Table API:', api);
        return {}
    };

    const onMouseClicked = (evt: GeMouseEvent) => {
        console.info('Mouse:', evt);
        return {}
    };

    return (
        <div className="text-xs size-full">
            <GuiexpertTable
                tableModel={tableModel}
                tableOptions={tableOptions}
                mouseClicked={onMouseClicked}
                tableReady={tableReady}
            />
        </div>
    );
};

/*
    "n": string;
    "p": string;
    "s": number;
    "t": number;
    "l": string;
    "m": os$0.FileMode;
    "dir": boolean;
    "diff": filetree$0.DiffType;
    "child": (FileNode | null)[];
 */
function createTreePeopleColumnDefs(): ColumnDefIf[] {
    return [
        new ColumnDef("n", "Name", px220),
        new ColumnDef("p", "Path", px120),
        new ColumnDef("s", "Size", px120),
        // ColumnDef.create({
        //     property: "age",
        //     headerLabel: "Age",
        //     width: px80,
        //     bodyRenderer: new NumberCellRenderer(),
        //     editable: TrueFn,
        //     editInputPipe: editInputPipeForNumber
        // }),
        // new ColumnDef("birth", "Birthday", px100,
        //     undefined,
        //     Renderer.bodyRenderer(new DateToIntlDDMMYYYYCellRenderer())),
        //
        // ColumnDef.create({
        //     property: "gender",
        //     headerLabel: " ",
        //     width: px50,
        //     bodyRenderer: new MaleFemaleToIconCellRenderer(),
        //     editable: TrueFn,
        //     getEditRenderer: () => new SelectCellRenderer([
        //         new ValueLabel("female", "♀"),
        //         new ValueLabel("male", "♂")
        //     ])
        // }),
        //
        // new ColumnDef("address.street", "Strasse", px150),
        // new ColumnDef("address.number", "Nr", px70),
        // new ColumnDef("address.zip", "Zip", px60),
        // new ColumnDef("address.city", "City", px120),
        // new ColumnDef("address.country", "Country", px120),
        // new ColumnDef("id", "ID", px60)
    ];
}