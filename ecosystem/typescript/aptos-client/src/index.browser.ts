// import axiosOriginal, { AxiosRequestConfig, AxiosError } from "axios";
// import { AptosClientRequest, AptosClientResponse } from "./types";
// import FetchAdapter from "@vespaiach/axios-fetch-adapter";

// export default async function aptosClient<Res>(options: AptosClientRequest): Promise<AptosClientResponse<Res>> {
//   const { params, method, url, headers, body, overrides } = options;
//   const requestConfig: AxiosRequestConfig = {
//     headers,
//     method,
//     url,
//     params,
//     data: body,
//     adapter: FetchAdapter,
//     withCredentials: overrides?.WITH_CREDENTIALS ?? true,
//   };
//   const axios = axiosOriginal.create({adapter: FetchAdapter});

//   try {
//     const response = await axios(requestConfig);
//     return {
//       status: response.status,
//       statusText: response.statusText!,
//       data: response.data,
//       headers: response.headers,
//       config: response.config,
//     };
//   } catch (error) {
//     const axiosError = error as AxiosError<Res>;
//     if (axiosError.response) {
//       return axiosError.response;
//     }
//     throw error;
//   }
// }


// Importing types
import { AptosClientRequest, AptosClientResponse } from "./types";

export default async function aptosClient<Res>(options: AptosClientRequest): Promise<AptosClientResponse<Res>> {
    const { method, url, headers, body, params, overrides } = options;

    // Constructing the query string for GET requests
    const queryString = params ? 
        '?' + new URLSearchParams(params as Record<string, string>).toString() 
        : '';

    // Constructing the full URL
    const fullUrl = url + queryString;

    // Setting up the fetch options
    const fetchOptions: RequestInit = {
        method,
        headers,
        body: method !== 'GET' ? JSON.stringify(body) : null,
        credentials: overrides?.WITH_CREDENTIALS ? 'include' : 'omit',
    };

    try {
        const response = await fetch(fullUrl, fetchOptions);

        const responseData = await response.json();
        return {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
            headers: response.headers, // Note: This is a Headers object, not a plain JS object
            config: fetchOptions, // Config is slightly different in Fetch
        };
    } catch (error) {
        // Fetch API doesn't reject HTTP error statuses (like 404, 500, etc.)
        // You would need to throw an error explicitly based on response status
        // if needed. Here we're just rethrowing the original error.
        throw error;
    }
}
