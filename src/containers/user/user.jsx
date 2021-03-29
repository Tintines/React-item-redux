import React,{Component} from 'react'
import {Card,Button,Icon,Table, message,Modal,Form,Input,Select} from 'antd';
import dayjs from 'dayjs'
import {reqUserList, reqAddUser, reqDeleteUser, reqUpdateUser} from '../../api'

import {PAGE_SIZE} from '../../config'
const {Item} = Form;
const {Option} = Select;

@Form.create()
class User extends Component{
  state = {
    isShowAdd: false,   // 是否展示新增弹窗
    userList: [],       // 用户列表
    roleList: [],       // 角色列表

    operType: '',           // 操作类型(新增add? 修改update?)
    modalCurrentId: '' ,    // 当前修改的id
    result:{},
  }

  componentDidMount(){
    this.getUserList();
  }

  getUserList = async()=>{
    let result = await reqUserList();
    const {status, data} = result;
    if(status===0) this.setState({
      userList: data.users.reverse(),
      roleList: data.roles,
    })
  }

  /* 新增用户弹窗--确定按钮回调 */
  handleOk = ()=>{
    const {operType, modalCurrentId} = this.state;
    this.props.form.validateFields((err, values)=>{
      if(err) return;
      if(operType==='add') this.toAddUser(values) ;
      if(operType==='update') this.toUpdateUser(modalCurrentId, values)
    })
  }

  toUpdateUser = async (modalCurrentId, values)=>{
    console.log(values);
    console.log(modalCurrentId);
    let result = await reqUpdateUser(modalCurrentId, values)
    const {status,  msg} = result;
    if(status===0){
      message.success('修改用户成功');
      /* 方法一 */
      this.getUserList();  
      /* 方法二根据返回的数据对原来的数据进行更改 */

      /* 修改完成后,关闭表单显示的同时,需要把原来用于修改时回显数据的 result清空!!! ,
      否则新添加时页面也会先读取result中的值!!! */
      this.setState({isShowAdd: false, result: {}})

    }
    else message.error(msg, 1);
  }

  toAddUser = async(values)=> {
    let result = await reqAddUser(values);
    // console.log(result);
    const {status, data, msg} = result;
    if(status===0){
      message.success('添加用户成功');
      let userList = [...this.state.userList];    // 修改包含有数组或对象的数据时需要先赋值一份
      userList.unshift(data);
      this.setState({userList, isShowAdd: false})   
    }
    else message.error(msg, 1);
  }

  /* 新增用户弹窗--取消按钮回调 */
  handleCancel = ()=>{
    this.setState({isShowAdd: false})
  }

  /* 删除指定用户 */
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if(result.status===0) {
          message.success('删除用户成功!')
          this.getUserList()
        }
      },
      okText:'确认',        // okText='确认' 对象中要写冒号形式!!!
      cancelText:'取消',
    })
  }

  /* 显示更新弹窗 */
  showUpdate = (user)=>{
    const {_id} = user;  
    // console.log(_id);
    const {userList} = this.state;
    let result = userList.find((item)=>{
      return item._id === _id;
    })
    this.setState({result, isShowAdd: true, operType: 'update', modalCurrentId: _id}) 
  }

  render(){
    const {getFieldDecorator} = this.props.form;

    const dataSource = this.state.userList;
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: time => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss'),
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        render: (id)=>{
          let result = this.state.roleList.find((item)=>{
            return item._id === id;
          })
          if(result) return result.name;
        }
      },
      {
        title: '操作',
        key: 'option',
        /* render内部回调函数写jsx语法时,使用括号进行包裹!!!,js语句时则正常大括号, 写错了会报错 */
        render: (user)=>( 
          <div>
            <Button type='link' onClick={() => this.showUpdate(user)}>修改</Button>
            <Button type='link' onClick={() => this.deleteUser(user)}>删除</Button>
          </div>
        )
      }
    ];


    return (
      <div>
        <Card
          title = {
            <Button type='primary' onClick={() => {
              this.setState({isShowAdd: true, operType: 'add'});
              this.props.form.resetFields();    // 清空表单
            }}
            >
              <Icon type='plus'/>创建用户
            </Button>
          }
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            pagination={{defaultPageSize: PAGE_SIZE}}
            rowKey='_id'    // 更改遍历使的key值 指向_id
          />
        </Card>
        {/* 新增角色提示框 */}
        <Modal
          title={this.state.operType==='add' ? '添加用户':'修改用户'}
          visible={this.state.isShowAdd}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText='确认'
          cancelText='取消'
        >
          <Form labelCol={{span: 4}} wrapperCol={{span: 16}}>
            <Item label='用户名'>
              {
                getFieldDecorator('username', {
                  initialValue: this.state.result.username || '',
                  rules: [{required: true, message: '用户名必须输入'},]
                })(<Input placeholder='请输入用户名'/>)
              }
            </Item>
            <Item label='密码'>
              {
                getFieldDecorator('password', {
                  initialValue: this.state.result.password || '',
                  rules: [{required: true, message: '密码必须输入'}]
                })(<Input placeholder='请输入密码'/>)
              }
            </Item>
            <Item label='手机号'>
              {
                getFieldDecorator('phone', {
                  initialValue: this.state.result.phone || '',
                  rules: [{required: true, message: '手机号必须输入'}]
                })(<Input placeholder='请输入手机号'/>)
              }
            </Item>
            <Item label='邮箱'>
              {
                getFieldDecorator('email', {
                  initialValue: this.state.result.email || '',
                  rules: [{required: true, message: '邮箱必须输入'}]
                })(<Input placeholder='请输入邮箱'/>)
              }
            </Item>
            <Item label='角色'>
              {
                getFieldDecorator('role_id', {
                  initialValue: this.state.result.role_id || '',
                  rules: [{required: true, message: '必须选择一个角色'}]
                })(
                  <Select>
                    <Option value=''>请选择一个角色</Option>    
                    {
                      this.state.roleList.map((item)=>{
                        return <Option key={item._id} value={item._id}>{item.name}</Option>
                      })
                    }
                  </Select>
                )
              }
            </Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default User;