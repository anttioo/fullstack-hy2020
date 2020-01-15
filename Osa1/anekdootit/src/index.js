import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {

    const [selected, setSelected] = useState(0)
    const [votes, setVotes] = useState(new Array(10).fill(0))
    const [mostvotes, setMostcotes] = useState(0)

    const handleClick =  () => {
        const random = Math.floor(Math.random() * props.anecdotes.length )
        setSelected(random)
    }

    const handleVote =  () => {
        const copy = [...votes]
        copy[selected]++
        if (copy[selected] > mostvotes) {
            setMostcotes(selected)
        }
        setVotes(copy)
    }

    return (
        <div>
            <h2>Anecdote of the day</h2>
            <p>{props.anecdotes[selected]}<br/>
                has {votes[selected]} votes</p>
            <button onClick={handleVote}>vote</button>
            <button onClick={handleClick}>next anecdote</button>
            <h2>Anecdote with most votes</h2>
            <p>{props.anecdotes[mostvotes]}<br/>has {votes[mostvotes]} votes</p>

        </div>
    )
}

const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
    <App anecdotes={anecdotes} />,
    document.getElementById('root')
)