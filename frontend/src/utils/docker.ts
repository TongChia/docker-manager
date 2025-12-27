import * as container from "../../bindings/github.com/moby/moby/api/types/container";
import {some} from "lodash";

export const isK8s = ({Labels}: container.Summary) => some(Labels, (v, k) => k == 'io.kubernetes.pod.name');

export const isCompose = ({Labels}: container.Summary) => some(Labels, (v, k) => k == 'com.docker.compose.project');

export const formatSize = (v: number, n: number = 0, units: string[] = ["B", "KB", "MB", "GB", "TB"]): string => (v > 1000 && n < units.length) ? formatSize(v / 1000, n + 1) : `${v.toFixed(0)} ${units[n]}`