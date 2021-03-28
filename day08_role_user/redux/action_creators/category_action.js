import {SAVE_CATEGORY_LIST} from '../action_types'

/* 用于保存用户分类的action */
export const createSaveCategoryAction = (value)=> {
    return {type:SAVE_CATEGORY_LIST,data:value}
  }