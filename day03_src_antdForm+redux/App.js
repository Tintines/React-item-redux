import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
/* 引入的不是我们定义的那个Login，而是根据我们定义的Login经过antd包装后又和壳容器链结构生成的全新新组件!!! */
import Login from './containers/login/login' 
import Admin from './containers/admin/admin'


export default class App extends Component{
  render(){
    return (
      <div className="app">   {/* 该className="app" 配合less 专用于解决背景不铺满整个窗口的问题 */}
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/admin" component={Admin}/>
        </Switch>
      </div>
    )
  }
}