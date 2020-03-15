import React, { useState } from 'react'
import blogService from '../services/blogs'
import { useDispatch } from "react-redux";
import { CreateBlog } from "../reducers/blogReducer";

const NewBlogForm = ({ notify, setBlogs, blogs }) => {

  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [visible, setVisibility] = useState(false)
  const dispatch = useDispatch()

  const toggleVisibility = () => {
    setVisibility(!visible)
  }

  const handleCreateBlog = async () => {
    dispatch(CreateBlog({ title: newBlogTitle, author: newBlogAuthor, url: newBlogUrl }))
    setNewBlogUrl('')
    setNewBlogAuthor('')
    setNewBlogTitle('')
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