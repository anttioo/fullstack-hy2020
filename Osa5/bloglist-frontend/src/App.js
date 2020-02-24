import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlogForm from './components/NewBlogForm'

const App = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (msg) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify('wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
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
    const response = await blogService.put(id, liked)
    setBlogs(
        blogs.map( blog => blog.id !== response.id ? blog : response)
    )
  }

  const sortedBlogs = [...blogs].sort((a,b) => b.likes - a.likes)

  if (user === null) {
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
      <NewBlogForm notify={notify} setBlogs={setBlogs} blogs={blogs}/>
      <div>{user.name} logged in <button onClick={handleLogout}>Logout</button></div>

      <br/>
      <div id="blog-list">
        {sortedBlogs.map(blog =>
          <Blog key={blog.id} setBlogs={setBlogs} blogs={blogs} currentUser={user.username} handleLike={handleLike} { ...blog } />
        )}
      </div>
    </div>
  )
}

export default App
