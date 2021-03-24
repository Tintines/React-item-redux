import {SAVE_USER_INFO, DELETE_USER_INFO} from '../action_types'

/* 创建保存用户信息的action */
export const createSaveUserInfoAction = (value)=>{
    // 向localStorage中保存用户的信息是一个对象, 需要先转成json格式再存!!!
    localStorage.setItem('user', JSON.stringify(value.user))
    // 向localStorage中保存token, 本身是字符串, 不需要转格式
    localStorage.setItem('token', value.token)

    return {type: SAVE_USER_INFO, data: value}      // 需要传入保存的数据
}

/* 创建删除用户信息的action */
export const createDeleteUserInfoAction = ()=>{
    // 从localStotage中删除用户信息
    localStorage.removeItem('user');
    // 从localStorage中删除token
    localStorage.removeItem('token');

    return {type: DELETE_USER_INFO}         // 删除操作不需要传递数据
}