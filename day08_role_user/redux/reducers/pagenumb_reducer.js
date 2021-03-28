import {SAVE_PAGE_NUMB} from '../action_types'

/* 初始化title */
let initState = 1;

export default function test(preState=initState,action) {
    const {type,data} = action
    let newState
    switch (type) {
      case SAVE_PAGE_NUMB: 
        newState = data
        return newState
      default:
        return preState
    }
  }