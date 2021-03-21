import React,{Component} from 'react'
/* 引入counter经过包装的壳组件 */
import CounterContainer from './containers/counter_container'

export default class App extends Component{
  render(){
    return (
      <CounterContainer/>
    )
  }
}