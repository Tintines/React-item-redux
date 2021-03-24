import React,{Component} from 'react'
import {Form, Icon, Input, Button, message} from 'antd'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {reqLogin} from '../../api'

import './css/login.less'
import logo from './imgs/logo.png'
import {createSaveUserInfoAction} from '../../redux/action_creators/login_action'

const {Item} = Form;

class Login extends Component{
    /* 密码的验证器---每当在密码输入框输入东西后，都会调用此函数去验证输入是否合法。自定义校验，即：自己写判断 */
    pwdValidator = (rule, value, callback) => {
        if(!value) {
            callback('密码必须输入')
        } else if (value.length>12) {
            callback('密码必须小于12位')
        } else if (value.length<4) {
            callback('密码必须大于4位')
        } else if (!(/^\w+$/).test(value)) {
            callback('密码必须是字母、数字、下划线组成')
        } else {
            callback()      // 不满足时回调函数也必须调用
        }
    }

    /* 点击登录按钮的回调 */
    handleSubmit = (event)=>{
        event.preventDefault();         // 阻止表单默认事件 --禁止form表单提交默认请求---通过ajax发送
        /* 提交时进行表单统一验证 */
        this.props.form.validateFields( async (err, values) => {    // 组件自动把数据收集到 values对象中
            const {username, password} = values;    // 获取用户表单中输入的数据
            if (!err) {
                /* 用户输入无错误, 发送登录请求 */
                let result = await reqLogin(username, password)

                /* 从响应中获取: 请求状态, 错误信息, 数据 */
                const {status, msg, data} = result;
                if (status === 0){          // 登录成功
                    /* 1.服务器返回的user信息，还有token交由redux管理!!! */
                    /* 需要先维护数据到redux状态中,不然后续页面拿不到它所保存的数据, 顺序不能错 */
                    this.props.saveUserInfo(data);
                    /* 2.跳转admin页面 */
                    this.props.history.replace('/admin')
                } else {                    // 登录失败
                    message.warning(msg, 1)
                }
            } else {
                message.error('输入有误，请检查！')
            }
        })
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        /* 从redux中获取用户的登录状态 */
        const {isLogin} = this.props;
        if(isLogin){    //如果已经登录了，重定向到admin页面
        return <Redirect to="/admin"/>
        }
        return (
            <div className="login">
                <header>
                    {/* alt 属性要写上 */}
                    <img src={logo} alt="logo"/>
                    {/* <h1>商品管理系统</h1> */}
                    <span>商品管理系统</span>
                </header>
                <section>
                    <h1>用户登录</h1>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {getFieldDecorator('username', {
                                /*
                                用户名/密码的的合法性要求
                                1). 必须输入
                                2). 必须大于等于4位
                                3). 必须小于等于12位
                                4). 必须是字母、数字、下划线组成
                                */
                                // 定义用户名校验规则---“声明式验证”，即：自己不去做实际判断，只是声明
                                rules: [
                                {required: true, message: '用户名必须输入！'},
                                {max: 12,        message: '用户名必须小于等于12位'},
                                {min: 4,         message: '用户名必须大于等于4位'},
                                {pattern: /^\w+$/, message: '用户名必须是字母、数字、下划线组成'},
                                ],
                            })(
                                <Input 
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="用户名"
                                />,
                            )}
                        </Item>
                        <Item>
                            {getFieldDecorator('password', {
                                rules: [
                                /* 自定义验证器 */
                                {validator: this.pwdValidator},
                                ],
                            })(
                                <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                                />
                            )}
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
  }
}



/* 容器组件 */
/* 从redux中获取state和操作state的方法 */
export default connect(
    state => ({isLogin: state.userInfo.isLogin}),   // UI组件需要容器组件把需要的数据传递给他
    {
        saveUserInfo: createSaveUserInfoAction,     // UI组件需要容器组件把这个保存数据的方法传递给他
    }
)(Form.create()(Login))         // 经过antd包裹的UI组件