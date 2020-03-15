import blogService from '../services/blogs'
import {Notify} from "./notificationReducer";

const reducer = (state = [], action) => {
    switch (action.type) {
        case 'REPLACE_BLOGS':
            return action.data
        case 'UPDATE_BLOG':
            return state.map(blog => blog.id !== action.data.id ? blog : action.data)
        case 'DELETE_BLOG':
            return state.filter(blog => blog.id !== action.data)
        case 'NEW_BLOG':
            return [ ...state, action.data ]
        default:
            return state
    }
}

export const InitBlogs = () => {
    return async dispatch => {
        blogService.getAll().then(blogs =>
            dispatch({
                type: 'REPLACE_BLOGS',
                data: blogs,
            })
        )
    }
}

export const LikeBlog = ({id, title, author, url, likes, user}) => {
    return async dispatch => {
        const liked = {
            id: '_' + id,
            title: title,
            author: author,
            url: url,
            likes: likes + 1,
            user: user.id
        }
        const response = await blogService.put(id, liked)
        dispatch({
            type: 'UPDATE_BLOG',
            data: response,
        })

    }
}


export const CreateBlog = ({title, author, url}) => {
    return async dispatch => {
        try {
            const created = await blogService.create({title, author , url })
            dispatch(Notify(`a new blog ${created.title} by ${created.author} added`))
            dispatch({
                type: 'NEW_BLOG',
                data: created,
            })
        } catch (e) {
            dispatch(Notify('error while creating new blog'))
        }
    }
}
export const DeleteBlog = (id) => {
    return async dispatch => {
        const success = blogService.remove(id)
        if (success) {
            dispatch({
                type: 'DELETE_BLOG',
                data: id,
            })
        }


    }
}

export default reducer