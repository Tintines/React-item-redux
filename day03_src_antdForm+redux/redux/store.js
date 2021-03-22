/* 最核心的管理者,用于创建storeduixiang */
import {createStore, applyMiddleware} from 'redux'
/* 用于异步 */
import thunk from 'redux-thunk'
/* 引入redux-devtools-extension，用于支持redux开发者调试工具的运行 */
import {composeWithDevTools} from 'redux-devtools-extension'

import reducers from './reducers'


export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))