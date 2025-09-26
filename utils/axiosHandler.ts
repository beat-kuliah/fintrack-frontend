import axios, { AxiosError, AxiosResponse } from "axios";
import { userTokenKey } from "./contants";
import { errorHandler } from "./errorHandler";

interface AxiosHandlerType {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  url: string;
  data?: any;
  handleError?: boolean;
  isAuthorized?: boolean;
  onUnauthorized?: () => void;
}

interface ResponseType<T> {
  data?: T;
  error: AxiosError | null;
}

const useAxiosHandler = (onUnauthorized?: () => void) => {
  const axiosHandler = async <T>({
    method,
    url,
    data,
    isAuthorized,
    handleError = true,
    onUnauthorized: requestOnUnauthorized,
  }: AxiosHandlerType): Promise<ResponseType<T>> => {
    const config = {
      url,
      method,
      data,
      headers: {},
    };

    if (isAuthorized) {
      const userToken = localStorage.getItem(userTokenKey);
      config.headers = {
        Authorization: `Bearer ${userToken}`,
      };
    }

    let error = null;

    const response = (await axios(config).catch((e: AxiosError) => {
      if (e.response?.status === 401) {
        const logoutCallback = requestOnUnauthorized || onUnauthorized;
        if (logoutCallback) {
          logoutCallback();
        }
      }
      if (handleError) {
        errorHandler(e);
      } else {
        error = e;
      }
    })) as AxiosResponse<T>;

    return {
      data: response?.data,
      error,
    };
  };

  return { axiosHandler };
};
export default useAxiosHandler;
