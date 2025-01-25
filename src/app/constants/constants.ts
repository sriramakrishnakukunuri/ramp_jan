import { environment } from "src/environments/environment";

export const API_BASE_URL = environment.apiUrl;
export const APIS = {
    programCreation:{
        add: API_BASE_URL + '/workflow/api//program/create',
        // get: API_BASE_URL + '/program/get',
        // update: API_BASE_URL + '/program/update',
        // delete: API_BASE_URL + '/program/delete',
    }
}