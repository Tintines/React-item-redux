import counterReducer from './counter_reducer'
import personReducer from './person_reducer'

/* 引入combineReducers用于将多个reducer 合并到一起 */
import {combineReducers} from 'redux'


/* store中保存了所有组件的状态，是一个一般对象，例如下面的格式：
{
  key1:xxxx,
  key2:{yyyy},
  key3:[z,z,z,z]
} 
*/

// combineReducers方法,接收一个对象作为参数
// 对象中的key就是store中保存该状态的key， 用于组件通过 state.xxxx 读取对应的属性值
// 对象中的value就是store中保存该状态的value
export default combineReducers({
  count: counterReducer,          // 该key决定了外部壳组件获取store中state中该key的具体方式,形如: 
                                  // state => ({count: state.count, person: state.person}),
  person: personReducer
})

//store中保存的state，如下：
/* {
  count:0,
  person:[],
} */