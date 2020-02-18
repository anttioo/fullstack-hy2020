const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((a,c) => a + c.likes, 0)
}

const favoriteBlog = (blogs) => {
    let favorite = {}
    let favoriteLikes = -1
    blogs.forEach( blog => {
        if (blog.likes > favoriteLikes) {
            favoriteLikes = blog.likes
            favorite = blog
        }
    })
    return favorite
}

const mostBlogs = (blogs) => {
    const authors = {}
    let author = "";
    let most = -1;

    blogs.forEach(blog => {
        if (!(blog.author in authors)) authors[blog.author] = 0;

        authors[blog.author] += 1

        if (authors[blog.author] > most) {
            author = blog.author;
            most = authors[blog.author];
        }
    })

    return { author: author, blogs: most}
}

const mostLikes = (blogs) => {
    const authors = {}
    let mostLiked = "";
    let mostLikes = -1;

    blogs.forEach(blog => {
        if (!(blog.author in authors)) authors[blog.author] = 0;

        authors[blog.author] += blog.likes

        if (authors[blog.author] > mostLikes) {
            mostLiked = blog.author;
            mostLikes = authors[blog.author];
        }
    })

    return { author: mostLiked, likes: mostLikes }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}