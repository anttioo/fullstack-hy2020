const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require("../models/user")

const api = supertest(app)

describe('when there is initially one user at db', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const user = new User({ username: 'antti', password: 'salasana' })
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await User.find({})
        const newUser = {
            username: 'antti222',
            name: 'Antti Ollikkala',
            password: 'salasana213',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'antti',
            name: '1233',
            password: '2345',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

})

afterAll(() => {
    mongoose.connection.close()
})