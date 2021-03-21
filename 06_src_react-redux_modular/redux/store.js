/* 从redux中引入createStore，用于创建最核心的store对象 */
import {createStore, applyMiddleware} from 'redux' 

/* 引入reducer */
// import reducers from './reducers/index'  // 完整写法, 文件夹中有主文件index.js时 可以省略不写
import reducers from './reducers'           // 简写方式
         
/* 引入redux-thunk, 用于支持异步编程 */
import thunk from 'redux-thunk'

/* 引入redux-devtools-extension，用于支持redux开发者调试工具的运行 */
import { composeWithDevTools } from 'redux-devtools-extension'

/* 将store 暴露出去 */
export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))