import loginService from "../services/login"
import blogService from "../services/blogs";
import { Notify } from "./notificationReducer";

const initialstate = {
    isLoggedIn: false,
    username: "",
    name: "",
    token: ""
}

const reducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return { isLoggedIn: true, username: action.data.username, name: action.data.name, token: action.data.token }
        case 'LOGOUT':
            return { isLoggedIn: false, username: "", name: "", token: "" }
        case 'SET_USER':
            return action.data
        default:
            return state
    }
}

export const Logout = () => ({
    type: 'LOGOUT',
    data: null,
})

export const SetUser = (data) => ({
    type: 'SET_USER',
    data: data,
})

export const Login = ({ username, password }) => {
    return async dispatch => {
        try {
            const user = await loginService.login({
                username, password,
            })
            window.localStorage.setItem(
                'loggedUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            dispatch({
                type: 'LOGIN_SUCCESS',
                data: user,
            })

        } catch (exception) {
            dispatch(Notify('wrong credentials'))
        }
    }
}

export default reducer