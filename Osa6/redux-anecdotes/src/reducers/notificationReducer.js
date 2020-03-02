const initialState = {
  content: false,
}

let timeoutId = 0;

const reducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return { content: action.data.content }
    case 'HIDE_NOTIFICATION':
      return { content: false }
    default: return state
  }
}

export const setNotification = (content, duration) => {
  return dispatch => {
    dispatch(showNotification(content))
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      dispatch(hideNotification())
      timeoutId = 0
    }, duration * 1000 )
  }
}

export const showNotification = (content) => ({
    type: 'SHOW_NOTIFICATION',
    data: { content }
  })

export const hideNotification = () => ({
  type: 'HIDE_NOTIFICATION',
})


export default reducer