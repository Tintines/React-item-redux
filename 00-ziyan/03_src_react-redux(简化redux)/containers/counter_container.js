import Counter from '../components/counter'
import {createIncrementAction, createDecrementAction} from '../redux/action_creators'
import {connect} from 'react-redux'
/* 简写方式 */
export default connect(
    state => ({count: state}),
    {
        increment: createIncrementAction,
        decrement: createDecrementAction
    }
)(Counter)

/* 完整写法 */
/* let mapStateToProps = state => ({count: state});

let mapDispatchToProps = dispatch => ({
    increment: (value) => {dispatch(createIncrementAction(value))},
    decrement: (value) => {dispatch(createDecrementAction(value))}
})

export default connect(mapStateToProps, mapDispatchToProps)(Counter) */
