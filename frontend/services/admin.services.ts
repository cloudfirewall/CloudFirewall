import { fetchWrapper } from "../utils/fetch_wrapper"

export const adminService = {
    addAdmin,
    adminLogin,
}
const baseUrl = 'localhost:8080';

function addAdmin() {
    return fetchWrapper.post(`${baseUrl}/admin/createAdmin`, {})
}

function adminLogin(username: string, password: string) {
    return fetchWrapper.post(`${baseUrl}/admin/login`, { username, password });
}