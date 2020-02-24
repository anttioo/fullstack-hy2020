import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ id, title, author, url, likes, user, setBlogs, blogs, currentUser, handleLike }) => {

  const style = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [expanded, setExpanded] = useState(false)

  const handleDelete = async () => {
    const confirmMsg = `Remove blog ${title} by ${author}`
    const confirmed = window.confirm(confirmMsg)
    if (confirmed) {
      const success = blogService.remove(id)
      if (success) {
        setBlogs(blogs.filter(blog => blog.id !== id))
      }
    }
  }

  const likeThis = async () => {
    handleLike({ id, title, author, url, likes, user })
  }

  return <div style={style} className="blog-post">
    <div>{title} {author} <button className="view-hide-button" onClick={ () => setExpanded(!expanded)}>{ expanded ? 'hide' : 'view' }</button>
      { expanded ? <>
        <div>{url}</div>
        <div className="likes"><span className="likes-num">{likes}</span> <button className="like-button" onClick={likeThis}>like</button></div>
        <div>{ user.name }</div>
        { currentUser === user.username ? <button onClick={handleDelete}>Remove</button> : null}
      </> : null }
    </div>
  </div>
}

Blog.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  currentUser: PropTypes.string.isRequired,
}

export default Blog