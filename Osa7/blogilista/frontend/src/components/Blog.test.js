import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders correct unopened contet', () => {
    const mockBlog = {
        id: "abcd",
        title: "Lorem",
        author: "John",
        url: "http://www.google.com/",
        likes: 5,
        user: { username: "Doe" },
    }

    const mockHandler = jest.fn()

    const blogs = [mockBlog]
    const component = render(
        <Blog { ...mockBlog } setBlogs={mockHandler} blogs={blogs} currentUser="Doe" />
    )

    expect(component.container).toHaveTextContent(
        mockBlog.title
    )
    expect(component.container).toHaveTextContent(
        mockBlog.author
    )

    expect(component.container).not.toHaveTextContent(
        mockBlog.url
    )

    expect(component.container).not.toHaveTextContent(
        mockBlog.likes
    )
})

test('renders correct opened contet', () => {
    const mockBlog = {
        id: "abcd",
        title: "Lorem",
        author: "John",
        url: "http://www.google.com/",
        likes: 5,
        user: { username: "Doe" },
    }

    const mockHandler = jest.fn()

    const blogs = [mockBlog]
    const component = render(
        <Blog { ...mockBlog } setBlogs={mockHandler} blogs={blogs} currentUser="Doe" />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(
        mockBlog.title
    )
    expect(component.container).toHaveTextContent(
        mockBlog.author
    )

    expect(component.container).toHaveTextContent(
        mockBlog.url
    )

    expect(component.container).toHaveTextContent(
        mockBlog.likes
    )
})

test('callback called right amount of times when liked', async () => {
    const mockBlog = {
        id: "abcd",
        title: "Lorem",
        author: "John",
        url: "http://www.google.com/",
        likes: 5,
        user: { username: "Doe" },
    }

    const mockHandler = jest.fn()

    const blogs = [mockBlog]
    const component = render(
        <Blog { ...mockBlog } setBlogs={mockHandler} blogs={blogs} currentUser="Doe" handleLike={mockHandler} />
    )

    const viewbutton = component.getByText('view')
    fireEvent.click(viewbutton)

    const likebutton = component.getByText('like')
    fireEvent.click(likebutton)
    fireEvent.click(likebutton)

    expect(mockHandler.mock.calls.length).toBe(2)
})

test('correct props for callback when creating a new blog', async () => {
    const mockBlog = {
        id: "abcd",
        title: "Lorem",
        author: "John",
        url: "http://www.google.com/",
        likes: 5,
        user: { username: "Doe" },
    }

    const mockHandler = jest.fn()

    const blogs = [mockBlog]
    const component = render(
        <Blog { ...mockBlog } setBlogs={mockHandler} blogs={blogs} currentUser="Doe" handleLike={mockHandler} />
    )

    const viewbutton = component.getByText('view')
    fireEvent.click(viewbutton)

    const likebutton = component.getByText('like')
    fireEvent.click(likebutton)
    fireEvent.click(likebutton)

    expect(mockHandler.mock.calls.length).toBe(2)
})