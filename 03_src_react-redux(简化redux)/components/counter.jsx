import React,{Component} from 'react'

export default class Counter extends Component{

  componentDidMount(){
    console.log(this.props.increment);
  }

  //加法
  increment = ()=>{
    let {value} = this.selectNumber
    //this.props.store.dispatch(createIncrementAction(value*1))
    this.props.increment(value*1)       // 向壳拿
  }

  //减法
  decrement = ()=>{
    let {value} = this.selectNumber
    this.props.decrement(value*1)
  }

  incrementIfOdd = ()=>{
    let {value} = this.selectNumber
    // let count = this.props.store.getState()     // 调用getState()获取store中的数据
    let {count} = this.props        // 直接向壳拿
    if(count%2 === 1){
      this.props.increment(value*1)
    }
  }

  incrementAsync = ()=>{
    let {value} = this.selectNumber
    setTimeout(()=>{
      this.props.increment(value*1)
   },1000)
  }

  render(){
    //let {count} = this.state                  // 数据在自己这时
    //let count = this.props.store.getState()   // 数据在store且没经过 react-redux 管理时
    return (
      <div>
        <h3>当前计数为{this.props.count}</h3>
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