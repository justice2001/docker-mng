import axios, { Axios, AxiosRequestConfig } from 'axios';
import { message } from 'antd';

class ApiRequest {
  private readonly _axios: Axios;

  constructor() {
    this._axios = axios.create({
      baseURL: '/api',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    });
  }

  async request(url: string, options: AxiosRequestConfig): Promise<any> {
    try {
      return await this._axios.request({
        url: url,
        ...options,
      });
    } catch (e: any) {
      if (e.response.data) {
        message.error('请求接口失败: ' + e.response.data.message);
      } else {
        message.error('请求接口失败: ' + e.message);
      }
      throw e;
    }
  }

  async get(url: string, options: AxiosRequestConfig = {}): Promise<any> {
    return await this.request(url, {
      method: 'GET',
      ...options,
    });
  }

  async post(url: string, data: any, options: AxiosRequestConfig = {}): Promise<any> {
    return await this.request(url, {
      method: 'POST',
      data,
      ...options,
    });
  }

  async put(url: string, options: AxiosRequestConfig = {}): Promise<any> {
    return await this.request(url, {
      method: 'PUT',
      ...options,
    });
  }

  async delete(url: string, options: AxiosRequestConfig = {}): Promise<any> {
    return await this.request(url, {
      method: 'DELETE',
      ...options,
    });
  }
}

export default new ApiRequest();