import { CreateSecurityGroupRequest, EditSecurityGroupRequest } from "../interfaces/SecurityGroup";
import { Policy } from "../types";
import API from "../utils/api";
import { userService } from "./user.service";

export const securityGroupService = {
    readSecurityGroups,
    readSecurityGroupById,
    createDefaultSecurityGroup,
    createSecurityGroup,
    readSecurityGroupInstances,
    editSecurityGroupById,
    deleteSecurityGroupById,

}

function readSecurityGroups(name?: string, id?: string, defaultInboundPolicy?: Policy, defaultOutboundPolicy?: Policy) {

    return API.get(`securityGroups`, {
        params: {
            name,
            id,
            defaultInboundPolicy,
            defaultOutboundPolicy,
        },
        headers: {
            'Authorization': `Bearer ${userService.token}`
        }
    });
}

function createSecurityGroup(data: CreateSecurityGroupRequest) {
    return API.post(`securityGroups`, data, {
        headers: {
            'Authorization': `Bearer ${userService.token}`
        }
    });
}

function createDefaultSecurityGroup() {
    return API.post(`securityGroups/default`, {}, {
        headers: {
            'Authorization': `Bearer ${userService.token}`
        }
    });
}

function readSecurityGroupInstances(securityGroupId: string) {
    return API.get(`securityGroups/instances`, {
        params: {
            securityGroupId
        },
        headers: {
            'Authorization': `Bearer ${userService.token}`
        }
    });
}

function readSecurityGroupById(securityGroupId: string) {
    return API.get(`securityGroups/${securityGroupId}`, {
        headers: {
            'Authorization': `Bearer ${userService.token}`
        }
    });
}

function editSecurityGroupById(securityGroupId: string, data: EditSecurityGroupRequest) {
    return API.put(`securityGroups/${securityGroupId}`, data, {
        headers: {
            'Authorization': `Bearer ${userService.token}`
        }
    });
}

function deleteSecurityGroupById(securityGroupId: string) {
    return API.delete(`securityGroups/${securityGroupId}`, {
        headers: {
            'Authorization': `Bearer ${userService.token}`
        }
    });
}