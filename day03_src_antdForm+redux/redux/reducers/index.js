import { combineReducers } from "redux";
import testReducer from "./test_reduder";

export default combineReducers({
  // 该对象里的key决定着store里保存该状态的key
  // 该对象里的value决定着store里保存该状态的value
  /* 只存最终状态, 具体实现需要到对应 reducer 中去查看 */
  test: testReducer,
});
