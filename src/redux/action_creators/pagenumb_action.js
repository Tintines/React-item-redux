import {SAVE_PAGE_NUMB} from '../action_types'

/* 创建保存用户信息的action */
export const createSavePagenumbAction = (value)=>{
  return {type: SAVE_PAGE_NUMB, data: value}
}