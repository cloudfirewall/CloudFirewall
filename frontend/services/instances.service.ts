import { CreateInstanceRequest, EditInstanceRequest } from "../interfaces/Instance";
import { fetchWrapper } from "../utils/fetch_wrapper"

export const instanceService = {
    readInstances,
    readInstanceById,
    createInstances,
    generateToken,
    editInstanceById,
    deleteInstanceById,
}

const baseUrl = 'localhost:8080';

// to read instance
function readInstances(name?: string, id?: string, ip?: string, status?: number) {
    return fetchWrapper.get(`${baseUrl}/instances`);
}

// to create instance
function createInstances(token: string, data: CreateInstanceRequest) {
    return fetchWrapper.post(`${baseUrl}/instances`, data, { token });
}

// to generate the token
function generateToken() {
    return fetchWrapper.get(`${baseUrl}/instances/token`);
}

// to read instance by id
function readInstanceById(instanceId: string) {
    return fetchWrapper.get(`${baseUrl}/${instanceId}`);
}

function editInstanceById(instanceId: string, data: EditInstanceRequest) {
    return fetchWrapper.put(`${baseUrl}/instances/${instanceId}`, data);
}

function deleteInstanceById(instanceId: string) {
    return fetchWrapper.delete(`${baseUrl}/instances/${instanceId}`);
}