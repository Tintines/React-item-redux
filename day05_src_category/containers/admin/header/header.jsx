import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Icon,Button,Modal} from 'antd'
import screenfull from 'screenfull'
/* 在非路由组件中，要使用路由组件的api */
import {withRouter} from 'react-router-dom' 
import {createDeleteUserInfoAction} from '../../../redux/action_creators/login_action'

import './header.less'
import dayjs from 'dayjs'
import { reqWeather } from '../../../api'
import menuList from '../../../config/menu_config'

const {confirm} = Modal;    // 结构赋值,得到modal中confirm方法

@connect(
    state => ({
        userInfo: state.userInfo,
        title: state.title          // 从state对象上获取对应的属性
    }),
    {deleteUser: createDeleteUserInfoAction}
)
@withRouter   // 将Header使用withRouter进行包装一次, 就可以通过this.props读取到路由身上的那些属性和方法了
class Header extends Component{
    /* 不需要和redux交互时, 就尽量将状态数据维护在当前组件中! */
    state = {
        isFull: false,
        date: dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
        weatherInfo: {},
    }

    componentDidMount(){        // 组件挂载时只执行一次
        /* 给screenfull绑定监听, 用于监听当前是否为全屏状态, 进而来标识 当前全屏功能该展示哪个图标!! */
        screenfull.on('change', ()=>{
            let isFull = !this.state.isFull;
            this.setState({isFull})             // 更新状态
        })

        /* 通过循环定时器动态更新时间 */
        this.timeID = setInterval(()=>{
            this.setState({date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss')})    // 更新状态
        }, 1000)

        /* 调用天气请求方法 */
        this.getWeather()

        /* 获取当前菜单名称 */
        this.getTitle()
    }

    componentWillUnmount(){
        clearInterval(this.timeID)      // 清除定时器!!!!!!!不然切换路由时报错
    }

    /* 退出登录的回调 */
    logOut = ()=>{
        let {deleteUser} = this.props;
        confirm({
            title: '确定退出?',
            content: '若退出需要重新登录',
            cancelText: '取消',
            okText: '确认',
            onOk(){
                /* 该写法会因不是箭头函数,导致this指向有问题,使得读取不到props属性
                方法一: 可以改成[对象内的箭头函数]的形式 onOk: ()=>{}
                */
                // this.props.deleteUser()   
                /* 方法二: 直接在该函数外部就拿到 deleteUser函数,再在该函数内部进行调用*/ 
                deleteUser();
            }
        }) 
    }

    /* 切换全屏按钮方法 */
    fullScreen =()=>{
        screenfull.toggle();        // 子页切换全屏
    }

    /* 发送天气数据请求 */
    getWeather = async ()=>{
        let weather = await reqWeather()
        this.setState({weatherInfo: weather})   // 更新状态中的数据
    }

    /* 获取地址对应标题 */
    getTitle = ()=>{
        // console.log('getTitle()');   // 测试是否被重复调用 
        let pathKey = this.props.location.pathname.split('/').reverse()[0];
        let title = '';
        menuList.forEach((item)=>{
            if(item.children instanceof Array) {        // 子元素有children属性时
                let tmp = item.children.find((citem)=>{
                    return citem.key === pathKey;
                })
                if(tmp) title = tmp.title;
            }else{                                      // 从自身找key对应的属性值
                if(pathKey===item.key) title=item.title;
            }
        })
        /* 将title放到state中, 使用时通过state读取即可 */
        /* 不要直接返回title, 然后再render中进行直接调用thisgetTitle() [不加点击事件]!!
        不然,render每调用一次, 该函数就会被调用一次!!! render的次数(1+n次)是由数据变化的次数决定的!!
        此页面我们加了循环定时器来得到时间,所以即使不刷新,页面也会每秒2render一次 */
        this.setState({title})
    }

    render(){
        let {user} = this.props.userInfo;
        let {isFull, date} = this.state;
        let {temperature_high,temperature_low, weather} = this.state.weatherInfo;
        /* 在非路由组件中获取参数 */
        // let {pathname} = this.props.location;
        return (
            <header className="header">
                <div className="header-top">
                    <Button size="small" onClick={this.fullScreen}>
                        {/* 更具是否全屏状态 自动切换 图标 */}
                        <Icon type={isFull ? 'fullscreen-exit' : 'fullscreen'}/>
                    </Button>
                    <span className="username">欢迎,{user.username}</span>
                    {/* 想要a标签实现的就尽量使用button 的link类型来实现 */}
                    <Button type="link" onClick={this.logOut}>退出登录</Button>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {/* 没刷新时, 点击[左侧导航组件]时,边点击边往redux中存储, 然后[header组件]动态从redux中读取; 
                        刷新时,[header组件]通过初始化加载调用getTitle方法,重新计算获取当前title并存储到state属性中;
                        通常会优先从redux中获取,只有刷新时(点击[左侧导航组件]事件不触发redux中读取不到title属性)
                        此时通过生命周期函数只调用一次存储的state中的title值,去获取state中的title值; */}
                        {this.props.title || this.state.title}
                    </div>
                    <div className="header-bottom-right">
                        {date}
                        {/* <img src="" alt="天"/> */}  {/* 百度接口暂不可用暂不做图片 */}
                        &nbsp;&nbsp;{weather} &nbsp;{temperature_low}&nbsp;&nbsp;{temperature_high}
                    </div>
                </div>
            </header>
        )
    }
}

export default Header