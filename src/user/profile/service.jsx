import axios from 'axios';
import {API_BASE_URL} from '../../constants/index'
class Service {

  constructor() {
   // console.log("Service is constructed");
  }

  getRestClient() {
    if (!this.serviceInstance) {
      this.serviceInstance = axios.create({
        baseURL: API_BASE_URL+'/df/api',
        headers: {
            'Content-Type': 'application/json'
          },
      });
    }
    return this.serviceInstance;
  }
}

export default (new Service());