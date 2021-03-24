/* 
  1.项目中所有请求由该文件发出
  2.以后每当发请求之前，都要在该文件里添加一个方法
*/

/* 引入自定义myAxios */
import myAxios from './myAxios'
/* 引入jsonp发送一般请求 */
import jsonp from 'jsonp'
import {message} from 'antd'

/* 引入请求的配置路径 */
import {BASE_URL, CITY} from '../config'

/* 发送登录请求 */
export const reqLogin = (username, password) => myAxios.post(`${BASE_URL}/login`, {username, password})

/* 获取商品楼列表请求 */
export const reqCategoryList = () => myAxios.get(`${BASE_URL}/manage/category/list`)

/* 获取天气信息（百度接口）,由于产生跨域问题, 使用代理服务器跨域最好不要多配置跨域地址
采用百度接口也支持的 jsonp 格式,去发送请求 (script标签天然跨域)  借用 jsonp库, yarn add jsonp
jsonp 发送异步请求 返回正常信息,没有返回promise实例对象,
此时外部同步执行的代码拿不到返回的结果, 因此在这我们可以自己手动返回一个 promise实例对象!!! */
/* promise使用场景:
    我要把函数里面回调函数执行后带回来的值交给他外层方法(其需要该返回值);因为代码不能回头 */
export const reqWeather = ()=>{
    return new Promise((resolve, reject)=>{
      // jsonp(`http://wthrcdn.etouch.cn/weather_mini?city=%E8%A5%BF%E5%AE%89=${CITY}&output=json&ak=${WEATHER_AK}`,
      jsonp(`http://wthrcdn.etouch.cn/weather_mini?city=${CITY}`,
      (err, data)=>{
        if(err){
          message.error('请求天气接口失败, 请联系')
          return new Promise(()=>{})              // 中断promise链
        } else {
          const temperature_high = data.data.forecast[0].high;
          const temperature_low = data.data.forecast[0].low;
          const weather = data.data.forecast[0].type;
          let weatherObj = {temperature_high,temperature_low, weather};         // 将所需数据封装成一个对象
          resolve(weatherObj);                    // 返回成功状态的promise, 值为weatherObj对象
          /* 百度天气接口不能用了 */
          // const {dayPictureUrl, temperature, weather} = data.results[0].weather_data[0];
          // let weatherObj = {dayPictureUrl, temperature, weather};         // 将所需数据封装成一个对象
          // resolve(weatherObj);                    // 返回成功状态的promise, 值为weatherObj对象
        }
      })
    })
}