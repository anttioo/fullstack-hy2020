import React, { useState } from 'react'
import blogService from '../services/blogs'


const NewBlogForm = ({ notify, setBlogs, blogs }) => {

  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [visible, setVisibility] = useState(false)

  const toggleVisibility = () => {
    setVisibility(!visible)
  }

  const handleCreateBlog = async () => {
    try {
      const created = await blogService.create({ title: newBlogTitle, author: newBlogAuthor, url: newBlogUrl })
      notify(`a new blog ${created.title} by ${created.author} added`)
      setNewBlogUrl('')
      setNewBlogAuthor('')
      setNewBlogTitle('')
      setBlogs([ ...blogs, created ])
    } catch (e) {
      notify('error while creating new blog')
    }
  }

  return <div>
    { visible ? <>
      <h2>create new</h2>
      <div>Title: <input id="newtitle" value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)}/></div>
      <div>Author: <input id="newauthor" value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)}/></div>
      <div>Url: <input id="newurl" value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)}/></div>
      <button onClick={handleCreateBlog} id="create-button">Create</button>
      <button onClick={toggleVisibility} id="cancel-button">Cancel</button>
    </>: <button id="create-blog-button" onClick={toggleVisibility}>New blog</button>}

  </div>
}

export default NewBlogForm