import {TEST1, TEST2} from '../action_types'

/* 初始化数据 */
let initState = 'ziyan'
export default function test(preState=initState, action) {
    const {type, data} = action;
    let newState;
    switch (type) {
        case TEST1:
            newState = preState + data;
            return newState
        case TEST2:
            newState = preState + data + '!';
            return newState
        default:
            return preState
    }
}