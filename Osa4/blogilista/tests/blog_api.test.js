const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require("../models/blog")
const User = require("../models/user")

const api = supertest(app)

let token = ""

const initialBlogs = [{
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
}, {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
}, {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
}, {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
}, {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
}, {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
}]

beforeEach(async () => {
    await Blog.deleteMany({})
    initialBlogs.forEach( blog => {
        let blogObject = new Blog(blog)
        blogObject.save()
    })
    await User.deleteMany({})
    await api.post("/api/users").send( { username: "apitesti", password: "salasana", name: "testitunnus"})
    token = await api.post("/api/login").send( { username: "apitesti", password: "salasana"})
    token = "bearer " + token.body.token
})

test('blogs are returned as json and right length', async () => {
    const response = await api.get('/api/blogs')
        .expect('Content-Type', /application\/json/)
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(initialBlogs.length)
})

test('blog entries have correct id field', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('blog post can be added ', async () => {
    const newBlog = {
        title: "Test",
        author: "Test",
        url: "https://helsinki.fi/",
        likes: 1
    }
    await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.length + 1)

})

test('cant post invalid posts', async () => {
    const malformedBlog = {
        author: "Test",
        url: "https://helsinki.fi/",
        likes: 1
    }
    await api.post('/api/blogs')
        .set('Authorization', token)
        .send(malformedBlog)
        .expect(400)

    const malformedBlog2= {
        title: "Test",
        author: "Test",
        likes: 1
    }
    await api.post('/api/blogs')
        .set('Authorization', token)
        .send(malformedBlog2)
        .expect(400)
})

test('cant post without token', async () => {
    const newBlog = {
        title: "React patternsaa",
        author: "Michael Chanaa",
        url: "https://reactpatterns.caaom/",
        likes: 3,
    }
    await api.post('/api/blogs')
        .send(newBlog)
        .expect(401)

})

test('if undefined likes, likes will be 0', async () => {
    const malformedBlog2= {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
    }
    const request = await api.post('/api/blogs')
        .set('Authorization', token)
        .send(malformedBlog2)
    expect(request.body.likes).toBe(0)
})

test('only authenticated can post', async () => {
    const malformedBlog2= {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
    }
    const request = await api.post('/api/blogs')
        .set('Authorization', token)
        .send(malformedBlog2)
    expect(request.body.likes).toBe(0)
})

afterAll(() => {
    mongoose.connection.close()
})