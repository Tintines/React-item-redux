import axios from 'axios'
import {message} from 'antd'        // 引入antd内精美的提示框
import NProgress from 'nprogress'   // 引入进度条
import qs from 'querystring'
import 'nprogress/nprogress.css'    // 必须引入进度条样式

const instance = axios.create({
    timeout: 4000,                  // 配置超时时间
});

/* 请求拦截器 */
instance.interceptors.request.use((config)=>{
    NProgress.start();              // 进度条开始
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

      return response.data;     // 请求成功，返回真正的数据
    },
    (error)=>{                  // 请求若失败，提示错误（这里可以处理所有请求的异常）
      NProgress.done();         //进度条结束

      message.error(error.message, 1);  // antd提供的错误显示信息, 第二个参数 为时间
      return new Promise(()=>{})
    }
)

export default instance;