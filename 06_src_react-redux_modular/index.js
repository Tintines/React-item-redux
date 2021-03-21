import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import store from './redux/store'
import App from './App'

ReactDOM.render(
/* Provider相当于顶级组件, 将store 通过标签属性传递给子组件 */
<Provider store={store}>
  <App/>
</Provider>,
document.getElementById('root'))

