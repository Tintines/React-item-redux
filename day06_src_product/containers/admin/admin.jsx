import React,{Component} from 'react'
import {connect } from 'react-redux'
import {Redirect, Route, Switch} from 'react-router-dom'
import { Layout } from 'antd';

import './css/admin.less'
import Header from './header/header'
import Home from '../../components/home/home'
import Category from '../category/category'
import Product from '../product/product'
import Detail from '../product/datail'
import AddUpdate from '../product/add_update'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../bar/bar'
import Line from '../line/line'
import Pie from '../pie/pie'
import LeftNav from './left_nav/left_nav'

// 这里删除了antd中提供好的Header基础组件, 此处自定义的就可以了
const {Footer, Sider, Content } = Layout;

class Admin extends Component{

    /* 在render里，若想实现跳转，最好用<Redirect> ,且必须return !!! */
    render(){
        const {isLogin} = this.props.userInfo;    //从redux中获取user和isLogin
        if(!isLogin){
            return <Redirect to="/login"/>
        } else {
            return (
                <Layout className="admin">
                    <Sider className="sider">
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header className="header">Header</Header>
                        <Content className="content">
                            <Switch>
                                <Route path="/admin/home" component={Home}/>
                                <Route path="/admin/prod_about/category" component={Category}/>
                                {/* 此处要添加 exact 精确匹配,不然模糊匹配时就永远给展示下面在这个路由了 */}
                                <Route path="/admin/prod_about/product" component={Product} exact/>
                                <Route path="/admin/prod_about/product/detail/:id" component={Detail} />
                                <Route path="/admin/prod_about/product/add_update" component={AddUpdate} exact/>
                                <Route path="/admin/prod_about/product/add_update/:id" component={AddUpdate} />
                                <Route path="/admin/user" component={User}/>
                                <Route path="/admin/role" component={Role}/>
                                <Route path="/admin/charts/bar" component={Bar}/>
                                <Route path="/admin/charts/line" component={Line}/>
                                <Route path="/admin/charts/pie" component={Pie}/>
                                {/* 重定向 */}
                                <Redirect to="/admin/home"/>
                            </Switch>
                        </Content>
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