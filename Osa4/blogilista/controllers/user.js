const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('', async (request, response) => {
    const users = await User.find({}).populate("blogs", {title: 1, author: 1, url: 1})
    response.json(users.map( user => user.toJSON()))

})

userRouter.post('', async (request, response) => {

    const users = await User.find({ username: request.body.username })
    if (users.length > 0) {
        response.status(400)
        response.send({ message: "username not unique"})
        return
    }

    const saltRounds = 10
    request.body.password = await bcrypt.hash(request.body.password, saltRounds)

    const user = new User(request.body)

    if (!user.password | user.password.length < 3) {
        response.status(400)
        response.send({ message: "password invalid"})
        return
    }

    if (!user.username| user.username.length < 3) {
        response.status(400)
        response.send({ message: "username invalid"})
        return
    }

    user.save()
        .then(result => {
            response.status(201).json(result)
        })
})


module.exports = userRouter