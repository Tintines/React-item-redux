import Counter from '../components/counter'
import {
  createIncrementAction,
  createDecrementAction,
  createIncrementAsyncAction
} from '../redux/actions/counter_action'

import {connect} from 'react-redux'

//简写方式
export default connect(   // 暴露出去一个经过加工后的壳组件!!
  /* {    // 总store中保存数据的结构
  count:0,
  person:[],
  } */
  /* 这里的state是store所管理的那个“超级超级超级大的”对象，里面包含着所有的状态 */
  /* 这个state超级对象, 是由store的弟弟们reducers中的index汇集而来,里面有所有的key和value */
  /* 传递标签属性时就需要根据数据结构 从state身上去正确的获取!!! */
  state => ({count: state.count, person: state.person}), 
  {
    increment:createIncrementAction,
    decrement:createDecrementAction,
    incrementAsync:createIncrementAsyncAction
  }
)(Counter)      // 传入真正的组件



