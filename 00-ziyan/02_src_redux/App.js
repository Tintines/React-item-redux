import React,{Component} from 'react'
import {createIncrementAction, createDecrementAction} from './redux/action_creators'

export default class App extends Component{
    componentDidMount(){
        console.log(this.props.store);
    }

    increment = ()=>{
        let {value} = this.selectNumber;
        this.props.store.dispatch(createIncrementAction(value*1))
    };

    decrement = ()=>{
        let {value} = this.selectNumber;
        this.props.store.dispatch(createDecrementAction(value*1))
    };

    incrementIfOdd = ()=>{
        let {value} = this.selectNumber;
        let count = this.props.store.getState();
        if (count%2===1) {
            this.props.store.dispatch(createIncrementAction(value*1))
        }
    };

    incrementAsync = ()=>{
        let {value} = this.selectNumber;
        setTimeout(() => {
            this.props.store.dispatch(createIncrementAction(value*1))
        }, 1000);
    };
    
    render(){
        let count = this.props.store.getState();
        return (
            <div>
                <h1>当前计数为{count}</h1>
                <select ref={(selectNumber)=>{this.selectNumber=selectNumber}}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <button onClick={this.increment}>+</button>&nbsp;
                <button onClick={this.decrement}>-</button>&nbsp;
                <button onClick={this.incrementIfOdd}>increment if odd</button>&nbsp;
                <button onClick={this.incrementAsync}>increment async</button>&nbsp;
            </div>
        )
    }
}