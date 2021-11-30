import { Policy, Protocol, TrafficDirection } from '../types';

export interface RuleBase {
    protocol: Protocol,
    policy?: Policy,
    port: number,
    ip: string,
    description?: string,
    trafficDirection: TrafficDirection,
}