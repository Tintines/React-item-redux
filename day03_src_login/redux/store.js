/* 最核心的管理者 */
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import reducers from './reducers'

/* 奥利给 */
export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))