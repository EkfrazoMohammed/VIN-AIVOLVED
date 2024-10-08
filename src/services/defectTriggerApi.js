import store from "../redux/store"
import { getTriggerData } from "../redux/slices/defecTriggerSlice"


export const getTriggerDefects = async (plantId, apiCallInterceptor) => {
    try {
        const data = await apiCallInterceptor.get(`toggle/${plantId}/`)
        const results = data?.data?.results[0]?.current_status
        // return results
        store.dispatch(getTriggerData(results))
    } catch (error) {
        console.log(error)
    }
}


export const postTriggerData = async (apiCallInterceptor, postData) => {
    try {
        await apiCallInterceptor.post('toggle/', postData);
    } catch (error) {
        console.log(error)
    }
}