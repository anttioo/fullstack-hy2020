import React from 'react'
import { voteOn } from "../reducers/anecdoteReducer";
import {useDispatch, useSelector} from "react-redux";
import {setNotification} from "../reducers/notificationReducer";

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => {
        if (state.filter.keyword === "") {
            return state.anecdotes
        } else {
            return state.anecdotes.filter( a => a.content.includes(state.filter.keyword))
        }
    })
    const vote = (id) => {
        dispatch(voteOn(anecdotes.filter(a => a.id === id)[0]))
        dispatch(setNotification(`You voted for '${anecdotes.filter(a => a.id === id)[0].content}'`, 5))
    }
    const sortedAnecdotes = [...anecdotes].sort((a,b) => b.votes - a.votes)

    return (
        <>
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default AnecdoteList