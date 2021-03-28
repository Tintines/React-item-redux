import {SAVE_USER_INFO, DELETE_USER_INFO} from '../action_types'

/* 请求进来先从localStorage中读取之前保存的数据!! ,之前没存过,读一次,再重新更新或初始化也不迟啊 */
let user = JSON.parse(localStorage.getItem('user'));
let token = localStorage.getItem('token');
// let isLogin = user && token ? true : false;

/* 初始化userIfo数据 */
let initState = {           //若有值，取出使用，没有值，为空
    user: user || '',       // 一定要小心,usr单词写错了,在处理数据由于错误导致渲染两次
    token: token || '',
    isLogin: user && token ? true : false
}

export default function userInfo(preState=initState, action) {
    const {type, data} = action;
    let newState;
    switch (type) {
        case SAVE_USER_INFO:                            // 更新保存user和token到state中
            const {user, token} = data;
            newState = {user, token, isLogin: true};
            return newState;
        case DELETE_USER_INFO:                          // 删除state状态中的user和token
            newState = {user: '', token: '', isLogin: false};
            return newState;
        default:
            return preState;
    }
}