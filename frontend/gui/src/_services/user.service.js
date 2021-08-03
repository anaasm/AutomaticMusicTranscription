import config from 'config';
import axios from 'axios';
import fileDownload from 'js-file-download'


export const userService = {
    login,
    logout,
    register,
    submit,
    //handleDownload,
};


function login(username, password) {

    return axios.post('http://127.0.0.1:8000/rest-auth/login/', {
            username: username,
            password: password
        })
        .then(res => {
            const token = res.data.key;
            localStorage.setItem('user', token);
        }).then(handleResponse);

}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}


function register(username,email,password1,password2) {
    console.log(username,email,password1,password2);
    return axios.post('http://127.0.0.1:8000/rest-auth/registration/', {
            username: username,
            email: email,
            password1: password1,
            password2: password2
        })
        .then( res =>{
            console.log(res)
        })
        .then(handleResponse);

}

function submit(scoreName,uploadedFile) {
    var formData = new FormData();
    formData.append("fileName",scoreName);
    formData.append("audioFile",uploadedFile);
    return axios.post('http://127.0.0.1:8000/transcript/',formData)
    .then(handlePDF)
}

// function handleDownload(url,filename) {
//     return axios.get(url, {
//         responseType: 'blob',
//       })
//       .then((res) => {
//         console.log(res.data);
//         fileDownload(res.data, filename)
//       })
// };


function handlePDF(response) {
    localStorage.setItem('blobUrl', response.data);
    return response.data;
    
}

function handleResponse(response) {
    console.log(response);
    return response => {
        if (res.statusText === "OK")
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = res.status || response.statusText;
            return Promise.reject(error);
        };
}