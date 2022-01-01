export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
};
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, PUT, GET, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}

function get(url, headers?) {
    const requestOptions = {
        method: 'GET',
        headers: { ...corsHeaders, ...headers }
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body, headers?) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...corsHeaders, ...headers },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body, headers?) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',  ...corsHeaders, ...headers },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function _delete(url, headers?) {
    const requestOptions = {
        method: 'DELETE',
        headers: {  ...corsHeaders, ...headers }
    };
    return fetch(url, requestOptions).then(handleResponse);
}


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