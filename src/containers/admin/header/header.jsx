import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Icon,Button,Modal} from 'antd'
import screenfull from 'screenfull'

import {createDeleteUserInfoAction} from '../../../redux/action_creators/login_action'

import './header.less'
import dayjs from 'dayjs'
import { reqWeather } from '../../../api'

const {confirm} = Modal;

@connect(
    state => ({userInfo: state.userInfo}),
    {deleteUser: createDeleteUserInfoAction}
)
class Header extends Component{
    /* 不需要和redux交互时, 就尽量将状态数据维护在当前组件中! */
    state = {
        isFull: false,
        date: dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
        weatherInfo: {},
    }

    componentDidMount(){
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


    render(){
        let {user} = this.props.userInfo;
        let {isFull, date} = this.state;
        let {temperature_high,temperature_low, weather} = this.state.weatherInfo;
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
                        admin
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