import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
        SET_WS: 'SET_WS',
        SET_USER: 'SET_USER', // 用户信息
        SET_CHAT_LIST: 'SET_CHAT_LIST',
        SET_FRIEND_LIST: 'SET_FRIEND_LIST',
        SET_MESSAGE: 'SET_MESSAGE',
        SET_SELECT_CHAT_ID: 'SET_SELECT_CHAT_ID',
        SET_INFO: 'SET_INFO',
        SET_SCOLL: 'SET_SCOLL',
        SET_SEARCH: 'SET_SEARCH',
        SET_SELECT_FRIEND_ID: 'SET_SELECT_FRIEND_ID',
        SET_FRIEND_LIST_FILTER: 'SET_FRIEND_LIST_FILTER',
        SET_UNREAD: 'SET_UNREAD',
        SET_IFRAME_STATE: 'SET_IFRAME_STATE',
        SET_EMOJIS: 'SET_EMOJIS',
        SET_IN_GROUP: 'SET_IN_GROUP'
}

const state = { // 需要维护的状态
        ws: () => {
        },
        inGroup: false,
        user: {}, // 存储用户信息
        chatList: [],
        friendList: [],
        friendListFilter: [],
        message: {},
        selectChatId: 0,
        info: {},
        scoll: "",
        search: "",
        selectFriendId: 0,
        unread: "",
        iframeState: "full",
        emojis: [],
}

const getters = {
        ws: state => state.ws, //websocket
        inGroup: state => state.inGroup,
        user: state => state.user,
        chatList: state => state.chatList,
        friendList: state => state.friendList,
        message: state => state.message,
        selectChatId: state => state.selectChatId,
        info: state => state.info,
        scoll: state => state.scoll,
        search: state => state.search,
        selectFriendId: state => state.selectFriendId,
        friendListFilter: state => state.friendListFilter,
        unread: state => state.unread,
        iframeState: state => state.iframeState,
        emojis: state => state.emojis

}

const mutations = {
        [types.SET_WS](state, ws) { //更新个人信息
                state.ws = ws
        },
        [types.SET_IN_GROUP](state, inGroup) {
                if (inGroup)
                        state.inGroup = inGroup
                else
                        state.inGroup = false
        },
        [types.SET_EMOJIS](state, emojis) {
                if (emojis)
                        state.emojis = emojis
                else
                        state.emojis = ""
        },
        [types.SET_IFRAME_STATE](state, iframeState) {
                if (iframeState)
                        state.iframeState = iframeState
                else
                        state.iframeState = ""
        },
        [types.SET_UNREAD](state, unread) {
                if (unread)
                        state.unread = unread
                else
                        state.unread = ""
        },
        [types.SET_FRIEND_LIST_FILTER](state, friendListFilter) {
                if (friendListFilter)
                        state.friendListFilter = friendListFilter
                else
                        state.friendListFilter = []
        },
        [types.SET_SELECT_FRIEND_ID](state, selectFriendId) {
                if (selectFriendId)
                        state.selectFriendId = selectFriendId
                else
                        state.selectFriendId = ""
        },
        [types.SET_SEARCH](state, search) {
                if (search)
                        state.search = search
                else
                        state.search = ""
        },
        [types.SET_SCOLL](state, scoll) {
                if (scoll)
                        state.scoll = scoll
                else
                        state.scoll = ""
        },
        [types.SET_INFO](state, info) {
                if (info)
                        state.info = info
                else
                        state.info = {}
        },
        [types.SET_SELECT_CHAT_ID](state, selectChatId) {
                if (selectChatId)
                        state.selectChatId = selectChatId
                else
                        state.selectChatId = 0
        },
        [types.SET_MESSAGE](state, message) {
                if (message)
                        state.message = message
                else
                        state.message = {}
        },
        [types.SET_FRIEND_LIST](state, friendList) {
                if (friendList)
                        state.friendList = friendList
                else
                        state.friendList = []
        },
        [types.SET_CHAT_LIST](state, chatList) {
                if (chatList)
                        state.chatList = chatList
                else
                        state.chatList = []
        },
        [types.SET_USER](state, user) {
                if (user)
                        state.user = user
                else
                        state.user = {}
        },
}

const actions = {
        //提交ws
        setWs({ commit }, param) {
                return commit(types.SET_WS, param)
        },
        setInGroup: ({
                commit
        }, inGroup) => {
                commit(types.SET_IN_GROUP, inGroup)
        },
        setEmojis: ({
                commit
        }, emojis) => {
                commit(types.SET_EMOJIS, emojis)
        },
        setIframeState: ({
                commit
        }, iframeState) => {
                commit(types.SET_IFRAME_STATE, iframeState)
        },
        setUnread: ({
                commit
        }, unread) => {
                commit(types.SET_UNREAD, unread)
        },
        setFriendListFilter: ({
                commit
        }, friendListFilter) => {
                commit(types.SET_FRIEND_LIST_FILTER, friendListFilter)
        },
        setSelectFriendId: ({
                commit
        }, selectFriendId) => {
                commit(types.SET_SELECT_FRIEND_ID, selectFriendId)
        },
        setSearch: ({
                commit
        }, search) => {
                commit(types.SET_SEARCH, search)
        },
        setScoll: ({
                commit
        }, scoll) => {
                commit(types.SET_SCOLL, scoll)
        },
        setInfo: ({
                commit
        }, info) => {
                commit(types.SET_INFO, info)
        },

        setSelectChatId: ({
                commit
        }, selectChatId) => {
                commit(types.SET_SELECT_CHAT_ID, selectChatId)
        },
        setUser: ({
                commit
        }, user) => {
                commit(types.SET_USER, user)
        },
        setChatList: ({
                commit
        }, chatList) => {
                commit(types.SET_CHAT_LIST, chatList)
        },
        setFriendList: ({
                commit
        }, friendList) => {
                commit(types.SET_FRIEND_LIST, friendList)
        },
        setMessage: ({
                commit
        }, message) => {
                commit(types.SET_MESSAGE, message)
        },
}

export default new Vuex.Store({
        state,
        getters,
        mutations,
        actions
})