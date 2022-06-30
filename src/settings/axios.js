import axios from 'axios'
import store from '@/store'
import router from '@/router'

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

axios.defaults.headers['content-type'] = 'application/json';
axios.defaults.withCredentials = true;
switch (NODE_ENV) {
  case 'development':
    axios.defaults.baseURL =  'http://195.133.201.227:8086/api/v1/';
    break;
  case 'production':
    axios.defaults.baseURL =  'http://195.133.201.227:8086/api/v1/';
    break;
  default:
    axios.defaults.baseURL =  'https://virtserver.swaggerhub.com/andrewleykin/social/1.0.4/api/v1/';
}

const token = localStorage.getItem('user-token')
if (token) axios.defaults.headers.common['Authorization'] = token
axios.interceptors.response.use(null, error => {
  if(error.response.status === 401) {
    store.dispatch('auth/api/logout')
  }
  // добавить проверку на законченный токен и сделать выход из приложения
  // store.dispatch('auth/api/logout')
  store.dispatch('global/alert/setAlert', {
    status: 'error',
    text: error.response.data.error_description
  })
  console.error(error)
  return Promise.reject(error)
});
