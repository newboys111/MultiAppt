
# 项目介绍


- 本小程序采用腾讯小程序云开发技术，不需要单独部署服务器和服务端程序  
- 功能模块包括用户注册，活动列表，活动分类，活动发布，活动报名，活动分享，活动邀请，后台管理等八大功能模块！ 

# UI设计思路
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132823_5e09285d_9240987.png "未命名-6.png")

# 功能说明
 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132045_ab3c55d3_9240987.gif "func导图1.gif")


# 技术运用

- 项目使用微信小程序平台进行开发。
- 使用腾讯云开发技术，免费资源配额，无需域名和服务器即可搭建。
- 小程序本身的即用即走，适合小工具的使用场景，也适合程序的开发。

# 项目效果截图
 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132059_b798ec12_9240987.png "首页.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132108_bd5f5572_9240987.png "活动列表.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132118_56ad18d0_9240987.png "活动详情.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132125_bc7d2b73_9240987.png "活动报名.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132134_56d27a30_9240987.png "创建活动.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132142_62726476_9240987.png "报名表格.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132150_e62bb226_9240987.png "个人中心.png")

# 项目后台截图
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132448_ea1dc2a1_9240987.png "后台首页.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132206_4d050ecf_9240987.png "后台登录.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132226_8d48c46b_9240987.png "后台用户.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132235_9f6aa271_9240987.png "后台报名表.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132500_ec6a8c79_9240987.png "后台活动管理.png")
 

# 部署教程：

### 1 源码导入微信开发者工具
 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132314_283deb7b_9240987.png "导入项目.png")
  

 

### 2 开通云开发环境
 -  参考微信官方文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html
- 在使用云开发能力之前，需要先开通云开发。 
- 在开发者工具的工具栏左侧，点击 “云开发” 按钮即可打开云控制台，根据提示开通云开发，并且创建一个新的云开发环境。
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232537_8a27b61c_9240987.png "云开发开通环境.png")
- 每个环境相互隔离，拥有唯一的环境 ID(拷贝此ID，后面配置用到)，包含独立的数据库实例、存储空间、云函数配置等资源；
 

#### 3 云函数及配置
- 本项目使用到了一个云函数activity_cloud 


- 在云函数cloudfunctions文件夹下选择云函数activity_cloud , 右键选择在终端中打开,然后执行 
- npm install –product
 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132527_66885616_9240987.png "安装云函数依赖.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132534_32f08680_9240987.png "安装云函数类库.png")

 

- 打开cloudfunctions/activity_cloud/comm/ccmini_config.js文件，配置环境ID和后台管理员手机号码

 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232806_b0477e47_9240987.png "云函数配置.png")

 


#### 4  客户端配置
- 打开miniprogram/app.js文件，配置环境ID

 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232832_6053aae0_9240987.png "客户端配置.png")


#### 5  云函数配置
- 在微信开发者工具-》云开发-》云函数-》对指定的函数添加环境变量 
- [服务端时间时区TZ] =>Asia/Shanghai
- [函数内存] =>128M   
- [函数超时时间] => 20秒
 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132723_565c091b_9240987.png "云函数配置.png")

 

#### 6  设置图片域名信任关系
- 进入小程序 开发管理=》开发设置=》服务器域名 =》downloadFile合法域名	
- 添加2个域名：
- 1）你的云存储域名，格式类似：https://1234-test-pi5po-1250248.tcb.qcloud.la
- 2）微信头像域名：https://thirdwx.qlogo.cn 
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/233716_fccfac0e_9240987.png "业务域名.png")

#### 7  上传云函数&指定云环境ID
 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0817/132739_7afde10a_9240987.png "上传云函数.png")

### 至此完全部署配置完毕。

### 在线演示：
 

 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/233918_96b29222_9240987.jpeg "Free版-QR.jpg")


### 如有疑问，欢迎骚扰联系我鸭： 
### 俺的微信:  cclinux0730


