import { useReducer } from 'react'

// Definimos el reducer
function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      }
    default:
      return state
  }
}

// Definimos el hook personalizado
function useFractionFactoryForm(initialState: any) {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const handleChange = (event: any) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field: event.target.name,
      value: event.target.value,
    })
  }

  return [state, handleChange]
}

export default useFractionFactoryForm
