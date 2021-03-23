/* 
  1.项目中所有请求由该文件发出
  2.以后每当发请求之前，都要在该文件里添加一个方法
*/

// 引入自定义myAxios
import myAxios from './myAxios'
// 引入请求的配置路径
import {BASE_URL} from '../config'

/* 发送登录请求 */
export const reqLogin = (username, password) => myAxios.post(`${BASE_URL}/login`, {username, password})