import React, {Component} from 'react'
import {Form, Icon, Input, Button, message} from 'antd';
import {connect} from 'react-redux'
import {createDemo1Action, createDemo2Action} from '../../redux/action_creators/test_action'
import './css/login.less'
import logo from './imgs/logo.png'    // jsx中引入图片方法, 必须先使用变量来接着

const {Item} = Form                   // 用于精简,Form表单项,原写法 <Form.Item/> ,现写法 <Item/>
/* login 组件, 再经过antd包裹产生的新UI组件 */
class Login extends Component{
  // 点击登录按钮的回调
  handleSubmit = (event)=>{
    event.preventDefault();           //阻止表单默认事件--禁止form表单提交--需要自己通过ajax发送
    /* 多表单项验证 */
    this.props.form.validateFields((err, values) => {
      if(!err){
        // alert('向服务器发送登录请求',values)    // 模拟发送数据
        this.props.demo2('aibaba')
      }else{
        message.error('表单输入有误，请检查！')    // antd内部提示信息组件
      }
    });
  }

  // 密码的验证器---每当在密码输入框输入东西后，都会调用此函数去验证输入是否合法。自定义校验，即：自己写判断
  pwdValidator = (rule,value,callback)=>{    // rule 没使用,但还是要传,,类似pubsub订阅
    if(!value){
      callback('密码必须输入')
    }else if(value.length>12){
      callback('密码必须小于等于12位')
    }else if(value.length<4){
      callback('密码必须大于等于4位')
    }else if(!(/^\w+$/).test(value)){
      callback('密码必须是字母、数字、下划线组成')
    }else{
      callback()    /* 规则都符合时直接调用,且callback一定要调用 */
    }
  }

  render(){
    /* 有经过自定义的Login组件包装后的返回的新组件提供该属性和方法 */
    const {getFieldDecorator} = this.props.form;      
    return (
      <div className="login"> 
        <header>
          <img src={logo} alt="logo"/>
          <h1>商品管理系统{this.props.test}</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          {/* 使用antd的form表单 */}
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
            {getFieldDecorator('username', {    /* 'username'为该输入框的key; 输入框获取的输入内容为 value */  
              /*
                用户名/密码的的合法性要求
                  1). 必须输入
                  2). 必须大于等于4位
                  3). 必须小于等于12位
                  4). 必须是字母、数字、下划线组成
                */

                /* 定义用户名校验规则---“声明式验证”，即：自己不去做实际判断，只是声明 */
                rules: [
                  {required: true, message: '用户名必须输入！'},
                  {max: 12, message: '用户名必须小于等于12位'},
                  {min: 4, message: '用户名必须大于等于4位'},
                  {pattern: /^\w+$/, message: '用户名必须是字母、数字、下划线组成'}, /* 正则校验 */
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

                  /* 自定义校验!!! 需要定义方法 */
                  /* 读取时直接调用 this.pwdValidator */
                  rules: [
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
/* 严重注意：
    1.暴露的根本不是我们定义的Login组件，而是经过加工（包装）的Login组件。
    2.Form.create()调用返回一个函数，该函数加工了Login组件，生成了一个新组件，
      新组件实例对象的props多了一个强大的form属性，能完成验证。
    3.我们暴露出去的不再是Login，而是通过Login生成的一个新组件。 
*/
// export default Form.create()(Login) // 壳容器组件字节在下方,就不需要再进行暴露了


/* 连接 antd包裹login产生的新组件的 和其对应的壳 容器组件  */
/* 相当于找react-redux 生成一个壳容器组件,接收数据, 再将数据挂载到props属性上的方式,传递给壳内UI组件!!! */
export default connect(
  /* 控制状态, UI组件需要啥传啥 */
  state => ({test: state.test}),    // 直接和store管理产生修改state的reducer联系,再传递子组件
  /* 控制方法, UI组件需要啥方法传啥方法 */
  {
    demo1: createDemo1Action,       // 直接和actioncreator联系,再传递子组件
    demo2: createDemo2Action
  }
)(Form.create()(Login))             // 使用这里连接不是直接的login组件,得是那个经过 antd包裹后返回的那个新的UI组件

/* 
  总结：
    1. 高阶函数
      定义: 如果函数接收的参数是函数或者返回值是函数
      例子: Promise() / then() / 定时器 / 数组遍历相关方法 / bind() / $() / $.get() / Form.create()
      好处: 更加动态, 更加具有扩展性
      
    2. 高阶组件
      定义: 参数为组件，返回值为新组件的函数
      例子: Form.create()(组件) / withRouter(组件) / connect()(组件)
      与高阶函数的关系?  
          高阶组件是一个特别的高阶函数
          接收的是组件函数, 同时返回新的组件函数
      作用:
          React 中用于复用组件逻辑的一种高级技巧

    3. 组件本质就是函数, 由工厂函数产生或构造函数生成

    Form.create()(Login), 接收一个Form组件, 返回一个新组件
      Form.create = function () {
        const form = 创建一个强大form对象
        return function (FormComponent) {
          return class WrapComponent extends Component {
            render () {
              return <Login form={form}/>
            }
          }
        }
      }
      const LoginWrap = Form.create()(Login)
*/

