## React项目每天任务表

### day01任务：
* 1.使用create-react-app创建基于react脚手架应用（最好精简一下脚手架）
* 2.引入antd，完成按需引入，自定义主题, 配置config-overrides.js 文件 
* 3.login静态页面（不使用atnd的任何组件）
* 4.login的Form表单（不加校验，只是使用静态的Form）
* 5.login的Form表单（给用户名加校验，声明式验证）
* 6.login的Form表单（给密码加校验，自定义验证）
* 7.理解好Form.create()(Login)
* 8.高阶组件、高阶函数

### day02任务
* redux，请切换到redux分支进行学习

### day03任务
* 1.搭建项目redux开发环境
* 2.建立myAxios.js文件，封装原生axios，使用请求拦截器统一更改post请求参数为urlencoded编码
* 
*   开发时使用:
*   配置代理服务器转发请求: package.json 中添加目标地址 "proxy": "http://localhost:4000"
*   发送请求时就站在自己的端口上如http://localhost:3000/login 脚手架会自动转发到4000的端口上,
*   返回来的数据,又经过代理服务器后才最终拿到
*   代理服务器和自己是同域的
*   
* 3.使用响应拦截器，统一处理所有ajax请求的错误 + 从axios返回对象中提取真正服务器返回的数据
* 4.Redux保存user和token数据，完成自动登录
* 5.完成退出登录逻辑

### day04任务
* 1.使用es6的装饰器语法

	    //装饰器语法，让MyClass多了一个a属性
	    @demo
	    class MyClass { }
	    function demo(target) {
	      target.a = 1;
	    }
	    //正常语法，让MyClass多了一个a属性
	    class MyClass { }
	    function demo(target) {
	      target.a = 1;
	    }
    	MyClass = demo(MyClass)
* 2.token工作原理 + 实现token验证
* 3.Admin界面布局 -- 使用antd的Layout组件
* 4.Admin子路由搭建 -- 区分好容器组件和UI组件
* 5.Header组件静态
* 6.Header组件交互--全屏切换，使用screenfull库
* 7.Header组件交互--退出登录，使用antd的Modal提示框组件
* 8.Header组件交互--天气预报，请求的是百度接口，使用了jsonp库发送请求
* 9.使用withRouter包装非路由组件，让非路由组件可以使用路由组件的API


### day06
分页:
1.前端分页
	1.一次性返回所有数据,由前端人员进行数据的切割,整理,划分页数
	2.当数据量足够大时,会产生页面卡顿或浏览器"假死"
2.后端分页
	1.返回的是一部分数据,需要请求时指明: 每页显示多少条,你在哪一页,交由服务器去进行数据切割
	2.后台需要明确: a.每页显示多少条 b.你要哪一页, 同时后台返回数据一共有多少个用于交给前端进行显示

### 富文本编辑器
yarn add draft-js@0.11.2 draftjs-to-html@0.8.4 html-to-draftjs@1.4.0 react-draft-wysiwyg@1.13.2


### day08 
数据可视化
	1). echarts(百度) ==> yarn add echarts echarts-for-react
    2). g2(阿里) ==> yarn add bizCharts
    3). d3(国外)
