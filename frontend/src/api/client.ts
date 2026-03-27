import axios from 'axios'


const instance = axios.create({
    baseURL: 'http://localhost:5000',

});


// instance.interceptors.response.use((success),(error)) 
instance.interceptors.response.use(                         // api'den donen response'u yakalar her sey yolundaysa devam eder degilse (401) donduyse token silip login sayfasina yonlendirir !!
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token")
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)


export default instance