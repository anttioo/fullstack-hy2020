import anecdoteService from "../services/anecdoteService";

const reducer = (state= [], action) => {
  switch (action.type) {
    case 'INIT_ANECDOTES':
      return action.data
    case 'VOTE_ANECDOTE':
      const id = action.data.id
      return state.map( a => a.id !== id ? a : {...a, votes: a.votes + 1})
    case 'UPDATE_ANECDOTE':
      return state.map( a => a.id !== action.data.id ? a : action.data.content )
    case 'NEW_ANECDOTE':
      const content = action.data
      return [ ...state, content ]
    default: return state
  }
}

export const voteOn = (anecdote) => {
  return async dispatch => {
    const voted = { ...anecdote, votes: anecdote.votes + 1}
    const response = await anecdoteService.update(anecdote.id, voted)
    dispatch({
      type: "UPDATE_ANECDOTE",
      data: {
        id: response.id,
        content: response
      }
    })
  }
}

export const newAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: "INIT_ANECDOTES",
      data: anecdotes
    })
  }
}




export default reducer