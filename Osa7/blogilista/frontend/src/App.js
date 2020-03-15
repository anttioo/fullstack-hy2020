import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import NewBlogForm from './components/NewBlogForm'
import {useDispatch, useSelector} from "react-redux";
import { Notify } from "./reducers/notificationReducer";
import {InitBlogs, LikeBlog} from "./reducers/blogReducer";
import {Login, Logout, SetUser} from "./reducers/userReducer";

const App = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogs = useSelector( state => state.blogs )
  const dispatch = useDispatch()

  const user = useSelector( state => state.user )
  console.log(user)
  useEffect(() => {
    dispatch(InitBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if (loggedUserJSON) {
      console.log(loggedUserJSON)
      const user = JSON.parse(loggedUserJSON)
      dispatch(SetUser({...user, isLoggedIn: true }))
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (msg) => {
    dispatch(Notify(msg))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(Login({ username, password }))
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    window.localStorage.clear()
    dispatch(Logout())
  }

  const handleLike = async ({id, title, author, url, likes, user}) => {
    const liked = {
      id: '_' + id,
      title: title,
      author: author,
      url: url,
      likes: likes + 1,
      user: user.id
    }
    dispatch(LikeBlog(liked))
  }

  const notification = useSelector( state => state.notification )

  const sortedBlogs = [...blogs].sort((a,b) => b.likes - a.likes)

  if (!user.isLoggedIn) {
    return (
      <div>
        <h2>Log in to application</h2>
        { notification ? <div>{notification}</div> : null}
        <form onSubmit={handleLogin}>
          <div>
              username
            <input
                id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
              password
            <input
                id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      { notification ? <div>{notification}</div> : null}
      <NewBlogForm notify={notify} blogs={blogs}/>
      <div>{user.name} logged in <button onClick={handleLogout}>Logout</button></div>

      <br/>
      <div id="blog-list">
        {sortedBlogs.map(blog =>
          <Blog key={blog.id} currentUser={user.username} handleLike={handleLike} { ...blog } />
        )}
      </div>
    </div>
  )
}

export default App
