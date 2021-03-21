import {createStore} from 'redux'

/* 引入小弟 reducer */
import reducer from './reducer'

export default createStore(reducer)