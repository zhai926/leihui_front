import Vue from 'vue'
import Vuex from 'vuex'
import actions from './action'
import { setStore,getStore,removeStore } from '../config/storage'
 
Vue.use(Vuex)

const state = {
     user:{
        username:'',
        name: '',
        userPhoto:'',
        token:''
    },
    edit:'false',
    remeberSel:[]
   

}

const mutations = {
    REMEBER_USER (state,userInfo) {
        state.user.username = userInfo.username
        state.user.name = userInfo.name
        state.user.userPhoto = userInfo.userPhoto
        state.user.token = userInfo.token
        state.user.confirmMemberpwd = userInfo.confirmMemberpwd
        setStore('userInfo',JSON.stringify(userInfo))
        
    },
    OPEN_EDIT (state) {
        setStore('edit','true')
        state.edit = 'true'
    },
    CLOSE_EDIT (state) {
        removeStore('edit')
        state.edit = 'false'
    },
    REMEBER_SEL (state,lists) {
        state.remeberSel = lists
    }
   
}

const store = new Vuex.Store({
    state,
    mutations,
    actions
})
export default store