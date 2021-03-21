import {INCREMENT, DECREMENT} from './action_types'

/* 初始化数据 */
let initState = 0;

export default function operaCount(preState=initState, action) {
    /* 从action中取出 type, data */
    const {type, data} = action;
    // 在reducer中不可以修改传递过来的参数, 但可以定义新变量接收修改后的值
    let newState;
    /* 通过switch case 匹配传过来的类型, 进行相应的操作, 什么也不操作时也要返回数据状态 */
    switch (type) {
        case INCREMENT:
            newState = preState + data;
            return newState;
        case DECREMENT:
            newState = preState - data;
            return newState;
        default:
            return preState;
    }
}