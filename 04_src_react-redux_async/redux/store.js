// 从redux中引入createStore，用于创建最核心的store对象; applyMiddleware 应用中间件
import {createStore, applyMiddleware} from 'redux' 
// 引入redux-thunk 用于异步编程
import thunk from 'redux-thunk'

// 引入reducer, 干活的弟弟
import reducer from './reducer'

export default createStore(reducer, applyMiddleware(thunk))


/* 异步操作 主要在 store.js  action_creators.js */