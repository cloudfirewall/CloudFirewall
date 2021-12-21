import { BehaviorSubject } from 'rxjs';
import Router from 'next/router'
import { fetchWrapper } from '../utils/fetch_wrapper';

const baseUrl = 'localhost:8080';
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    login,
    logout
};

async function login(username, password) {
    
    
    const user = {
        username: 'admin',
        token: 'jwt-token',
    }
    userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    // Router.push('/');
    console.log('here');

    return user;

    // return fetchWrapper.post(`${baseUrl}/admin/login`, { username, password })
    //     .then(user => {
    //         // publish user to subscribers and store in local storage to stay logged in between page refreshes
    //         userSubject.next(user);
    //         localStorage.setItem('user', JSON.stringify(user));

    //         return user;
    //     });
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/login');
}
