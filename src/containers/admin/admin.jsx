import React,{Component} from 'react'
import {connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import { Layout } from 'antd';

import './css/admin.less'
import Header from './header/header'

const {Footer, Sider, Content } = Layout;

class Admin extends Component{

    /* 在render里，若想实现跳转，最好用<Redirect> ,且必须return !!! */
    render(){
        const {isLogin} = this.props.userInfo;    //从redux中获取user和isLogin
        if(!isLogin){
            return <Redirect to="/login"/>
        } else {
            /* console.log('已登录');
            console.log(user); */
            return (
                /* <button onClick={this.logout}>退出登录</button> */
                <Layout className="admin">
                    <Sider className="sider">Sider</Sider>
                    <Layout>
                        <Header className="header">Header</Header>
                        <Content className="content">Content</Content>
                        <Footer className="footer">
                            推荐使用谷歌浏览器，获取最佳用户体验
                        </Footer>
                    </Layout>
                </Layout>
            )
        }
    }
}


/* 暴露容器组件 */
//从redux中获取状态和操作状态的方法
export default connect(
    state => ({userInfo: state.userInfo}),      // 容器组件直接从store中产生state的弟弟reducer中获取userInfo
                                                // state.userInfo 属性名由reducers中的主文件确定
    {  }
)(Admin)