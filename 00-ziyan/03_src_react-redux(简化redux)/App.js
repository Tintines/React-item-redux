import React,{Component} from 'react'
/* 引入counter经过包装的壳组件 , 此时真正需要渲染的是那个包装组件的壳壳*/
import CounterContainer from './containers/counter_container'

export default class App extends Component{
    render(){
        return (
            /* 引入counter经过包装的壳组件 , 此时真正需要渲染的是那个包装组件的壳壳*/
            <CounterContainer/>
        )
    }
}