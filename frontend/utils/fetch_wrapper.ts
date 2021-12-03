export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
};

function get(url, headers?) {
    const requestOptions = {
        method: 'GET',
        headers : { ...headers }
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body, headers?) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body, headers?) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url, headers?) {
    const requestOptions = {
        method: 'DELETE',
        headers: {...headers}
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}