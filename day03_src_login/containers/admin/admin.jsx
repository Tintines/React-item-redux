import React,{Component} from 'react'
import {connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import {createDeleteUserInfoAction} from '../../redux/action_creators/login_action'


class Admin extends Component{
    /* 退出登录 */
    logout =  ()=>{
        /* 调用容器组件传来的方法进行删除用户保存在redux中的用户信息 */
        this.props.deleteUserInfo();
    }

    /* 在render里，若想实现跳转，最好用<Redirect> ,且必须return !!! */
    render(){
        const {user, isLogin} = this.props.userInfo;    //从redux中获取user和isLogin
        if(!isLogin){
            return <Redirect to="/login"/>
        } else {
            console.log('已登录');
            console.log(user);
            return (
                <div>
                    <div>我是Admin组件，你的名字是:{user.username}</div>
                    <button onClick={this.logout}>退出登录</button>
                </div>
            )
        }
    }
}


/* 暴露容器组件 */
//从redux中获取状态和操作状态的方法
export default connect(
    state => ({userInfo: state.userInfo}),      // 容器组件直接从store中产生state的弟弟reducer中获取userInfo
                                                // state.userInfo 属性名由reducers中的主文件确定
    {
        deleteUserInfo: createDeleteUserInfoAction,     // 容器组件直接和actioncreator进行联系索要方法
    }
)(Admin)