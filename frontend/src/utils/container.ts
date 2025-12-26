import {container} from "../../wailsjs/go/models";
import {some} from "lodash";

export const isK8s = ({Labels}: container.Summary) => some(Labels, (v, k) => k == 'io.kubernetes.pod.name');

export const isCompose = ({Labels}: container.Summary) => some(Labels, (v, k) => k == 'com.docker.compose.project');
