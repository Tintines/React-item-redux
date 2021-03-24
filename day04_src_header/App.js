import React,{Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
/* 引入经过包装的容器组件 */
import Login from './containers/login/login'
import Admin from './containers/admin/admin'

export default class App extends Component{
  render(){
    return (
      <div className="app">
          <Switch>
              <Route path="/login" component={Login}/>
              <Route path="/admin" component={Admin}/>
              {/* 重定向至admin时,当用户登录过,再次输入地址,可不需要跳转到login页面后再进行跳转,
              选好重定向页面将会少跳转一次 */}
              <Redirect to="/admin"/>
          </Switch>
      </div>
    )
  }
}