import { useMiddleware } from '../../source/index.js'
import React from 'react'
import ReactDOM from 'react-dom'

const logActionMiddleware = (_, { updateActionLog }) => (next) => (action) => {
  updateActionLog(action)
  return next(action)
}

const Counter = () => {
  const [state, _dispatch] = React.useReducer((state, action) => {
    if (action === 'increment') {
      return state + 1
    } else if (action === 'decrement') {
      return state - 1
    } else {
      return state
    }
  }, 0)

  const [actionLog, setActionLog] = React.useState([])

  const updateActionLog = (action) => setActionLog([...actionLog, action])

  const dispatch = useMiddleware(
    { updateActionLog },
    logActionMiddleware,
    _dispatch,
  )

  return (
    <>
      <h1>Count: {state}</h1>
      <button onClick={() => dispatch('increment')}>+</button>
      <button onClick={() => dispatch('decrement')}>-</button>
      <ol>
        {actionLog.map((action, index) => (
          <li key={index}>{action}</li>
        ))}
      </ol>
    </>
  )
}

ReactDOM.render(<Counter />, document.querySelector('#root'))
