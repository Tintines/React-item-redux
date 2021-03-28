import React,{Component} from 'react'
import {Card, Button, Icon, Table, message, Modal, Form, Input} from 'antd'
import {reqCategoryList, reqAddCategory, reqUpdateCategory} from '../../api'
import {connect} from 'react-redux'
import {createSaveCategoryAction} from '../../redux/action_creators/category_action'

import {PAGE_SIZE} from '../../config'

const {Item} = Form;
@connect(
    state => ({}),
    {saveCategory: createSaveCategoryAction}
)
@Form.create()
class Category extends Component{
    state = {
        categoryList: [],       // 商品分类列表
        visible: false,         // 控制弹窗的展示或隐藏
        operType: '',           // 操作类型(新增? 修改?)
        isLoading: true,
        modalCurrentValue: '',  // 弹窗显示的值---用于数据回显
        modalCurrentId: ''      // 当前修改分类的id
    }

    componentDidMount(){
        /* 页面挂载请求商品分类列表 */
        this.getCategoryList();
    }

    /* 获取商品分类列表 */
    getCategoryList = async ()=>{
        let result = await reqCategoryList();
        this.setState({isLoading: false});      // 根据数据是否回来来控制是否显示正在加载中动画!
        const {status, data, msg} = result;
        if(status===0) {
            this.setState({categoryList: data.reverse()})
            /* 把商品的分类信息放入redux */
            this.props.saveCategory(data);
        }
        else message.error(msg, 1) 
    }

    /* 展示弹窗-- 作为新增 */
    showAdd = ()=>{
        this.setState({
            operType: 'add',        // 操作类型改为添加
            modalCurrentId: '',     // 重置当前操作的id
            modalCurrentValue: '',  // 重置弹窗回显值
            visible: true           // 展示弹窗
        })
    }

    /* 展示弹窗-- 作为修改 */
    showUpdate = (item)=>{
        const {_id, name} = item;   
        this.setState({
            modalCurrentValue: name,
            modalCurrentId: _id,
            visible: true,
            operType: 'update'
        })
    }

    /* 点击弹窗ok案件的回调 */
    handleOk = ()=>{
        const {operType} = this.state;
        this.props.form.validateFields((err, values)=>{     // valuse 为表单收集的数据
            if(err){
                message.warning('表单输入有误,请检查', 1);
                return
            }
            if(operType==='add') this.toAdd(values) 
            if(operType==='update'){
                const categoryId = this.state.modalCurrentId;
                const categoryName = values.categoryName;
                const categoryObj = {categoryId, categoryName};
                this.toUpdate(categoryObj);
            }
        })
    }
    /* 点击 弹窗取消按钮的回调 */
    handleCancel = ()=>{
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
    }

    /* 真正发请求执行增加的操作 */
    toAdd = async (values)=>{
        let result = await reqAddCategory(values)   // 把表单收集的所有的数据对象穿过去, 那边接参数时,结构赋值,只传递对应数据就可以了
        const {status, data, msg} = result;
        if(status===0){
            message.success('新增商品分类成功')
            /* 不能直接修改状态里的数据, 需要先深拷贝一份,再进行修改!!! */
            let categoryList = [...this.state.categoryList];
            categoryList.unshift(data);             // data为添加的新数据,结构与之前的一致
            this.setState({categoryList, visible: false});
            this.props.form.resetFields();          //  antd表单组件重置表单配置
        }
        if(status === 1) message.error(msg,1)       // status === 1 有服务器返回的数据类型决定
    }
    /* 真正发请求执行更新的操作 */
    toUpdate = async (categoryObj)=>{           // 接收需要更新的参数
        let result = await reqUpdateCategory(categoryObj);
        const {status, msg} = result;
        if(status===0){
            message.success('更新分类名称成功', 1);
            this.getCategoryList();             // 后台没返回更新成功的数据,我们通过重新请求商品列表 来获取最新的数据
            this.setState({visible: false});     // 隐藏弹窗
            this.props.form.resetFields();      // 重置表单
        }else{
            message.error(msg, 1);
        }
    }

    render(){
        let {getFieldDecorator} = this.props.form;       // 使用form表单需要先包装组件, 再从props中获取
        const dataSourse = this.state.categoryList;
        let {operType, visible} = this.state;

        const columns = [
            {
                title: '分类名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                key: 'age',
                //dataIndex: 'key',   // 此处不指定该参数时, render的参数会默认携带dataSource中的所有参数
                /* 通过在此处添加配置项,向表格中添加 按钮组件!! */
                render: (item)=>{
                    return <Button type="link" onClick={()=>{this.showUpdate(item)}}>修改分类</Button>
                },
                width: '25%',
                align: 'center'
            }
        ];

        return (
            <div>
                <Card 
                    /* 通过此配置添加 按钮 */
                    extra={<Button type="primary" onClick={this.showAdd}><Icon type="plus-circle"/>添加</Button>}
                >
                    <Table
                        dataSource = {dataSourse}
                        columns = {columns}
                        bordered
                        rowKey = "_id"      // 更改默认的key, 使用服务器返回来的数据中的 _id 作为遍历生成的每一项的key
                        pagination=  {{pageSize: PAGE_SIZE, showQuickJumper: true}}     // 配置分页器
                        loading = {this.state.isLoading}    // 配置页面加载状态
                    />
                    <Modal
                        title = {operType === 'add' ? '新增分类' : '修改分类'}
                        visible = {visible}
                        okText = '确定'
                        cancelText = '取消'
                        onOk = {this.handleOk}
                        onCancel = {this.handleCancel}
                    >
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Item>
                                {
                                    getFieldDecorator('categoryName',{
                                        initialValue: this.state.modalCurrentValue,     // 设置表单项目默认值
                                        rules: [
                                            {required: true, message: '分类名必须输入'}
                                        ]
                                    })(
                                        <Input placeholder="请输入分类名"/>
                                    )
                                }
                            </Item>
                        </Form>
                    </Modal>
                </Card>
            </div>
        )
    }
}

export default Category;