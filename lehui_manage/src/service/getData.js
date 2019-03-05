import axios from 'axios'
const baseUrl = process.env.BASE_URL
export const testlink = () => {
    return axios({
        method:'post',
        url:baseUrl+'/brand/findAll',
    })
}
//  用户处理
export const getUser = (para) => {
    return axios({
        method:'post',
        params:para,
        url:baseUrl+'/member/find',
    })
}
export const editUser = (para) => {
    return axios({
        method:'post',
        params:para,
        url:baseUrl+'/member/update'
    })
}
export const addUser = (para) => {
    return axios({
        method:'post',
        params:para,
        url:baseUrl+'/member/save'
    })
}
export const removeUser = (para) => {
    return axios({
        method:'post',
        params:para,
        url:baseUrl+'/member/delete'
    })
}
// 用户处理完毕

// 首页banner处理
export const brandList = () => {
    return axios({
        method:'post',
        url:baseUrl+'/brand/findAll'
    })
}
export const removeBrand = (para) => {
    return axios({
        method:'post',
        params:para,
        url:baseUrl+'/brand/delete'
    })
}
export const editBrand = (para) => {
    return axios({
        method:'post',
        params:para,
        url:baseUrl+'/brand/update'
    })
}
export const addBrand = (para) => {
    return axios({
        method:'post',
        params:para,
        url:baseUrl+'/brand/save'
    })
}
// 首页列表新闻处理
export const indexList = () => {
    return axios({
        method:'post',
        url:baseUrl+'/floor/find'
    })
}
export const removeIndex = (para) => {
    return axios({
        method:'post',
        params:para,
        url:baseUrl+'/floor/delete'
    })
}
export const editIndex = (para) => {
    return axios({
        method:'post',
        data:para,
         headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        transformRequest: [function (data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0,ret.length-1)
            return ret
        }],
        url:baseUrl+'/floor/update'
    })
}
export const addIndex  = (para) => {
    return axios({
        method:'post',
        data:para,
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        transformRequest: [function (data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0,ret.length-1)
            return ret
        }],
        url:baseUrl+'/floor/save'
    })
}
// 新闻分类
export const classList = (pageData) => {
    return axios({
        method:'post',
        params:pageData,
        url:baseUrl+'/newsClass/findAll'
    })
}
export const removeClass = (para) => {
    return axios({
        method:'post',
        params:para,
        url:baseUrl+'/newsClass/delete'
    })
}
export const editClass = (para) => {
    return axios({
        method:'post',
        params:para,
        url:baseUrl+'/newsClass/update'
    })
}
export const addClass = (para) => {
    return axios({
        method:'post',
        params:para,
        url:baseUrl+'/newsClass/save'
    })
}

// 新闻详情

export const newsList = (pageData) => {
    return axios({
        method:'post',
        params:pageData,
        url:baseUrl+'/news/find'
    })
}
// export const newsList = (pageData) => {
//     return axios({
//         method:'post',
//         params:pageData,
//         url:'/news/findAll'
//     })
// }
export const removeNews = (para) => {
    return axios({
        method:'post',
        params:para,
        url:baseUrl+'/news/delete'
    })
}
export const editNews = (para) => {

    return axios({
        method:'post',
        dataType:'json',
        data:para,
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        transformRequest: [function (data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
               

        }
        ret = ret.substring(0,ret.length-1)
        
        return ret
        }],
        url:baseUrl+'/news/update'
    })
}
export const addNews = (para) => {
   
    return axios({
        method:'post',
        dataType:'json',
        data:para,
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        transformRequest: [function (data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0,ret.length-1)
            return ret
        }],
        url:baseUrl+'/news/save'
    })
}
