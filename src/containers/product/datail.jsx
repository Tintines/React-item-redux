import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Button, Card, Icon, List, message} from 'antd'
import {reqProdById, reqCategoryList} from '../../api'
import {BASE_URL} from '../../config'
import './detail.less'

const {Item} = List;
@connect(
    state => ({
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
                return item._id === this.categoryId;    // 返回产品ID和 分类ID相同的那一项
            })
            /* 此处是详情页中获取该商品所属分类名称 */
            if(result) this.setState({categoryName: result.name, isLoading: false})
        }
        else message.error(msg)
    } 
    
    componentDidMount(){
        const {id} = this.props.match.params;               // 获取参数路由的ID, 此时为字符串类型
        /* 从redux中获取 */
        const reduxProdList = this.props.productList;       // 获取产品列表
        const reduxCateList = this.props.categoryList;      // 获取分类列表
        if(reduxProdList.length){
            let result = reduxProdList.find((item)=>item._id === id)
            if(result){
                this.categoryId = result.categoryId;
                /* const {categoryId,desc,detail,imgs,name,price} = result
                this.setState({categoryId,desc,detail,imgs,name,price}) */
                this.setState({...result});
            }
        }
        else this.getProdById(id);

        if(reduxCateList.length){
        let result = reduxCateList.find((item)=>item._id === this.categoryId)
        this.setState({categoryName:result.name, isLoading:false})  // 获取产品id对应的分类名称
        }
        else this.getCategoryList()
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
                <List loading={this.state.isLoading}>
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