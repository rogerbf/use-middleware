import { cleanup, render } from '@testing-library/react'
import React from 'react'
import { useMiddleware } from '../source/index.js'

const Middleware = ({ children, args }) => children(useMiddleware(...args))

const setup = (...args) => {
  let dispatch

  render(
    <Middleware args={args}>
      {(value) => {
        dispatch = value
        return null
      }}
    </Middleware>,
  )

  return dispatch
}

afterEach(cleanup)

describe('useMiddleware', () => {
  describe('when called with no arguments', () => {
    it('returns a function', () => {
      const dispatch = setup()

      expect(typeof dispatch).toBe('function')
      expect(() => dispatch()).not.toThrow()
    })
  })

  describe('when called with a function', () => {
    it('calls the wrapped function', () => {
      const fn = jest.fn()
      const dispatch = setup(fn)

      dispatch()

      expect(fn).toHaveBeenCalled()
    })
  })

  describe('when called with 1 middleware and a terminating function', () => {
    it('calls the middleware before the terminating function', () => {
      const _dispatch = jest.fn()

      const middleware = () => (next) => (action) => {
        expect(_dispatch).not.toHaveBeenCalled()
        next(action)
      }

      const dispatch = setup(middleware, _dispatch)

      dispatch()

      expect(_dispatch).toHaveBeenCalled()
    })
  })

  describe('when called with 3 middleware and a terminating function', () => {
    it('calls the middleware in order before the terminating function', () => {
      let numberOfMiddlewareCalled = 0

      const _dispatch = jest.fn(() => {
        expect(numberOfMiddlewareCalled).toBe(3)
      })

      const middleware = [
        () => (next) => (action) => {
          expect(_dispatch).not.toHaveBeenCalled()
          expect(numberOfMiddlewareCalled).toBe(0)
          numberOfMiddlewareCalled++
          return next(action)
        },
        () => (next) => (action) => {
          expect(_dispatch).not.toHaveBeenCalled()
          expect(numberOfMiddlewareCalled).toBe(1)
          numberOfMiddlewareCalled++
          return next(action)
        },
        () => (next) => (action) => {
          expect(_dispatch).not.toHaveBeenCalled()
          expect(numberOfMiddlewareCalled).toBe(2)
          numberOfMiddlewareCalled++
          return next(action)
        },
      ]

      const dispatch = setup(...middleware, _dispatch)

      dispatch()
    })
  })
})
