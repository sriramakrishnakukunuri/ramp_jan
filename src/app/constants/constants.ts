import { environment } from "src/environments/environment";

export const API_BASE_URL = environment.apiUrl;
export const APIS = {
    programCreation:{
        add: API_BASE_URL + '/workflow/api//program/create',
        addLocation: API_BASE_URL + '/location/save',
        // get: API_BASE_URL + '/program/get',
        // update: API_BASE_URL + '/program/update',
        // delete: API_BASE_URL + '/program/delete',
    },
    participantdata:{
        add: API_BASE_URL + '/participant/save',
        getDataByProgramId: API_BASE_URL + '/program/participants/',
        saveOrgnization: API_BASE_URL + '/organization/save',
    },
    userRegistration:{
        add: API_BASE_URL + '/login/user/create',
    }
}