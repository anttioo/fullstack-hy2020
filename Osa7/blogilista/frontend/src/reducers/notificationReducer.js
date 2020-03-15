const notification = "";

const reducer = (state= notification, action) => {
  console.log(action)
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    default: return state
  }
}

export const Notify = content => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: content,
    })
    window.setTimeout(() => {
      dispatch({
        type: 'SET_NOTIFICATION',
        data: "",
      })
    },5000)
  }
}

export default reducer