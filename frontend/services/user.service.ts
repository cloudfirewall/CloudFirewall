import { BehaviorSubject } from 'rxjs';
import Router from 'next/router'
import API from '../utils/api';

const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    get username() { return userSubject.value.username },
    get token() { return userSubject.value.token },
    login,
    logout
};

async function login(username, password) {

    return API.post('admin/login', { username, password })
        .then(({ data }) => {
            let user = { username, token: data.token };
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}

function logout() {
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/login');
}
