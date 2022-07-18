import axios from 'axios';
import { commentApiOrigin, postApiOrigin, queryApiOrigin } from './constants';

async function get(endpoint: string) {
  return axios.get(createUrl(endpoint));
}

async function post(endpoint: string, data: any) {
  const bodyData = JSON.stringify(data);

  return axios.post(createUrl(endpoint), bodyData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function patch(endpoint: string, data: any) {
  const bodyData = JSON.stringify(data);

  return axios.put(createUrl(endpoint), bodyData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function del(endpoint: string) {
  return axios.delete(createUrl(endpoint));
}

function createUrl(endpoint: string): string {
  if (endpoint.startsWith('/comment')) {
    return commentApiOrigin + endpoint;
  }

  if (endpoint.startsWith('/post')) {
    return postApiOrigin + endpoint;
  }

  if (endpoint.startsWith('/query')) {
    return queryApiOrigin + endpoint.replace('/query', '');
  }

  return endpoint;
}

const Api = { get, post, patch, delete: del };

export default Api;
