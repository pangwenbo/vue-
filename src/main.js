import("babel-polyfill")
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import axios from './https'
import qs from 'qs'
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver/theme";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/table";
import "tinymce/plugins/fullscreen";
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import './assets/element-variables.scss'
import {
        Dialog,
        Button,
        Checkbox,
        CheckboxGroup,
        Form,
        Input,
        Message,
        Notification,
        Pagination,
        DatePicker,
        Tabs,
        TabPane,
        Badge,
        Loading
} from 'element-ui';

// 全局注册
Vue.use(Dialog).use(Button).use(Checkbox).use(CheckboxGroup).use(Form).use(Input).use(Pagination).use(DatePicker).use(Tabs).use(TabPane).use(Badge).use(Loading)
Vue.use(Viewer)
Vue.config.productionTip = false
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
new Vue({
        el: '#app',
        router,
        store,
        template: '<App/>',
        components: {
                App
        }
})