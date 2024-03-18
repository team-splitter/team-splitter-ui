import axiosClient, { AxiosError, AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';

interface PathParams {
  [key: string]: string | number;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    pathParams?: PathParams;
  }
}

const axios = axiosClient.create();

interface HandleSuccessProps {
  data: unknown;
}

const defaultConfig = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const generateConfig = (config?: AxiosRequestConfig) => {
  return merge(config, defaultConfig);
};

const handleSuccess = ({ data }: HandleSuccessProps) => {
  const responseData = data as { data: unknown };
  return responseData.data ? responseData.data : responseData;
};

/**
 * Http error type
 */
export interface HttpError {
  code: number;
  message: string;
  timestamp?: string;
}

const handleErrors = (error: AxiosError) => {
  console.log(`HTTP error: ${JSON.stringify(error)}`);

  const apiError: HttpError = {
    code:
      error.response && error.response.status ? error.response.status : 1000,
    message: error.message,
  };
  throw apiError;
};

/**
 * Async method to send a GET http request to a remote server
 * @param url - remote server url
 * @param config - request config
 */
export const get = async (url: string, config?: AxiosRequestConfig) => {
  return axios
    .get(url, generateConfig(config))
    .then(handleSuccess)
    .catch(handleErrors);
};

/**
 * Async method to send a POST http request to a remote server
 * @param url - remote server url
 * @param body - request body
 * @param config - request config
 */
export const post = async (
  url: string,
  body: unknown,
  config?: AxiosRequestConfig
) => {
  return axios
    .post(url, body, generateConfig(config))
    .then(handleSuccess)
    .catch(handleErrors);
};

/**
 * Async method to send a PUT http request to a remote server
 * @param url - remote server url
 * @param body - request body
 * @param config - request config
 */
export const put = async (
  url: string,
  body: unknown,
  config?: AxiosRequestConfig
) => {
  return axios
    .put(url, body, generateConfig(config))
    .then(handleSuccess)
    .catch(handleErrors);
};

/**
 * Async method to send a PATCH http request to a remote server
 * @param url - remote server url
 * @param body - request body
 * @param config - request config
 */
export const patch = async (
  url: string,
  body: unknown,
  config?: AxiosRequestConfig
) => {
  return axios
    .patch(url, body, generateConfig(config))
    .then(handleSuccess)
    .catch(handleErrors);
};

/**
 * Async method to send a DELETE http request to a remote server
 * @param url - remote server url
 * @param config - request config
 */
export const del = async (url: string, config?: AxiosRequestConfig) => {
  return axios
    .delete(url, generateConfig(config))
    .then(handleSuccess)
    .catch(handleErrors);
};