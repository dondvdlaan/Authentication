import axios, { AxiosResponse, Method } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Constants and variables
export const baseUrl = "http://localhost:2500";

// local utility type
type SetState<T> = Dispatch<SetStateAction<T>>;

export function tokenApi<T>(method: Method, path: string,  data = {}): any{
return(
    axios({
      method,
      url: `${baseUrl}${path}`,
      data
    })
 
)}

