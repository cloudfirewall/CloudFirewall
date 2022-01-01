import { CreateInstanceRequest, EditInstanceRequest } from "../interfaces/Instance";
import { fetchWrapper } from "../utils/fetch_wrapper";
import API from '../utils/api';
import { userService } from "./user.service";

export const instanceService = {
    readInstances,
    readInstanceById,
    createInstances,
    editInstanceById,
    deleteInstanceById,
}

function getAuthHeader() {
    if (process.browser) {
        return {
            'Authorization': `Bearer ${localStorage.getItem('user') || ''}`
        }

    }
}

// to read instance
function readInstances(name?: string, id?: string, ip?: string, status?: number) {

    return API.get('instances', {
        headers: {
            'Authorization': `Bearer ${userService.token}`
        }
    })
}

// to create instance
function createInstances(token: string, data: CreateInstanceRequest) {
    return API.post('instances', data, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('user') || ''}`
        }
    });
}


// to read instance by id
function readInstanceById(instanceId: string) {
    return API.get(`instances/${instanceId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('user') || ''}`
        }
    });
}

function editInstanceById(instanceId: string, data: EditInstanceRequest) {
    return API.put(`instances/${instanceId}`, data, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('user') || ''}`
        }
    });
}

function deleteInstanceById(instanceId: string) {
    
    return API.delete(`instances/${instanceId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('user') || ''}`
        }
    });
}