import { bridge, staticMiddleware } from 'dispatch-next-action'
import React from 'react'

const noop = (...args) => args

export const useMiddleware = (...args) => {
  const dispatch = React.useMemo(
    () =>
      staticMiddleware(
        ...args.slice(0, -1).concat(bridge(args.slice(-1)[0] || noop)),
      ),
    [args],
  )

  return dispatch
}
