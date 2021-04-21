import React from 'react'
import PropTypes from 'prop-types'
import routes from './routes'

const App = (history) => {
  return (
    <>
      { routes }
    </>
  )
}

App.propTypes = {
  history: PropTypes.any,
}

export default App
