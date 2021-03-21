import React from 'react'
import ReactDOM from 'react-dom'
import store from './redux/store'
import {Provider} from 'react-redux'
import App from './App'

ReactDOM.render(
  /* Provider相当于顶级组件, 将store 通过标签属性传递给子组件 */
<Provider store={store}>
  <App/>
</Provider>,
document.getElementById('root'))

