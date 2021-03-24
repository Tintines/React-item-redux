/* 该文件为项目的配置文件，保存着通用性的配置，以及变量。 */

/* 发送请求基本路径，当前在开发环境，给自己的代理服务器发请求，可不进行配置
若项目上线，需要配置成真正服务器的地址!!!!! */
// export const BASE_URL = 'http://localhost:3000'      // 上线时修改成这样
export const BASE_URL = ''      // 开发配置

/* 百度天气接口的key, 需要花钱买接口密匙ak, 可能随时更改,所以配置到配置文件中!! */
// export const WEATHER_AK = '3p49MVra6urFRGOT9s8UBWr2'

/* 找的免费天气接口 */
// http://wthrcdn.etouch.cn/weather_mini?city=西安

/* 当前城市名 */ /* 问题: 如何自动获取当前所在城市? */
export const CITY = '西安'

/* 表个table每页展示条数 */
export const PAGE_SIZE = 5