import React from 'react'

/**
 * HOC: import dynamic a Component.
 *
 * Code Splitting helpers.
 *
 * @param getComponent
 * @returns {{new(*=): LoadableComponent}}
 */
const asyncImport = (getComponent) => {
  return class LoadableComponent extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        Component: null
      }
    }

    componentDidMount() {
      getComponent().then((module) => {
        this.setState({Component: module.default})
      })
    }

    render() {
      const {Component} = this.state

      if (Component) {
        return <Component {...this.props} />
      }

      return null
    }
  }
}

export default asyncImport
