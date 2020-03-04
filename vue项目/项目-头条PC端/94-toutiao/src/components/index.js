// Vue.use会调用对象中的install方法 install方法第一个参数是 Vue对象
import navLeft from './home/nav-left'
import headerTop from './home/header'
import breadCrumb from './common/bread-crumb'
export default {
    install(Vue){
        // 注册全局组件 
        Vue.component("nav-left",navLeft) // 注册左侧导航组件
        Vue.component("header-top",headerTop) // 注册头部组件
        Vue.component("bread-crumb",breadCrumb) // 注册面包屑组件
    }
}