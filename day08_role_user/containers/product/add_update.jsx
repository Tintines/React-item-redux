import React,{Component} from 'react'
import {Card,Button,Icon,Form,Input,Select,message} from 'antd'
import {connect} from 'react-redux'
import PicturesWall from './picture_wall'
import RichTextEditor from './rich_text_editor'
import { reqCategoryList, reqProdById, reqAddProduct, reqUpdateProduct } from '../../api'

const {Item} = Form;
const {Option} = Select;

@connect(
    state => ({
        categoryList: state.categoryList,
        productList: state.productList
    }),
    {}
)
@Form.create()
class AddUpdate extends Component{
    /* 初始化数据 */
    state = {
        categoryList: [],   // 商品分类列表
        operaType: 'add',   // 操作类型
        categoryId: '',
        name: '',
        desc: '',
        price: '',
        detail: '',
        imgs: [],
        _id: ''
    }

    componentDidMount(){
        const {categoryList, productList} = this.props;
        const {id} = this.props.match.params;       // 从params路由路径中获取id
        if(categoryList.length) this.setState({categoryList})       // 先从redux中读取
        else this.getCategoryList();                // 发送请求重新读取, 异步请求定义在钩子外部!!!!!!
        if(id){
            this.setState({operaType: 'update'})
            if(productList.length){
                let result = productList.find((item)=>{
                    return item._id === id;
                })
                if(result){
                    this.setState({...result});
                    this.pictureWall.setFileList(result.imgs);
                    this.richTextEditor.setRichText(result.detail);
                }
            }
            else this.getProductList(id);
        }
    }

    /* 获取分类列表 */
    getCategoryList = async()=>{
        let result = await reqCategoryList();
        const {status, data, msg} = result;
        if(status===0) this.setState({categoryList: data})
        else message.error(msg)
    }

    /* 获取产品列表 */
    getProductList = async (id)=>{
        let result = await reqProdById(id);
        const {status, data} = result;
        if(status===0){
            this.setState({...data});
            this.pictureWall.setFileList(data.imgs);
            this.richTextEditor.setRichText(data.detail);
        }
    }

    /* 提交表单 */
    handleSubmit = (event)=>{
        event.preventDefault();

        /* 父组件调用子组件方法的骚操作 */
        /* 从子组件!!!上传组件中调用获取已经上传的图片数组的方法!!! 
        this.pictureWall 相当于子组件的实例去调用子组件的方法!!! */
        let imgs = this.pictureWall.getImgArr();
        //从富文本组件中获取用户输入的文字转换为富文本的字符串
        let detail = this.richTextEditor.getRichText();

        const {operaType, _id} = this.state;
        this.props.form.validateFields(async (err, values)=>{
            if(err) return;
            let result;
            /* {...values,imgs,detail}表示将 从子组件中获取的数据放到一起 */
            if(operaType === 'add') result = await reqAddProduct({...values, imgs, detail})
            else result = await reqUpdateProduct({...values, imgs, detail, _id})
            const {status, msg} = result;
            if(status === 0){
                message.success('操作成功');
                this.props.history.replace('/admin/prod_about/product')
            }
            else message.error(msg)
        })
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const {operaType} = this.state;
        return (
            <Card
                title = {
                    <div>
                        <Button type="link" onClick={this.props.history.goBack}>
                            <Icon type="arrow-left"/>
                            <span>返回</span>
                        </Button>
                        <span>{operaType==='update' ? '商品修改' : '商品添加'}</span>
                    </div>
                }
            >
                <Form
                    onSubmit={this.handleSubmit}
                    /* 设置表单项中Item项中 label 和 input 在页面中的占比!
                    类似bootstrap 每一行默认占24份 */
                    labelCol={{md: 2}}
                    wrapperCol={{md: 7}}
                >
                    <Item label="商品名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: this.state.name || '',    //有的话从状态拿, 没有就显示''
                                /* 添加必填配置项, label文字头会自动添加 * 号 */
                                rules: [{required: true, message: '请输入商品名称'}],
                            })(
                                <Input placeholder="商品名称"/>
                            )
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator('desc', {      // 表单中收集手机时的属性名
                                initialValue: this.state.desc || '',
                                rule: [
                                    {required: true, message: '请输入商品描述'}
                                ]
                            })(
                                <Input placeholder="商品描述"/>
                            )
                        }
                    </Item>
                    <Item label="商品价格">
                        {
                            getFieldDecorator('price', {
                                initialValue: this.state.price || '',
                                rules: [
                                    {required: true, message: '请输入商品价格'}
                                ]
                            })(
                                <Input 
                                    placeholder="商品价格"
                                    addonAfter="元"
                                    prefix="￥"
                                    type="number"   // 原生使输入框后部出现 可点击的加减器,其包括内置验证以拒绝非数字输入
                                    min="0"
                                    /* number类型可能会引发一系列问题 ,手动输入不符合规范的会被人为无效
                                    https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/number*/
                                />   
                            )
                        }
                    </Item>
                    <Item label="商品分类">
                        {
                            getFieldDecorator('categoryId', {
                                initialValue: this.state.categoryId || '',
                                rules: [
                                    {required: true, message: '请选择一个分类'}
                                ]
                            })(
                                <Select>
                                    <Option value="">请选择分类</Option>
                                    {
                                        this.state.categoryList.map((item)=>{
                                            return <Option key={item._id} value={item._id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <Item label="商品列表" wrapperCol={{md: 12}}>     {/* 设置item占多少份 */}  

                        {/* 图片上传组件,给子组件添加ref属性 */}
                        <PicturesWall ref={(pictureWall)=>{this.pictureWall=pictureWall}}/>
                    </Item>
                    <Item label="商品详情" wrapperCol={{md: 16}}>
                        {/* 富文本编辑器 */}
                        <RichTextEditor ref={(richTextEditor)=>{this.richTextEditor=richTextEditor}}/>
                    </Item>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form>
            </Card>
        )
    }
}

export default AddUpdate