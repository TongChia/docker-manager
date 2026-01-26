import {h, SVGAttributes} from "preact";

export const ContainerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px"
         viewBox="0 -960 960 960" width="24px">
        <path
            d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-40-343 237-137-237-137-237 137 237 137ZM160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11L160-252Zm320-228Z"/>
    </svg>
)

export const VolumeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px"
         viewBox="0 -960 960 960" width="24px">
        <path
            d="M160-280h640v-240H160v240Zm520-60q25 0 42.5-17.5T740-400q0-25-17.5-42.5T680-460q-25 0-42.5 17.5T620-400q0 25 17.5 42.5T680-340Zm200-260H767l-80-80H273l-80 80H80l137-137q11-11 25.5-17t30.5-6h414q16 0 30.5 6t25.5 17l137 137ZM160-200q-33 0-56.5-23.5T80-280v-320h800v320q0 33-23.5 56.5T800-200H160Z"/>
    </svg>
)

export const VolumeFillIcon = (props: SVGAttributes<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
        <path
            d="M680-320q25 0 42.5-17t17.5-43q0-25-17.5-42.5T680-440q-26 0-43 17.5T620-380q0 26 17 43t43 17ZM80-600l136-136q11-11 25.5-17.5T273-760h413q17 0 31.5 6.5T743-736l137 136H80Zm80 400q-34 0-57-23t-23-57v-240h800v240q0 34-23.5 57T800-200H160Z"/>
    </svg>
)

export const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
         width="24px">
        <path
            d="M640-480v-80h80v80h-80Zm0 80h-80v-80h80v80Zm0 80v-80h80v80h-80ZM447-640l-80-80H160v480h400v-80h80v80h160v-400H640v80h-80v-80H447ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80v-480 480Z"/>
    </svg>
)

export const NetworkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
         width="24px">
        <path
            d="M120-80v-280h120v-160h200v-80H320v-280h320v280H520v80h200v160h120v280H520v-280h120v-80H320v80h120v280H120Zm280-600h160v-120H400v120ZM200-160h160v-120H200v120Zm400 0h160v-120H600v120ZM480-680ZM360-280Zm240 0Z"/>
    </svg>
)

export const ContainerFillIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
         width="24px">
        <path
            d="M444-105 180-258q-17.1-9.88-26.55-26.06Q144-300.23 144-320v-320q0-19.77 9.45-35.94Q162.9-692.12 180-702l263-152q17-10 37-10t37 10l263 152q17.1 9.88 26.55 26.06Q816-659.77 816-640v320q0 19.77-9.45 35.94Q797.1-267.88 780-258L516-105q-17.13 10-36.07 10Q461-95 444-105Zm0-354v270l36 21 36-21v-270l228-132v-49l-30-17-234 135-235-135-29 17v49l228 132Z"/>
    </svg>
)

export const ServiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
         width="24px">
        <path
            d="m300-300 280-80 80-280-280 80-80 280Zm180-120q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z"/>
    </svg>
)

export const TerminalIcon = (props: SVGAttributes<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H160v400Zm140-40-56-56 103-104-104-104 57-56 160 160-160 160Zm180 0v-80h240v80H480Z"/>
    </svg>
)

export const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px"
         viewBox="0 -960 960 960" width="24px">
        <path
            d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z"/>
    </svg>
)

export const StackIcon = () => (
    <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 -960 960 960">
        <path
            d="M480-400 40-640l440-240 440 240-440 240Zm0 160L63-467l84-46 333 182 333-182 84 46-417 227Zm0 160L63-307l84-46 333 182 333-182 84 46L480-80Z"/>
    </svg>
)

export const CopyIcon = ({className}: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path
            d="M760-200H320q-33 0-56.5-23.5T240-280v-560q0-33 23.5-56.5T320-920h280l240 240v400q0 33-23.5 56.5T760-200ZM560-640v-200H320v560h440v-360H560ZM160-40q-33 0-56.5-23.5T80-120v-560h80v560h440v80H160Zm160-800v200-200 560-560Z"/>
    </svg>
)

export const CheckIcon = (props: SVGAttributes<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
    </svg>
)

export const FileExportIcon = (props: SVGAttributes<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}><path d="m202-65-56-57 118-118h-90v-80h226v226h-80v-89L202-65Zm278-15v-320H160v-400q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H480Zm40-520h200L520-800l200 200-200-200v200Z"/></svg>
)

export const DraftIcon = (props: SVGAttributes<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z"/></svg>
)

export const FolderIcon = (props: SVGAttributes<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
        <path
            d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Z"/>
    </svg>
)

export const FolderOpenIcon = (props: SVGAttributes<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"  {...props}>
        <path
            d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H160v400l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Z"/>
    </svg>
)

export const ChevronRightIcon = (props: SVGAttributes<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
    </svg>
)

export const RefreshIcon = (props: SVGAttributes<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>
)

export const RemoveIcon = (props: SVGAttributes<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}><path d="M200-440v-80h560v80H200Z"/></svg>
)