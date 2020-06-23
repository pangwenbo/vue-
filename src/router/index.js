import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router({
        mode: 'history',
        base: process.env.BASE_URL,
        routes: [{
                path: '/',
                redirect: {
                        name: 'chat'
                }
        }, {
                path: '/index',
                name: 'index',
                component: resolve => (require(['../page/index.vue'], resolve)),
                children: [{
                                path: '',
                                component: resolve => (require(['../page/chat/chat.vue'], resolve)),
                        }, {
                                path: '/chat',
                                name: 'chat',
                                component: resolve => (require(['../page/chat/chat.vue'], resolve)),
                                children: [{
                                        path: 'group',
                                        name: 'group',
                                        component: resolve => (require(['../components/message/groupMessage.vue'], resolve)),
                                }, {
                                        path: 'friend',
                                        name: 'friend',
                                        component: resolve => (require(['../components/message/friendMessage.vue'], resolve)),
                                }, {
                                        path: 'customer',
                                        name: 'customer',
                                        component: resolve => (require(['../components/message/customerMessage.vue'], resolve)),
                                }]
                        },
                        {
                                path: '/friend',
                                name: 'friend',
                                component: resolve => (require(['../page/friend/friend.vue'], resolve)),
                        },
                ]
        }]
})
export default router