import {combineReducers} from 'redux'
import loginReducer from './login_reducer'
import menuReducer from './menu_reducer'

/* 整合所有的reducer汇总所有状态 */
export default combineReducers({
    /* 该对象里的key和value决定着store里保存该状态的key和value */
    userInfo: loginReducer,
    title: menuReducer
})