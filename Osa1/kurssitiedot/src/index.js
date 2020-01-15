import React from 'react'
import ReactDOM from 'react-dom'

const Header = ({children}) => {
    return <h1>{children}</h1>
}

const Part = ({part, exercices}) => {
    return (<p>
        {part} {exercices}
    </p>)
}

const Content = ({parts}) => {
    return <>
        { parts.map(part => <Part part={part.name} exercices={part.exercises}/> )}
    </>
}

const Total = ({ parts }) => {
    return <p>Number of exercises { parts.reduce((acc, current) => (acc + current.exercises), 0)}</p>
}

const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },
            {
                name: 'State of a component',
                exercises: 14
            }
        ]
    }

    return (
        <div>
            <Header>{course.name}</Header>
            <Content parts={course.parts}/>
            <Total parts={course.parts}/>
        </div>
    )
}

ReactDOM.render(<App/>, document.getElementById('root'))
