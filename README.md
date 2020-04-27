
版本说明：钱包项目，这是1.0.0版本，后续将往上叠加

*注意事项：

安装使用时需在src/common创建application.js文件（从下面拷一个改名就好）

    H5：使用了有赞ui，参考文档：https://youzan.github.io/vant/#/zh-CN/intro 
        登录滑动验证插件API：https://github.com/monoplasty/vue-monoplasty-slide-verify
        轻提示插件：https://github.com/lin-xin/vue-toast/blob/master/README_zh.md
 
基于Vue-cli 3.0手脚架搭建，项目本地预览：
    npm install -g serve	// 安装 
    serve -s dist		    // 运行 给出的是预览地址
    
返回上一页问题： 每个页面需设置路由钩子，存储页面来源，否则在用户初次打开H5，返回操作时可能出现问题
    
CSS热更新问题：vue.config.js修改配置
            css：{ 
                extract：false   // 打包时需改为true，否则打包css问价无法单独抽离出来
            }
            
发布问题：本地打包完成后，到根目录下的“.gitignore”文件中 把：/dist 删除（忽略文件）
        最后git提交，让后端更新即可
