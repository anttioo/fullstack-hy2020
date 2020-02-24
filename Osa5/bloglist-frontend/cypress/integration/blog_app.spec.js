Cypress.Commands.add('createBlog', ( blog ) => {
    cy.request({
        url: 'http://localhost:3001/api/blogs/',
        method: 'POST',
        body: blog,
        headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`
        }
    })
    cy.visit('http://localhost:3000')
})

describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        beforeEach(function () {
            cy.request('POST', 'http://localhost:3001/api/testing/reset')
            cy.visit('http://localhost:3000')
        })
    })

    it('Login from is shown', function () {
        cy.visit('http://localhost:3000')
        cy.contains('Log in to application')
        cy.get('input#username')
        cy.get('input#password')
    })

    describe('Login',function() {
        beforeEach(function () {
            cy.request('POST', 'http://localhost:3001/api/testing/reset')
            const user = {
                name: 'aaaaa',
                username: 'bbbbb',
                password: 'ccccc'
            }
            cy.request('POST', 'http://localhost:3001/api/users/', user)
            cy.visit('http://localhost:3000')
        })

        it('succeeds with correct credentials', function () {
            cy.contains('login')
            cy.get('#username').type('bbbbb')
            cy.get('#password').type('ccccc')
            cy.get('#login-button').click()
            cy.contains('aaaaa logged in')
        })

        it('fails with wrong credentials', function () {
            cy.contains('login')
            cy.get('#username').type('aaaaa')
            cy.get('#password').type('ccccc')
            cy.get('#login-button').click()
            cy.contains('wrong credentials')
        })

    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.request('POST', 'http://localhost:3001/api/testing/reset')
            const user = {
                name: 'aaaaa',
                username: 'bbbbb',
                password: 'ccccc'
            }
            cy.request('POST', 'http://localhost:3001/api/users/', user)
            cy.request('POST', 'http://localhost:3001/api/login', {
                username: 'bbbbb', password: 'ccccc'
            }).then(response => {
                localStorage.setItem('loggedUser', JSON.stringify(response.body))
                cy.visit('http://localhost:3000')
            })
        })

        it('A blog can be created', function() {
            cy.get('#create-blog-button').click()
            cy.get('#newtitle').type('abc')
            cy.get('#newauthor').type('def')
            cy.get('#newurl').type('ghi')
            cy.get('#create-button').click()
            cy.get('#cancel-button').click()
            cy.contains('abc')
            cy.contains('def')
        })

        it('A blog can be liked', function() {
            cy.get('#create-blog-button').click()
            cy.get('#newtitle').type('abc')
            cy.get('#newauthor').type('def')
            cy.get('#newurl').type('ghi')
            cy.get('#create-button').click()
            cy.get('#cancel-button').click()
            cy.contains('abc')
            cy.contains('def')
            cy.contains('view').click()

            cy.get('.like-button').click()
            cy.get('.likes').contains("1")

        })

        it('A blog can be deleted', function() {
            cy.get('#create-blog-button').click()
            cy.get('#newtitle').type('abc')
            cy.get('#newauthor').type('def')
            cy.get('#newurl').type('ghi')
            cy.get('#create-button').click()
            cy.get('#cancel-button').click()
            cy.contains('abc')
            cy.contains('def')
            cy.contains('view').click()

            cy.contains('Remove').click()
            cy.get('#blog-list').should('be.empty')
        })

        describe('There are multiple blogs', function() {
            beforeEach(function() {
                const blogs = [{
                    title: "React patterns",
                    author: "Michael Chan",
                    url: "https://reactpatterns.com/",
                    likes: 7,
                }, {
                    title: "Go To Statement Considered Harmful",
                    author: "Edsger W. Dijkstra",
                    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                    likes: 5,
                }, {
                    title: "Canonical string reduction",
                    author: "Edsger W. Dijkstra",
                    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                    likes: 12,
                }, {
                    title: "First class tests",
                    author: "Robert C. Martin",
                    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                    likes: 10,
                }, {
                    title: "TDD harms architecture",
                    author: "Robert C. Martin",
                    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                    likes: 0,
                }, {
                    title: "Type wars",
                    author: "Robert C. Martin",
                    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                    likes: 2,
                }]

                cy.request('POST', 'http://localhost:3001/api/testing/reset')
                const user = {
                    name: 'aaaaa',
                    username: 'bbbbb',
                    password: 'ccccc'
                }
                cy.request('POST', 'http://localhost:3001/api/users/', user)
                cy.request('POST', 'http://localhost:3001/api/login', {
                    username: 'bbbbb', password: 'ccccc'
                }).then(response => {
                    localStorage.setItem('loggedUser', JSON.stringify(response.body))
                    cy.visit('http://localhost:3000')
                })
                cy.createBlog(blogs[0])
                cy.createBlog(blogs[1])
                cy.createBlog(blogs[2])
                cy.createBlog(blogs[3])
                cy.createBlog(blogs[4])
                cy.createBlog(blogs[5])
                cy.visit('http://localhost:3000')
            })

            it('posts are sorted', function() {
                cy.get(".blog-post").as("posts")
                cy.get("@posts").then( result => {
                    result.map( (r,b) => {
                        cy.wrap(b).find(".view-hide-button").click()
                    })
                })
                cy.get("@posts").then( function(r) {
                    for (var i = 1; i < r.length; i++) {
                        let last = Number(r[i-1].getElementsByClassName("likes-num")[0].innerText)
                        let current = Number(r[i].getElementsByClassName("likes-num")[0].innerText)
                        expect(last).to.be.at.least(current)
                    }
                })
            })

        })

    })

})