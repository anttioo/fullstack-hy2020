import React from "react";

const Part = ({name, exercises}) => {
    return <p>{name} {exercises}</p>
}

const Content = ({parts}) => {
    return parts.map( part => {
            return <Part name={part.name} exercises={part.exercises}/>
        })
}

const Course = ({course}) => {

    return (
        <>
            <h4>{course.name}</h4>
            <Content parts={course.parts}/>
            <p><strong>
                Total of { course.parts.reduce((a,c) => (a + c.exercises ),0)} exercises
            </strong></p>
        </>
    )

}

export default Course