import { Policy } from '../types';
import { RuleBase } from './RuleBase';

export interface SecurityGroup {
    name: string,
    description?: string,
    defaultInboundPolicy?: Policy,
    defaultOutboundPolicy?: Policy,
    rules?: Array<RuleBase>
    id?: string,
    creationDate?: Date
}

export interface CreateSecurityGroupRequest {
    name: string,
    description?: string,
    defaultInboundPolicy?: Policy,
    defaultOutboundPolicy?: Policy,
    rules?: Array<RuleBase>
}

export interface EditSecurityGroupRequest {
    name: string,
    description?: string,
    defaultInboundPolicy?: Policy,
    defaultOutboundPolicy?: Policy,
    rules?: Array<RuleBase>
}