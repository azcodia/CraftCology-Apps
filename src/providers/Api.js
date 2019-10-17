import axios from 'axios';
import { Global } from '../helpers/Global';
import { showMessage, hideMessage } from "react-native-flash-message";

const REQUEST_TIMEOUT = 50000; // request timeout

function getBaseApiUrl() {
  return Global.getBaseUrl() + 'api';
}


export function getProducts(
  search='', 
  category='', 
  tag='',
  page=1,
  perpage=60) {
    
    return axios({
      method: 'get',
      url: getBaseApiUrl() + '/v1/product?search=' + search + '&category=' + category + '&tag=' + tag + '&page=' + page + '&perpage=' + perpage,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: REQUEST_TIMEOUT
    })

}

export async function getPublic(uri, headers = {'Content-Type':'application/json'}) {
  var method = 'GET';

  try {
    let response = await axios({
      method: method,
      url: getBaseApiUrl() + '/v1/' + uri,
      headers: headers,
      timeout: REQUEST_TIMEOUT
    });

    return response
  } catch (error) {
    console.log(error);
    if(error.response) {
      console.log(`ERROR API response ${uri}`, error.response)
      showMessage({
        message: `Error get ${uri}, ${error.response.data.message} (code ${error.response.data.status})`,
        type: "danger",
        icon: { icon: "danger", position: "left" },
      })
    } else if(error.request) {
      console.log(`ERROR API request ${uri}`, error.request)
      showMessage({
        message: `${error.message}`,
        type: "danger",
        icon: { icon: "danger", position: "left" },
      })
    } else {
      console.log(`ERROR API ${uri}`, error)
    }
    console.log(`ERROR MESSAGE ${uri}`, error.message)
  }
}

export async function postPublic(uri, data=null, headers = {'Content-Type':'application/json'}) {
  var method = 'POST';
 
  try {
    let response = await axios({
      method: method,
      url: getBaseApiUrl() + '/v1/' + uri,
      headers: headers,
      data: data,
      timeout: REQUEST_TIMEOUT
    });
    return response
  } catch(error) {
    if(error.response) {
      console.log(`ERROR API response ${uri}`, error.response)
      showMessage({
        message: `${error.response.data.message}`,
        type: "danger",
        icon: { icon: "danger", position: "left" },
      })
      return error.response
    } else if(error.request) {
      console.log(`ERROR API request ${uri}`, error.request)
      showMessage({
        message: `${error.message}`,
        type: "danger",
        icon: { icon: "danger", position: "left" },
      })
    } else {
      console.log(`ERROR API ${uri}`, error)
    }
    console.log(`ERROR MESSAGE ${uri}`, error)
  }
};

export async function patchPublic(uri, data=null, headers = {'Content-Type':'application/json'}) {
  var method = 'PATCH';
 
  try {
    let response = await axios({
      method: method,
      url: getBaseApiUrl() + '/v1/' + uri,
      headers: headers,
      data: data,
      timeout: REQUEST_TIMEOUT
    });
    return response
  } catch(error) {
    if(error.response) {
      console.log(`ERROR API response ${uri}`, error.response)
      showMessage({
        message: `${error.response.data.message}`,
        type: "danger",
        icon: { icon: "danger", position: "left" },
      })
      return error.response
    } else if(error.request) {
      console.log(`ERROR API request ${uri}`, error.request)
      showMessage({
        message: `${error.message}`,
        type: "danger",
        icon: { icon: "danger", position: "left" },
      })
    } else {
      console.log(`ERROR API ${uri}`, error)
    }
    console.log(`ERROR MESSAGE ${uri}`, error)
  }
};

export async function postFilePublic(uri, data=null, headers = {'Content-Type': 'multipart/form-data'}) {
  var method = 'POST';
 
  try {
    let response = await axios({
      method: method,
      url: getBaseApiUrl() + '/v1/' + uri,
      headers: headers,
      data: data,
      timeout: REQUEST_TIMEOUT,
      onUploadProgress: function(progressEvent) {
        var percentCompleted = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
        console.log(percentCompleted);
      }
    });
    return response
  } catch(error) {
    if(error.response) {
      console.log(`ERROR API response ${uri}`, error.response)
      showMessage({
        message: `${error.response.data.message}`,
        type: "danger",
        icon: { icon: "danger", position: "left" },
      })
      return error.response
    } else if(error.request) {
      console.log(`ERROR API request ${uri}`, error.request)
      showMessage({
        message: `${error.message}`,
        type: "danger",
        icon: { icon: "danger", position: "left" },
      })
    } else {
      console.log(`ERROR API ${uri}`, error)
    }
    console.log(`ERROR MESSAGE ${uri}`, error)
  }
};

export async function requestPublic(method, uri, data = null, headers = { 'Content-Type': 'application/json' }) {

  console.log("Cek URL Keseluruhan")
  console.log(method)
  console.log(uri)
  console.log(data)
  console.log(headers)
  console.log("Cek URL Keseluruhan TUTUP")

  try {
    let response = await axios({
      method: method,
      url: getBaseApiUrl() + '/v1/' + uri,
      headers: headers,
      data: data,
      timeout: REQUEST_TIMEOUT
    });
    return response
  } catch (error) {
    if (error.response) {
      console.log(`ERROR API response ${uri}`, error.response)
      showMessage({
        message: `${error.response.data.message}`,
        type: "danger",
        icon: { icon: "danger", position: "left" },
      })
      return error.response
    } else if (error.request) {
      console.log(`ERROR API request ${uri}`, error.request)
      showMessage({
        message: `${error.message}`,
        type: "danger",
        icon: { icon: "danger", position: "left" },
      })
    } else {
      console.log(`ERROR API ${uri}`, error)
    }
    console.log(`ERROR MESSAGE ${uri}`, error)
  }
};