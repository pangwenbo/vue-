import axios from 'axios'
import {
        Message,
} from 'element-ui';

// 请求拦截  设置统一header
axios.interceptors.request.use(config => {
        if (localStorage.token) {
                config.headers['token'] = localStorage.token
        }

        return config
}, error => {
        return Promise.reject(error)
})

// 响应拦截  401 token过期处理
axios.interceptors.response.use(response => {
        return response.data
}, error => {
        // 错误提醒
        Message.error(error.response.data)

        const {
                status
        } = error.response
        if (status == 401) {
                Message.error('登录失效，请重新登录')
                // 清除token
                localStorage.removeItem('token')
                // 页面跳转
                router.push('/login')
        } else if (status == 403) {
                Message.error('权限不足，请联系管理员')
                // 页面跳转
                router.push('/404')
        }
        return Promise.reject(error)
})

export default axios