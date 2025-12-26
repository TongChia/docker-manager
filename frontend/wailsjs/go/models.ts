export namespace container {
	
	export class HealthSummary {
	    Status: string;
	    FailingStreak: number;
	
	    static createFrom(source: any = {}) {
	        return new HealthSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Status = source["Status"];
	        this.FailingStreak = source["FailingStreak"];
	    }
	}
	export class MountPoint {
	    Source: string;
	    Destination: string;
	    Mode: string;
	    RW: boolean;
	    Propagation: string;
	
	    static createFrom(source: any = {}) {
	        return new MountPoint(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Source = source["Source"];
	        this.Destination = source["Destination"];
	        this.Mode = source["Mode"];
	        this.RW = source["RW"];
	        this.Propagation = source["Propagation"];
	    }
	}
	export class NetworkSettingsSummary {
	    Networks: Record<string, network.EndpointSettings>;
	
	    static createFrom(source: any = {}) {
	        return new NetworkSettingsSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Networks = this.convertValues(source["Networks"], network.EndpointSettings, true);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PortSummary {
	    // Go type: netip
	    IP?: any;
	    PrivatePort: number;
	    PublicPort?: number;
	    Type: string;
	
	    static createFrom(source: any = {}) {
	        return new PortSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.IP = this.convertValues(source["IP"], null);
	        this.PrivatePort = source["PrivatePort"];
	        this.PublicPort = source["PublicPort"];
	        this.Type = source["Type"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Summary {
	    Id: string;
	    Names: string[];
	    Image: string;
	    ImageID: string;
	    ImageManifestDescriptor?: v1.Descriptor;
	    Command: string;
	    Created: number;
	    Ports: PortSummary[];
	    Labels: Record<string, string>;
	    State: string;
	    Status: string;
	    // Go type: struct { NetworkMode string "json:\",omitempty\""; Annotations map[string]string "json:\",omitempty\"" }
	    HostConfig: any;
	    ""?: HealthSummary;
	    NetworkSettings?: NetworkSettingsSummary;
	    Mounts: MountPoint[];
	
	    static createFrom(source: any = {}) {
	        return new Summary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Names = source["Names"];
	        this.Image = source["Image"];
	        this.ImageID = source["ImageID"];
	        this.ImageManifestDescriptor = this.convertValues(source["ImageManifestDescriptor"], v1.Descriptor);
	        this.Command = source["Command"];
	        this.Created = source["Created"];
	        this.Ports = this.convertValues(source["Ports"], PortSummary);
	        this.Labels = source["Labels"];
	        this.State = source["State"];
	        this.Status = source["Status"];
	        this.HostConfig = this.convertValues(source["HostConfig"], Object);
	        this[""] = this.convertValues(source[""], HealthSummary);
	        this.NetworkSettings = this.convertValues(source["NetworkSettings"], NetworkSettingsSummary);
	        this.Mounts = this.convertValues(source["Mounts"], MountPoint);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace events {
	
	export class Actor {
	    ID: string;
	    Attributes: Record<string, string>;
	
	    static createFrom(source: any = {}) {
	        return new Actor(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Attributes = source["Attributes"];
	    }
	}
	export class Message {
	    Type: string;
	    Action: string;
	    Actor: Actor;
	    scope?: string;
	    time?: number;
	    timeNano?: number;
	
	    static createFrom(source: any = {}) {
	        return new Message(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Type = source["Type"];
	        this.Action = source["Action"];
	        this.Actor = this.convertValues(source["Actor"], Actor);
	        this.scope = source["scope"];
	        this.time = source["time"];
	        this.timeNano = source["timeNano"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace image {
	
	export class AttestationProperties {
	    For: string;
	
	    static createFrom(source: any = {}) {
	        return new AttestationProperties(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.For = source["For"];
	    }
	}
	export class ImageProperties {
	    Platform: v1.Platform;
	    // Go type: struct { Unpacked int64 "json:\"Unpacked\"" }
	    Size: any;
	    Containers: string[];
	
	    static createFrom(source: any = {}) {
	        return new ImageProperties(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Platform = this.convertValues(source["Platform"], v1.Platform);
	        this.Size = this.convertValues(source["Size"], Object);
	        this.Containers = source["Containers"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ManifestSummary {
	    ID: string;
	    Descriptor: v1.Descriptor;
	    Available: boolean;
	    // Go type: struct { Content int64 "json:\"Content\""; Total int64 "json:\"Total\"" }
	    Size: any;
	    Kind: string;
	    ImageData?: ImageProperties;
	    AttestationData?: AttestationProperties;
	
	    static createFrom(source: any = {}) {
	        return new ManifestSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Descriptor = this.convertValues(source["Descriptor"], v1.Descriptor);
	        this.Available = source["Available"];
	        this.Size = this.convertValues(source["Size"], Object);
	        this.Kind = source["Kind"];
	        this.ImageData = this.convertValues(source["ImageData"], ImageProperties);
	        this.AttestationData = this.convertValues(source["AttestationData"], AttestationProperties);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Summary {
	    Containers: number;
	    Created: number;
	    Id: string;
	    Labels: Record<string, string>;
	    ParentId: string;
	    Descriptor?: v1.Descriptor;
	    Manifests?: ManifestSummary[];
	    RepoDigests: string[];
	    RepoTags: string[];
	    SharedSize: number;
	    Size: number;
	
	    static createFrom(source: any = {}) {
	        return new Summary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Containers = source["Containers"];
	        this.Created = source["Created"];
	        this.Id = source["Id"];
	        this.Labels = source["Labels"];
	        this.ParentId = source["ParentId"];
	        this.Descriptor = this.convertValues(source["Descriptor"], v1.Descriptor);
	        this.Manifests = this.convertValues(source["Manifests"], ManifestSummary);
	        this.RepoDigests = source["RepoDigests"];
	        this.RepoTags = source["RepoTags"];
	        this.SharedSize = source["SharedSize"];
	        this.Size = source["Size"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace network {
	
	export class EndpointIPAMConfig {
	
	
	    static createFrom(source: any = {}) {
	        return new EndpointIPAMConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class EndpointSettings {
	    // Go type: EndpointIPAMConfig
	    IPAMConfig?: any;
	    Links: string[];
	    Aliases: string[];
	    DriverOpts: Record<string, string>;
	    GwPriority: number;
	    NetworkID: string;
	    EndpointID: string;
	    // Go type: netip
	    Gateway: any;
	    // Go type: netip
	    IPAddress: any;
	    MacAddress: number[];
	    IPPrefixLen: number;
	    // Go type: netip
	    IPv6Gateway: any;
	    // Go type: netip
	    GlobalIPv6Address: any;
	    GlobalIPv6PrefixLen: number;
	    DNSNames: string[];
	
	    static createFrom(source: any = {}) {
	        return new EndpointSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.IPAMConfig = this.convertValues(source["IPAMConfig"], null);
	        this.Links = source["Links"];
	        this.Aliases = source["Aliases"];
	        this.DriverOpts = source["DriverOpts"];
	        this.GwPriority = source["GwPriority"];
	        this.NetworkID = source["NetworkID"];
	        this.EndpointID = source["EndpointID"];
	        this.Gateway = this.convertValues(source["Gateway"], null);
	        this.IPAddress = this.convertValues(source["IPAddress"], null);
	        this.MacAddress = source["MacAddress"];
	        this.IPPrefixLen = source["IPPrefixLen"];
	        this.IPv6Gateway = this.convertValues(source["IPv6Gateway"], null);
	        this.GlobalIPv6Address = this.convertValues(source["GlobalIPv6Address"], null);
	        this.GlobalIPv6PrefixLen = source["GlobalIPv6PrefixLen"];
	        this.DNSNames = source["DNSNames"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace v1 {
	
	export class Platform {
	    architecture: string;
	    os: string;
	    "os.version"?: string;
	    "os.features"?: string[];
	    variant?: string;
	
	    static createFrom(source: any = {}) {
	        return new Platform(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.architecture = source["architecture"];
	        this.os = source["os"];
	        this["os.version"] = source["os.version"];
	        this["os.features"] = source["os.features"];
	        this.variant = source["variant"];
	    }
	}
	export class Descriptor {
	    mediaType: string;
	    digest: string;
	    size: number;
	    urls?: string[];
	    annotations?: Record<string, string>;
	    data?: number[];
	    platform?: Platform;
	    artifactType?: string;
	
	    static createFrom(source: any = {}) {
	        return new Descriptor(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.mediaType = source["mediaType"];
	        this.digest = source["digest"];
	        this.size = source["size"];
	        this.urls = source["urls"];
	        this.annotations = source["annotations"];
	        this.data = source["data"];
	        this.platform = this.convertValues(source["platform"], Platform);
	        this.artifactType = source["artifactType"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace volume {
	
	export class Info {
	
	
	    static createFrom(source: any = {}) {
	        return new Info(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class CapacityRange {
	    RequiredBytes: number;
	    LimitBytes: number;
	
	    static createFrom(source: any = {}) {
	        return new CapacityRange(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.RequiredBytes = source["RequiredBytes"];
	        this.LimitBytes = source["LimitBytes"];
	    }
	}
	export class TopologyRequirement {
	
	
	    static createFrom(source: any = {}) {
	        return new TopologyRequirement(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class TypeBlock {
	
	
	    static createFrom(source: any = {}) {
	        return new TypeBlock(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class TypeMount {
	
	
	    static createFrom(source: any = {}) {
	        return new TypeMount(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class AccessMode {
	    // Go type: TypeMount
	    ""?: any;
	    // Go type: TypeBlock
	    ""?: any;
	
	    static createFrom(source: any = {}) {
	        return new AccessMode(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this[""] = this.convertValues(source[""], null);
	        this[""] = this.convertValues(source[""], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ClusterVolumeSpec {
	    // Go type: AccessMode
	    ""?: any;
	    // Go type: TopologyRequirement
	    ""?: any;
	    // Go type: CapacityRange
	    ""?: any;
	
	    static createFrom(source: any = {}) {
	        return new ClusterVolumeSpec(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this[""] = this.convertValues(source[""], null);
	        this[""] = this.convertValues(source[""], null);
	        this[""] = this.convertValues(source[""], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ClusterVolume {
	    ID: string;
	    // Go type: ClusterVolumeSpec
	    Spec: any;
	    // Go type: Info
	    ""?: any;
	
	    static createFrom(source: any = {}) {
	        return new ClusterVolume(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Spec = this.convertValues(source["Spec"], null);
	        this[""] = this.convertValues(source[""], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class UsageData {
	    RefCount: number;
	    Size: number;
	
	    static createFrom(source: any = {}) {
	        return new UsageData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.RefCount = source["RefCount"];
	        this.Size = source["Size"];
	    }
	}
	export class Volume {
	    ClusterVolume?: ClusterVolume;
	    CreatedAt?: string;
	    Driver: string;
	    Labels: Record<string, string>;
	    Mountpoint: string;
	    Name: string;
	    Options: Record<string, string>;
	    Scope: string;
	    Status?: Record<string, any>;
	    UsageData?: UsageData;
	
	    static createFrom(source: any = {}) {
	        return new Volume(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ClusterVolume = this.convertValues(source["ClusterVolume"], ClusterVolume);
	        this.CreatedAt = source["CreatedAt"];
	        this.Driver = source["Driver"];
	        this.Labels = source["Labels"];
	        this.Mountpoint = source["Mountpoint"];
	        this.Name = source["Name"];
	        this.Options = source["Options"];
	        this.Scope = source["Scope"];
	        this.Status = source["Status"];
	        this.UsageData = this.convertValues(source["UsageData"], UsageData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

