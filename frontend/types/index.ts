export enum Tabs {
    INSTANCES,
    SECURITY_GROUPS,
  }

  export enum Policy {
    ACCEPT = "accept",
    REJECT = "reject",
    DROP = "drop",
  }
  export enum Protocol {
    TCP = "TCP",
    UDP = "UDP",
    ICMP = "ICMP",
    SSH = "SSH",
  }
  export enum TrafficDirection {
    INBOUND = "inbound",
    OUTBOUND = "outbound",
  }
  
  export interface FormData {
    name: string;
    description: string;
    rules?: {
      protocol: Protocol;
      ip: string;
      port: number;
      policy: Policy;
      description?: string;
      trafficDirection: TrafficDirection;
    }[];
  }
  