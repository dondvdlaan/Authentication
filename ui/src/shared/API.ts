import axios, { AxiosResponse, Method } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Constants and variables
export const baseUrl = "http://localhost:2500";

// local utility type
type SetState<T> = Dispatch<SetStateAction<T>>;

export function useTokenApi(method: Method, path: string, payload: any = {}): any{

  const [data, setData] = useState()

  useEffect(()=>{

    tokenApi(method, path, payload)
    // .then((res: any)=>setData(res.data.verified))
    .then((res: any)=>console.log("data:", res.data))


  }, [path]);

  return data;
}

export function tokenApi<T>(method: Method, path: string,  data = {}): any{

  console.log("tokenAPI > method", method,"url",baseUrl,"path", path, "data", data);
  return(
    axios({
      method,
      url: `${baseUrl}${path}`,
      data
    })
 
)}

