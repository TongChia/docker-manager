import { Events, Window } from '@wailsio/runtime';
import {h, render} from 'preact';
import "./style.css";
import {MyDivider, MyInput, MySelect, MyToggle} from "../components/form";
import {useForm} from "@felte/preact";
import {CreateContainer} from "../../bindings/docker-manager/app";
import {CreateContainerParams} from "../../bindings/docker-manager";
import {RestartPolicyMode} from "../../bindings/github.com/moby/moby/api/types/container";
import {get} from "lodash";

const Main = () => {
    const closeDialog = () => Window.Name().then(name => Events.Emit(`dialog:${name}:close`))
    const { form, errors } = useForm({
        onSubmit(values, {event}) {
            const params = new CreateContainerParams(values)
            params.startUp = get(event as SubmitEvent, ["submitter", "id"]) === "create-start-btn"
            CreateContainer(params).then((r) => {
                console.debug("ContainerCreateResult", r)
                return closeDialog()
            }).catch((err) => {
                console.error(err) // TODO: show error
            })
        },
        validate: undefined // TODO
    });
    const err = errors()
    const theme = JSON.parse(localStorage.getItem("theme") || "null")

    return (
        <div className="w-full h-screen bg-base-100 select-none flex flex-col" data-theme={theme}>
            <h1 className="py-4 px-6 header font-black text-sm">New Container</h1>
            <form id="config-form" className="w-full px-4 grow flex flex-col gap-2 text-sm overflow-y-auto" ref={form}>
                <div className="bg-base-200 border-base-content/10 rounded-box border flex flex-col">
                    <MyInput label="Image" name="image" required/>
                    <MyDivider />
                    <MySelect label="Platform" name="platform" options={[
                        {value: "", txt: "auto", dft: true},
                        {value: "amd64"},
                        {value: "arm/v7"},
                    ]} />
                </div>
                <div className="bg-base-200 border-base-content/10 rounded-box border flex flex-col">
                    <MyInput label="Name" name="name" placeholder="default"/>
                    <MyDivider />
                    <MyToggle label="Remove after stop" name="rm" desc="Automatically delete the container after it stop. (--rm)"/>
                    <MyDivider />
                    <MySelect label="Restart policy" name="restart" options={[
                        {value: RestartPolicyMode.RestartPolicyDisabled, txt: "No", dft: true},
                        {value: RestartPolicyMode.RestartPolicyAlways, txt: "Always"},
                        {value: RestartPolicyMode.RestartPolicyOnFailure, txt: "On failure"},
                        {value: RestartPolicyMode.RestartPolicyUnlessStopped, txt: "Unless stopped"},
                    ]} desc="Whethrt to restart the container automatically if it stops. (--restart)"/>
                </div>
                <h1 className="px-2 pt-5 font-bold">Payload</h1>
                <div className="bg-base-200 border-base-content/10 rounded-box border flex flex-col">
                    <MyInput label="Command" name="command" placeholder="default" desc="Command to run in the container."/>
                    <MyDivider />
                    <MyInput label="Entrypoint" name="entrypoint" placeholder="default" desc="(--entrypoint)"/>
                    <MyDivider />
                    <MyInput label="Working directory" name="workdir" placeholder="default" desc="Working directory for the command. (--workdir)"/>
                </div>
                <h1 className="px-2 pt-5 font-bold">Advanced</h1>
                <div className="bg-base-200 border-base-content/10 rounded-box border flex flex-col">
                    <MyToggle label="Privileged" name="privileged" desc="Allow access to privileged API and resources. (--privileged)"/>
                    <MyDivider />
                    <MyToggle label="Read-only" name="read-only" desc="Mount the container's root filesystem as read-only. (--read-only)"/>
                    <MyDivider />
                    <MyToggle label="Use docker-init" name="init" desc="Run the container payload under a docker-init process. (--init)"/>
                </div>

            </form>

            <div className="w-full">
                <div className="divider divider-base-content/10 w-full my-0 h-0.5" />

                <div className="p-4 flex flex-row-reverse justify-start gap-2">
                    <button id="create-start-btn" className="btn btn-xs btn-primary" type="submit" form="config-form">Create & Start</button>
                    <button id="create-btn" className="btn btn-xs btn-soft" type="submit" form="config-form">Create</button>
                    <button id="cancel" className="btn btn-xs btn-soft" onClick={closeDialog}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

render(<Main/>, document.getElementById('app')!);
