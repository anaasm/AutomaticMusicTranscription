import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
    login,
    logout,
    register,
    // getAll,
    submit,
    handleDownload
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(username,email,password1,password2) {
    return dispatch => {
        dispatch(request(username));

        userService.register(username,email,password1,password2)
            .then(
                user => { 
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

// submit wav
function submit(scoreName, uploadedFile) {
    return dispatch => {
        dispatch(request(uploadedFile));


        userService.submit(scoreName,uploadedFile)
            .then(
                pdf => {
                    dispatch(success(pdf))
                },
                error => {
                    dispatch(failure(error.toString())),
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(pdf) { return { type: userConstants.SUBMIT_REQUEST,pdf} }
    function success(pdf) { return { type: userConstants.SUBMIT_SUCCESS,pdf} }
    function failure( error) { return { type: userConstants.SUBMIT_FAILURE, error } }
}

function handleDownload(pdf,name){
    return dispatch => {

        userService.handleDownload(pdf,name)
        .then(
           url =>{dispatch(success(url))}
        ),
        error => {
            dispatch(failure(error.toString())),
            dispatch(alertActions.error(error.toString()));
        }
    }

    function request(pdf) { return { type: userConstants.DOWNLOAD_REQUEST,pdf} }
    function success(name) { return { type: userConstants.DOWNLOAD_SUCCESS,name} }
    function failure( error) { return { type: userConstants.DOWNLOAD_FAILURE, error } }
}