import { SecurityGroup } from './SecurityGroup';

export interface Instance {
    name: string,
    description?: string,
    id?: string,
    securityGroup?: SecurityGroup,
    ip: string,
    status?: number,
    creationDate?: Date,
}
export interface InastancesSecurityGroup {
    name: string,
    description: string,
    ip: string,
    id: string,
}
export interface CreateInstanceRequest {
    name: string,
    description: string,
    status: number,
    ip: string,
}

export interface EditInstanceRequest {
    name: string,
    description: string,
    securityGroupId: string
}
