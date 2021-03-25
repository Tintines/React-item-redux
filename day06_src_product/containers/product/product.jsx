import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Card, Button, Select, Input, Icon, message, Table} from 'antd'
import {createSaveProductAction} from '../../redux/action_creators/product_action'
import {reqProductList, reqUpdateProdStatus, reqSearchProduct} from '../../api'
import { PAGE_SIZE } from '../../config';

const {Option} = Select;
@connect(
  state => ({}),
  {saveProduct: createSaveProductAction}
)
class Product extends Component{
  /* 初始化数据 */
  state = {
    productList: [],    // 商品列表数据(分页)
    current: 1,         // 当前在哪一页
    total: '',          // 一共有几页
    keyWord: '',        // 搜索关键词
    searchType: 'productName'   // 搜索类型
  }

  componentDidMount(){
    /* 页面加载发送请求 */
    this.getProductList();    
  }

  /* 将初始化列表 和 搜索列表 扭在一起(通过一个标识量判别), 复用代码 */
  /* 真后端分页 */
  getProductList = async (number=1)=>{      // 默认请求第一页
    const {searchType, keyWord} = this.state;
    let result;
    /* 由于后端接口 keyWord 为非必要字段,当不进行传参时, 应该默认返回初始状态数据 */
    if(this.isSearch) result = await reqSearchProduct(number, PAGE_SIZE, searchType, keyWord)
    else result = await reqProductList(number, PAGE_SIZE)
    const {status, data} = result;
    if(status===0){
      this.setState({
        productList: data.list,
        total: data.total,
        current: data.pageNum     // 当前页码
      })
      /* 将获取的商品列表存入redux中,当后续需要时直接从redux中获取, 就不必向服务器重新发请求请求数据了 */
      this.props.saveProduct(data.list);
    }
    else message.error('获取商品列表失败')
  }

  /* 搜索 */
  search = async ()=>{
    /* 在实例身上 添加isSearch属性,值为true ,用来标识当前是否为搜索操作
      且该标识定义在该 search函数内部,只在局部作用域起作用!!!, 只在局部作用域设置后才能读到 */
    this.isSearch = true;
    this.getProductList();
    }

  /* 更新商品 */
  updateProdStatus = async ({_id, status})=>{
    let productList = [...this.state.productList];          // 复制一份
    if(status===1) status = 2;                              // 1 代表上架     2 代表下架
    else status = 1;
    let result = await reqUpdateProdStatus(_id, status);    // 已经向服务器端发送请求修改相关数据! 在服务器端真正修改数据

    /* 此if语句仅仅需要显示正确状态即可!!! 此前必须服务器端已经完成修改更新操作 */
    if(result.status===0){
      message.success('更新商品状态成功')
      /* 方法一 直接再从数据库进行重新请求拉取, 若数据过多,则不适用! */

      /* 方法二:从状态中读取 */
      productList = productList.map((item)=>{
        if(item._id===_id){
          item.status = status;
        }
        return item;
      })
      this.setState({productList})
    }
    else message.error('更新商品状态失败')
  }

  render(){
    const dataSource = this.state.productList;
    const columns = [
      {
        title: '商品名称',
        width: '18%',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',       // 对应render内传递的参数对应的key
        key: 'price',
        align: 'center',
        width: '9%',
        /* 对某项数据进行加工时需要调用render方法 */
        render: price => '￥'+ price  // 拼串
      },
      {
        title: '状态',
        // dataIndex: 'status,
        width: '10%',
        align: 'center',
        key: 'status',
        /* 对某项数据进行加工时需要调用render方法 */
        render: (item)=>{
          return (
            /* 多个内容需要添加根标签 */
            <div>
              <Button type={item.status === 1 ? 'danger' : 'primary'}
                onClick={()=>{this.updateProdStatus(item)}}
              >
                {item.status === 1 ? '下架' : '上架'}
              </Button> <br/>
              <span>{item.status === 1 ? '在售' : '已停售'}</span>
            </div>
          )
        }
      },
      {
        title: '操作',
        // dataIndex: 'opera',
        width: '10%',
        align: 'center',
        key: 'opera',
        render: (item)=>{
          return (
            <div>
              <Button type="link" onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}>商品详情</Button>
              <Button type="link" onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/5200505`)}}>修改详情</Button>
            </div>
          )
        }
      }
    ]
    return (
      <Card
        title={
          <div>
            {/* 选择框onChange传入 value 参数 */}
            <Select defaultValue="productName" onChange={(value)=>{this.setState({searchType: value})}}>
              <Option value="productName">按名称搜索</Option>
              <Option value="productDesc">按描述搜索</Option>
            </Select>
            <Input 
              style={{margin: '0 10px', width: '20%'}}
              placeholder="请输入搜索关键字"
              allowClear
              /* 绑定onChange事件受控组件自动获取输入框内输入值, 传入event */
              /* 非受控组件时,使用添加ref属性 或通过包裹表单From形式 从验证器中进行读取 */
              onChange={(event)=> {this.setState({keyWord: event.target.value})}}
            />
            <Button type="primary" onClick={this.search}><Icon type="search"/>搜索</Button>
          </div>
        }
        extra={<Button type="primary" onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}}>
          <Icon type="plus-circle"/>添加商品</Button>}
      >
        <Table
          dataSource = {dataSource}
          columns = {columns}
          bordered
          rowKey = '_id'          // 对table自带的分页器进行配置
          pagination = {{
            total: this.state.total,
            pageSize: PAGE_SIZE,
            current: this.state.current,      // 当前第几页
            onChange: this.getProductList     // 调用时自动携带点击时所对应的页码
          }}
        />
      </Card>
    )
  }
}

export default Product