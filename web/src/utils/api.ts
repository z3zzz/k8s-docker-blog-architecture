import axios from 'axios';
import {
  commentApiOrigin,
  environment,
  postApiOrigin,
  queryApiOrigin,
} from './constants';

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
  if (environment === 'production') {
    return endpoint;
  }

  if (endpoint.startsWith('/api/comment')) {
    return commentApiOrigin + endpoint.replace('/api', '');
  }

  if (endpoint.startsWith('/api/post')) {
    return postApiOrigin + endpoint.replace('/api', '');
  }

  if (endpoint.startsWith('/api/query')) {
    return queryApiOrigin + endpoint.replace('/api//query', '');
  }

  return endpoint;
}

const Api = { get, post, patch, delete: del };

export default Api;
