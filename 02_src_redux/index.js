import React from 'react'
import ReactDOM from 'react-dom'
import store from './redux/store'   // 主入口js中引入,通过标签属性传递给主App组件
import App from './App'
/* 向主组件标签 传递标签属性 */
ReactDOM.render(<App store={store}/>,document.getElementById('root'))

/* 当store中的数据发生改变,强制页面渲染一次 */
store.subscribe(()=>{
  ReactDOM.render(<App store={store}/>,document.getElementById('root'))
})