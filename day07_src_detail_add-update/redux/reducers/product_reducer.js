import {SAVE_PROD_LIST} from '../action_types'

/* 初始化数据 */
let initState = [];
export default function productSave(preState=initState, action) {
    const {type, data} = action;
    let newState;
    switch (type) {
        case SAVE_PROD_LIST:
            newState = [...data];       // 重新复制一份
            return newState;
        default:
            return preState;
    }
}