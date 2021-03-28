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
    state => ({
        menus: state.userInfo.user.role.menus,
        username: state.userInfo.user.username,
    }),          
    {
        saveTitle: createSaveTitleAction
    }
)
@withRouter
class LeftNav extends Component{
    /* 定义用于校验登录角色所拥有的菜单权限的方法 */
    hasAuth = (item)=>{
        /* 获取当前用户可以看到的菜单数组: 遍历菜单key  判断是否包含于该角色的权限数组 menus内 */
        const {menus, username} = this.props;
        // console.log(this.props.menus);       // [ 'home','category','user','line']
        // console.log(item);                   // {title: "首页", key: "home", icon: "home", path: "/admin/home"}
        if (username==='admin') return true;    // 设置admin为超级管理员, 权限都为true
        else if(!item.children){                // item 没有children属性
            /* find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。 */
            return menus.find((item2) => {return item2===item.key})
        } else if (item.children) {
            /* some()测试数组中是不是至少有一个元素通过了被提供的函数测试 */
            return item.children.some((item3) => {return menus.indexOf(item3.key) !==-1})
        }
    }

    /* 用于创建菜单的函数 */
    createMenu = (target)=>{            // 接收一个需要遍历的菜单数组, 返回一个加工好的 语句结构
        return target instanceof Array && target.map(item =>{
            /* 通过map 校验菜单列表中的每一项数组 */
            /* 检查该角色的权限, 根据角色对应的权限,渲染其可以看到的路由 */
            if (this.hasAuth(item)) {  // 只有通过校验才能进入if语句, 不管hasAuth方法返回值是啥,只要其转化的布尔值为true即可
                if(!item.children){    // 判断item是否有 children属性
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
            }
            return true     // 报错需要箭头函数需要return一个值
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