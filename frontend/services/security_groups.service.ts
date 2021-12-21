import { CreateSecurityGroupRequest, EditSecurityGroupRequest } from "../interfaces/SecurityGroup";
import { fetchWrapper } from "../utils/fetch_wrapper"

export  const securityGroupService = {
    readSecurityGroups,
    readSecurityGroupById,
    createDefaultSecurityGroup,
    createSecurityGroup,
    readSecurityGroupInstances,
    editSecurityGroupById,
    deleteSecurityGroupById,

} 

const baseUrl = 'localhost:8080';

function readSecurityGroups(name: string, id: string ) {
    return fetchWrapper.get(`${baseUrl}/securityGroups`);
}

function createSecurityGroup( data: CreateSecurityGroupRequest ) {
    return fetchWrapper.post(`${baseUrl}/securityGroups`, data);
}

function createDefaultSecurityGroup() {
    return fetchWrapper.post(`${baseUrl}/securityGroups/default`, {});
}

function readSecurityGroupInstances(securityGroupId: string) {
    return fetchWrapper.get(`${baseUrl}/securityGroups/instances`);
}

function readSecurityGroupById(securityGroupId: string) {
    return fetchWrapper.get(`${baseUrl}/securityGroups/${securityGroupId}`);
}

function editSecurityGroupById(securityGroupId: string, data: EditSecurityGroupRequest) {
    return fetchWrapper.put(`${baseUrl}/securityGroups/${securityGroupId}`, data);
}

function deleteSecurityGroupById(securityGroupId: string) {
    return fetchWrapper.delete(`${baseUrl}/securityGroups/${securityGroupId}`);
}