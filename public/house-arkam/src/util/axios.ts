import axios, {AxiosInstance, AxiosResponse, AxiosError} from 'axios';
import environment from '../config/environment';

const httpClient: AxiosInstance = axios.create({
  baseURL: environment.baseUrl,
  headers: {
    common: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
});

/**
 * Axios request interceptors on respond.
 */
httpClient.interceptors.response.use(
  (res: AxiosResponse<any>) => res.data,
  (error: AxiosError) => error
);

export default httpClient;
