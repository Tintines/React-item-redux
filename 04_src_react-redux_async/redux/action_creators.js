import {DECREMENT,INCREMENT} from './action_types'

// 创建一个同步的action，用于增加
export const createIncrementAction = value=> ({type:INCREMENT,data:value})    // 返回一个对象要包裹小括号
// 创建一个同步的action，用于减
export const createDecrementAction = value=> ({type:DECREMENT,data:value})

// 创建一个异步的action，用于增加
export const createIncrementAsyncAction = (value, delay)=> {
  return (dispatch)=>{      // 必须return (dispatch)=>{ } 回调函数
    setTimeout(()=>{        // 模拟异步
      dispatch(createIncrementAction(value))
    },delay)
  }
}