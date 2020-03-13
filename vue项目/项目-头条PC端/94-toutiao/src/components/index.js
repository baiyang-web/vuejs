// Vue.use会调用对象中的install方法 install方法第一个参数是 Vue对象
import navLeft from './home/nav-left'
import headerTop from './home/header'
import breadCrumb from './common/bread-crumb'
import VueQuillEditor from 'vue-quill-editor'
import coverImg from './publish/cover-img'
import selectImg from './publish/select-img'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
    install(Vue){
        // 注册全局组件 
        Vue.component("nav-left",navLeft) // 注册左侧导航组件
        Vue.component("header-top",headerTop) // 注册头部组件
        Vue.component("bread-crumb",breadCrumb) // 注册面包屑组件
        Vue.use(VueQuillEditor)
        Vue.component('cover-img',coverImg) // 注册封面组件
        Vue.component('select-img',selectImg) // 选择图片组件
    }
}