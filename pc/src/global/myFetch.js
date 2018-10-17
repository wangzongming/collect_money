import myAxios from './myAxios'
const myFetch = (apiName, params={})=>{
    return new Promise((resolve)=>{
        myAxios({apiName, params}).then((data)=>{
            resolve(data)
        })
    })
}
export default myFetch;