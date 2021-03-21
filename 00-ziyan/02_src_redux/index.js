import React from 'react' 
import ReactDOM from 'react-dom'
import App from './App'
import store from './redux/store'

ReactDOM.render(<App store={store}/>, document.getElementById('root'))

/* store中数据改变就强制渲染一次 */
store.subscribe(()=>{
    ReactDOM.render(<App store={store}/>, document.getElementById('root'))
})