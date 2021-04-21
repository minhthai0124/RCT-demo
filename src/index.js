import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app/App'
import reportWebVitals from './reportWebVitals'
import { ConnectedRouter } from "connected-react-router"
import { Provider } from 'react-redux'
import configureStore, {history} from './app/store'
import 'bootstrap/dist/css/bootstrap.min.css'
import './app/assets/_sass/main.scss'

export const store = configureStore()

const render = () => {
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App history={history} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
}

render()

// Hot reloading
if (module.hot) {
  // Reload components
  module.hot.accept('./app/App', () => {
    render()
  })
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
