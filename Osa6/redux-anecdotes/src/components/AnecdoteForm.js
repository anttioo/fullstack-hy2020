import React from 'react'
import {newAnecdote} from "../reducers/anecdoteReducer";
import { connect } from 'react-redux'

const AnecdoteForm = ({addNew}) => {
    return (
        <>
            <h2>create new</h2>
            <form onSubmit={addNew}>
                <div><input name="anecdote"/></div>
                <button>create</button>
            </form>
        </>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = dispatch => {
    return {
        addNew: (e) => {
            e.preventDefault()
            const content = e.target.anecdote.value
            dispatch(newAnecdote(content))
        },
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnecdoteForm)
