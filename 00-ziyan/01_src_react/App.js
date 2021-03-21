import React, {Component} from 'react' 

export default class App extends Component {
    /* 初始化显示 */
    state = {
        count: 0,
    }

    /* 定义方法 */
    increment = ()=>{
      let {value} = this.selectNumber;
      let {count} = this.state;
      /* 更新状态 */
      this.setState({count: count+value*1})     // 转数字
    }

    decrement = ()=>{
      let {value} = this.selectNumber;
      let {count} = this.state;
      this.setState({count: count-value*1});
    }

    incrementIfOdd = ()=>{
      let {value} = this.selectNumber;
      let {count} = this.state;
      if (count%2===1) {
          this.setState({count: count+value*1})
      }
    }

    incrementAsync = ()=>{
      let {count} = this.state;
      let {value} = this.selectNumber;
      setTimeout(() => {
          this.setState({count: count+value*1})
      }, 1000);
    }


    render() {
        let {count} = this.state;
        return (
            <div>
                <h2>当前计数为{count}</h2>
                <select ref={(selectNumber) => {this.selectNumber=selectNumber}}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                </select>
                <button onClick={this.increment}>+</button>&nbsp;
                <button onClick={this.decrement}>-</button>&nbsp;
                <button onClick={this.incrementIfOdd}>increment if odd</button>&nbsp;
                <button onClick={this.incrementAsync}>increment async</button>&nbsp;
            </div>
        )
    }
}