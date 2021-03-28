import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Button, Card, Icon, List, message} from 'antd'
import {reqProdById, reqCategoryList} from '../../api'
import {BASE_URL} from '../../config'
import './detail.less'

const {Item} = List;
@connect(
    state => ({     // 返回一个对象, 需要添加小括号!!!
        productList: state.productList,
        categoryList: state.categoryList
    })
)
class Datail extends Component{
    state = {
        categoryId: '', 
        categoryName: '',       // 商品分类名称
        desc: '',
        detail: '',
        imgs: [],
        name: '',
        price: '',
        isLoading: true,
    }

    /* 根据商品id获取商品信息 */
    getProdById = async (id)=>{
        let result = await reqProdById(id);
        const {status, data, msg} = result;
        if(status===0){
            /* 解决setState异步加载 问题 */
            this.categoryId = data.categoryId;  // 将产品ID添加到组件的categoryId属性上
            this.setState({...data})
        }
        else message.error(msg)
    }

    /* 获取分类列表 */
    getCategoryList = async ()=>{
        let result = await reqCategoryList();
        const {status, data, msg} = result;
        if(status===0){
            let result = data.find((item)=>{
                /* 解决setState异步加载 问题 */
                return item._id === this.categoryId;    // 返回产品ID和 分类ID相同的那一项
            })
            /* 此处是详情页中获取该商品所属分类名称 */
            if(result) this.setState({categoryName: result.name, isLoading: false})
        }
        else message.error(msg)
    } 
    
    /* 在react中包含声明周期钩子, this.state()都是异步的,即: 更新状态后, 不会立即生效!!!! */
    /* 导致你直接存储状态数据后, 紧跟着却读不到刚刚存的数据!!! 代码同步执行引起的 */
    componentDidMount(){
        const {id} = this.props.match.params;               // 获取参数路由的ID, 此时为字符串类型
        /* 从redux中获取 */
        const reduxProdList = this.props.productList;       // 获取产品列表
        const reduxCateList = this.props.categoryList;      // 获取分类列表
        if(reduxProdList.length){
            let result = reduxProdList.find((item)=>item._id === id)
            if(result){

                /* 妙妙妙!!! */
                /* 解决this.state异步存储,后立即调用读不到的问题, 即存储之前,将数据挂载到组件上!!!! */
                this.categoryId = result.categoryId;
                /* const {categoryId,desc,detail,imgs,name,price} = result
                this.setState({categoryId,desc,detail,imgs,name,price}) */
                /* 由bable之后 ...运算符 也可展开对象 */
                this.setState({...result});     // setState 该操作是异步执行的!!!!!
            }
        }
        else this.getProdById(id);

        /* 当用户不先点击分类,直接点击商品列表时,此时分类列表还没存储到redux,此时需要重新发送请求 */
        if(reduxCateList.length){       // redux中如果有分类列表就直接读取, 
        
            /* 此为实际开发中 比较经典的问题!!! 由setState异步指向所引起的问题!!! */
            /* 此处如果直接通过this.state.categoryId读取刚刚存到state中的categoryId时,
            由于setState异步原因,根本读不到该值,通过先保存需要的数据到组件上,通过组件来进行
            读取来解决该问题!!! 
            若不要读取判断只是页面显示则不需要处理:因为现在即使读取不到,但是当setState
            异步执行完毕,状态数据发生改变之后,页面会再次render以显示正确的页面状态.*/
            let result = reduxCateList.find((item)=>item._id === this.categoryId)
            this.setState({categoryName:result.name, isLoading:false})  // 获取产品id对应的分类名称
        }
        else this.getCategoryList()     // redux中没有分类列表就重新发送分类请求重新请求数据
    }

    render(){
        return (
            <Card
                title={
                    <div className='left-top'>
                        <Button type='link' size="default" onClick={()=>{this.props.history.goBack()}}>
                            <Icon type="arrow-left" style={{fontSize: '20px'}}/>
                        </Button>
                        <span>商品详情</span>
                    </div>
                }
            >
                <List loading={this.state.isLoading}>       {/* 添加加载状态 */}
                    <Item>
                        <span className="prod-title">商品名称: </span>
                        <span>{this.state.name}</span>
                    </Item>
                    <Item>
                        <span className="prod-title">商品描述: </span>
                        <span>{this.state.desc}</span>
                    </Item>
                    <Item>
                        <span className="prod-title">商品价格: </span>
                        <span>{this.state.price}</span>
                    </Item>
                    <Item>
                        <span className="prod-title">所属分类: </span>
                        <span>{this.state.categoryName}</span>
                    </Item>
                    <Item>
                        <span className="prod-title">商品照片: </span>
                        {
                            this.state.imgs.map((item, index)=>{
                                /* 图片一般都不改动使用index作为key值即可 */
                                return <img key={index} src={`${BASE_URL}/upload/`+item} alt="商品图片" style={{width: '200px'}}/>
                            })
                        }
                    </Item>
                    <Item>
                        <span className="prod-title">商品详情: </span>
                        {/* 将富文本编辑器产生的带标签的文本插入到标签中并生效,
                        就使用dangerouslySetInnerHTML={{__html:this.state.detail}} */}
                        <span dangerouslySetInnerHTML={{__html: this.state.detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}

export default Datail