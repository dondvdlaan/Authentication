import axios, { AxiosResponse, Method } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Constants and variables
export const baseUrl = "https://localhost:2500";

// local utility type
type SetState<T> = Dispatch<SetStateAction<T>>;

/*
 * Abstracts away both needs for api calls,
 * on rendering and on events / conditions
 *
 * useApi, custom hook
 * Api, normal function
 *
 */

/*
 * Useful for http data as a dependency in rendering
 *
 * @param method [Method], http method
 * @param path [string], relative path to baseUrl
 * @return, Response Data
 */
export function useApi<T>(path: string): [T | undefined, SetState<T | undefined>] {
  
  // Constant and variables
  const [data, setData] = useState<T>();

  useEffect(() => {
    
    Api("GET", path, setData);
  
  }, [path]);

  return [data, setData];
}

/*
 * Useful for calls on events or in conditions
 *
 * @param method [Method], http method
 * @param path [string], relative path to baseUrl
 * @param data [function], callback, gets `response.data` as an argument
 * @param data [object], body data
 */
export function Api<T>(
  method: Method,
  path: string,
  data = {}
): void {

  axios({
    method: method,
    url: `${baseUrl}/${path}`,
    // headers: { Authorization: "Bearer 1234567890" },
    data,
  })
  .then((response: AxiosResponse<T>) => console.log("axios res:", response.data));
  // .then((response: AxiosResponse<T>) => response.data);
}

