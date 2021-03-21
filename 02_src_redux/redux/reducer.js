import {INCREMENT,DECREMENT} from './action_types'
/* 初始化状态在reducer里设置 */
let initState = 0   // 设置初始化状态,形参默认值
export default function operaCount(preState=initState,action) {
  console.log('------reducer调用了--------',action)
  //根据action中的type和data，决定应该怎么操作状态
  const {type,data} = action
  //规则：在reducer中不可以修改传递过来的参数, 定义新变量接收修改后的值newState
  let newState
  /* 通过switch case 匹配传过来的类型, 进行相应的操作, 什么也不操作时也要返回数据状态 */
  switch (type) {
    case INCREMENT:
      newState = preState + data
      console.log(newState);
      return newState
    case DECREMENT:
      newState = preState - data
      console.log(newState);
      return newState
    default:
      return preState
  }
}