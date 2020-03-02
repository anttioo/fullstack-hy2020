const initialState = {
  keyword: ""
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return { keyword: action.data.content }
    default: return state
  }
}

export const setFilter = (content) => ({
    type: 'SET_FILTER',
    data: { content }
  })

export default reducer