const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('', async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {username: 1, name: 1, id: 1})
    response.json(blogs.map(u => u.toJSON()))
})

blogRouter.post('', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({ ...request.body, user: user})
    if (!blog["likes"]) blog["likes"] = 0;
    if (!blog["title"] || !blog["url"] ) {
        response.status(400)
        response.send()
        return
    }
    const post = await blog.save()
    user.blogs = user.blogs.concat(post._id)
    await user.save()
    response.status(201).json(post)

})

blogRouter.delete('/:id', async  (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)
    const user = await User.findById(decodedToken.id)

    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'unauthorized' })
    }

    await Blog.findOneAndDelete({ _id: request.params.id })
    response.status(204).end()
})

blogRouter.put('/:id', async  (request, response) => {
    const res = await Blog.findByIdAndUpdate(request.params.id, request.body)
    const returning = await Blog.findById(res.id).populate("user", {username: 1, name: 1, id: 1})
    response.json(returning.toJSON())
})


module.exports = blogRouter