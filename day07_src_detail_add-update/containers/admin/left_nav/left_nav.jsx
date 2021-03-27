import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd'

import './left_nav.less'
import logo from '../../../static/imgs/logo.png'
import menuList from '../../../config/menu_config'
import {createSaveTitleAction} from '../../../redux/action_creators/menu_action'
const {SubMenu, Item} = Menu;
@connect(
    state => ({}),          // 虽然不使用状态, 但必须进行占位
    {
        saveTitle: createSaveTitleAction
    }
)
@withRouter
class LeftNav extends Component{
    
    /* 用于创建菜单的函数 */
    createMenu = (target)=>{            // 接收一个需要遍历的菜单数组, 返回一个加工好的 语句结构
        return target instanceof Array && target.map((item)=>{
            if(!item.children){         // 判断item是否有 children属性
                return (
                    /* 绑定点击事件向redux中存储 title属性, 在header中再读取
                        同时需要传参时, 使用回调函数包起来 */
                    <Item key={item.key} onClick={()=>{this.props.saveTitle(item.title)}}>
                        {/* Link路由组件配合antd组件使用时,要把 标签包裹在里面 */}
                        <Link to={item.path}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Item>
                )
            }else{              // 包含有children属性
                return (
                    <SubMenu 
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.createMenu(item.children)}    {/* 递归调用,传入 有children属性的那一项! */}
                    </SubMenu>
                )
            }
        })
    }

    render(){
        /* 通过withRouter包裹后,可是通过this.props使用路由的那些方法 */
        let {pathname} = this.props.location;

        return (
            <div>
                <header className="nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>商品管理系统</h1>
                </header>
                <Menu
                    // defaultSelectedKeys={pathname.split('/').reverse()[0]}  // 拿到路径最后一位
                    /* 多次render截取多个路径值,以最后一次render时拿到的 为准, 
                    此时只需要在在login组件中路由重定向 return <Redirect to="/admin"/> 即可*/
                    /* 解决父路由是product, 选中子路由显示父路由标题的方法 */
                    selectedKeys={pathname.indexOf('product') !== -1 ? 'product' : pathname.split('/').reverse()[0]}  
                    defaultOpenKeys={pathname.split('/').splice(2)}         // 拿到选中子菜单时当前应该展开状态的父元素组成的数组
                    mode="inline"
                    theme="dark"
                    >
                    {   
                        /* 该方法再在组件中只会在页面渲染时进行调用一次, 若页面数据经常改变则不能
                        使用直接调用这种写法!!! 很危险! 否则一直在调用 */
                        this.createMenu(menuList)
                    }
                </Menu>
            </div>
        )
  }
}

export default LeftNav;