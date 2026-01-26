import * as container from "../../bindings/github.com/moby/moby/api/types/container";
import {replace, some} from "lodash";

export const isK8s = ({Labels}: container.Summary) => some(Labels, (v, k) => k == 'io.kubernetes.pod.name');

export const isCompose = ({Labels}: container.Summary) => some(Labels, (v, k) => k == 'com.docker.compose.project');

export const formatSize = (v?: number, n: number = 0, units: string[] = ["B", "KB", "MB", "GB", "TB"]): string => v ? (v > 1000 && n < units.length) ? formatSize(v / 1000, n + 1) : `${v.toFixed(n > 0 ? n - 1 : 0)} ${units[n]}` : 'Zero KB'

export const shortId = (id: string) => replace(id, "sha256:", "").slice(0, 12)

export const formatUnixTime = (t: number) => new Date(t * 1000).toISOString()

