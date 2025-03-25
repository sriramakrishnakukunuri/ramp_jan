import { environment } from "src/environments/environment";

export const API_BASE_URL = environment.apiUrl;
export const APIS = {
    programCreation:{
        addprogram: API_BASE_URL + '/program/create',
        addSessions: API_BASE_URL + '/program/session/create',
        addLocation: API_BASE_URL + '/location/save',
        getLocation: API_BASE_URL + '/agency/locations/',
        getLocationByAgency: API_BASE_URL + '/agency/locationdetails/',
        getResource: API_BASE_URL + '/agency/resources/',
        addResource: API_BASE_URL + '/resource/save',
        getProgramsList: API_BASE_URL + '/programs',
        getProgramsListByAgency: API_BASE_URL + '/agency/programs/',
        getSingleProgramsList: API_BASE_URL + '/program/',
        getActivityList: API_BASE_URL + '/activities',
        getSubActivityListByActivity: API_BASE_URL + '/activityById',
        getESDPProgram: API_BASE_URL + '/getESDPTraining',
        addESDPProgram: API_BASE_URL + '/SaveESDPTraining',        
        // get: API_BASE_URL + '/program/get',
        // update: API_BASE_URL + '/program/update',
        // delete: API_BASE_URL + '/program/delete',
    },
    participantdata:{
        add: API_BASE_URL + '/participant/save',
        getDataByProgramId: API_BASE_URL + '/program/participants/',
        saveOrgnization: API_BASE_URL + '/organization/save',
        getOrgnizationData: API_BASE_URL + '/organization/list',
        getParticipantList: API_BASE_URL + '/participants',
        getParticipantListByAgency: API_BASE_URL + '/agency/participants/',
    },
    counsellerData:{
        add: API_BASE_URL + '/saveCounsellor',
        getData: API_BASE_URL + '/getAllCounsellors',
    },
    userRegistration:{
        add: API_BASE_URL + '/login/user/create',
        addAgent: API_BASE_URL + '/login/user/create',        
    },
    masterList: {
        agencyList: API_BASE_URL + '/agencies',
        locationList: API_BASE_URL + '/locations',
        getUserList: API_BASE_URL + '/login/allusrs',
        getresources: API_BASE_URL + '/resources',
        getDistricts: API_BASE_URL + '/getAllDistricts',
        getMandal: API_BASE_URL + '/getAllmandalsOfDistrictsById/',
    },
    captureOutcome:{
        getParticipantData: API_BASE_URL + '/getParticipantsByMobileNo/',
        getOutcomelistData: API_BASE_URL + '/program/outcome/tables',
        getDynamicFormDataBasedOnOutCome: API_BASE_URL + '/program/outcome/details/',
        saveOutComes:API_BASE_URL + '/program/outcome/save/',
    }
}