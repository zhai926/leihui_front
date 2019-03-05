
import axios from 'axios'
const baseUrl = process.env.BASE_URL

export default {
     
    checkUser({ commit }, userInfo) {
       
        return axios({
            method:'post',
            params:userInfo,
            url:baseUrl+'/member/login'
                 
        }).then((res) => {
          console.log(res.data)
          let { state,token,msg } = res.data
           if(state == 'success'){
                console.log(token) 
                userInfo.token = token 
                userInfo.password = null       
                commit('REMEBER_USER', userInfo)
                return true
            }else if(state == 'error' && msg =='您已登录，请勿重复登录。'){
                 return msg
            }else{
                return false
            }      
        }).catch((err) => {
            alert('服务器出错，请稍后访问')
            return false
        })
    },
    openEdit ({ commit }) {
        commit('OPEN_EDIT')
    },
    closeEdit ({ commit }) {
        commit('CLOSE_EDIT')
    },
    addIndexNew ( {commit },list) {
        let lists =[]
        let json = {}
        list.forEach(function(element) {
            if(!json[element]){
                lists.push(element)
                json[element]=1
            }
        }, this);
        commit('REMEBER_SEL',lists)
        // console.log(lists)
    }


    
   
}