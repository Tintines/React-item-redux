import axios from 'axios'
import {message} from 'antd'        // 引入antd内精美的提示框
import NProgress from 'nprogress'   // 引入进度条
import qs from 'querystring'
import 'nprogress/nprogress.css'    // 必须引入进度条样式
/* 一般文件: 可以使用redux的一般方法对redux管理的数据进行相应的操作!!! */
import store from '../redux/store'
import {createDeleteUserInfoAction} from '../redux/action_creators/login_action'

const instance = axios.create({
    timeout: 4000,                  // 配置超时时间
});

/* 请求拦截器 */
instance.interceptors.request.use((config)=>{
    NProgress.start();              // 进度条开始
    /* 从redux中获取之前所保存的token, 通过请求头携带给服务器 */
    const {token} = store.getState().userInfo
    /* 向请求头中添加公共请求参数Authorization: token，用于校验身份,  
    在token前可以携带特定约定编码或加密的手段,用于数据加密 */
    if(token) config.headers.Authorization = 'atguigu_' + token;

    /* 对请求参数类型进行判断 */
    const {method, data} = config;
    /* 若是post请求 */
    /* axios默认是将post请求体参数以json的格式发送, 但是后端若不配合获取该格式数据时就会产生错误,
     此时我们最好将post请求体参数转成urlencoded的格式进行发送!!! */
    if (method.toLowerCase()==='post') {
        if (data instanceof Object) {           // 若传递过来的参数是对象，转换成urlencoded形式
            config.data = qs.stringify(data)
        }
    }
    return config;
})

/* 响应拦截器 */
instance.interceptors.response.use(
    (response)=>{
        NProgress.done();         // 进度条结束

        return response.data;     // 请求成功，修改返回的数据结构,返回真正的数据
    },
    (error)=>{                  // 请求若失败，提示错误（这里可以处理所有请求的异常）
        NProgress.done();         //进度条结束
        /* 此处不能直接通过console.log()查看error身上的所有状态
        可以通过打debugger断点, 在浏览器控制台sources中运行代码到该断点位置,
        鼠标悬浮error变量身上,查看服务器返回的error的详细状态!!!
        */
        // debugger    

        if(error.response.status === 401){
            message.error('身份校验失败,请重新登录', 1);        // antd提供的错误显示信息, 第二个参数 为时间
            /* 校验失败,删除旧的用于校验的token, 分发对应的删除用户信息的action  */
            store.dispatch(createDeleteUserInfoAction())    // 直接调用
        }else{
            /* 请求若失败，提示错误（这里可以处理所有请求的异常） */
            message.error(error.message, 1);  
        }
        return new Promise(()=>{})                          // 中断promise链
    }
)

export default instance;