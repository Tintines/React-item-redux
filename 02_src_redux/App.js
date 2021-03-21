import React,{Component} from 'react'
import {createIncrementAction,createDecrementAction} from './redux/action_creators'


export default class App extends Component{

  componentDidMount(){
    console.log(this.props.store);
  }

  //加法
  increment = ()=>{
    let {value} = this.selectNumber
    this.props.store.dispatch(createIncrementAction(value*1))
  }

  //减法
  decrement = ()=>{
    let {value} = this.selectNumber
    this.props.store.dispatch(createDecrementAction(value*1))  //调用dispatch()分发数据
  }

  incrementIfOdd = ()=>{
    let {value} = this.selectNumber
    let count = this.props.store.getState()     // 调用getState()获取store中的数据
    if(count%2 === 1){
      this.props.store.dispatch(createIncrementAction(value*1))
    }
  }

  incrementAsync = ()=>{
    let {value} = this.selectNumber
    setTimeout(()=>{
      this.props.store.dispatch(createIncrementAction(value*1))
   },1000)
  }

  render(){
    //let {count} = this.state
    let count = this.props.store.getState()
    return (
      <div>
        <h3>当前计数为{count}</h3>
        <select ref={(selectNumber)=>{this.selectNumber=selectNumber}}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>&nbsp;
        <button onClick={this.increment}>+</button>&nbsp;
        <button onClick={this.decrement}>-</button>&nbsp;
        <button onClick={this.incrementIfOdd}>increment if odd</button>&nbsp;
        <button onClick={this.incrementAsync}>increment async</button>&nbsp;
      </div>
    )
  }
}