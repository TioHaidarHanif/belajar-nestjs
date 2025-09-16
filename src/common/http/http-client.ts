import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import RequestContext from '../request-context/request-context';

const client = axios.create();

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers = config.headers ?? {} as any;
  const requestId = RequestContext.getRequestId();
  if (requestId) {
    (config.headers as any)['X-Request-Id'] = requestId;
  }
  return config;
});

export default client;
