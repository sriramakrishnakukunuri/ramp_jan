import { get } from "jquery";
import { environment } from "src/environments/environment";

export const API_BASE_URL = environment.apiUrl;
export const APIS = {
    programCreation:{
        addprogram: API_BASE_URL + '/program/create',
        addSessions: API_BASE_URL + '/program/session/create',
        editSession: API_BASE_URL + '/program/session/update',
        addLocation: API_BASE_URL + '/location/save',
        getLocation: API_BASE_URL + '/agency/locations/',
        getProgramType: API_BASE_URL + '/program/types/agency/id/',
        getLocationByAgency: API_BASE_URL + '/agency/locationdetails/',
        getResource: API_BASE_URL + '/agency/resources/',
        addResource: API_BASE_URL + '/resource/save',
        getProgramsList: API_BASE_URL + '/programs',
        getProgramsListByAgency: API_BASE_URL + '/agency/programs/dropdown/',
        getProgramsListByAgencyDetails: API_BASE_URL + '/agency/programs/',
        getSingleProgramsList: API_BASE_URL + '/program/',
        getActivityList: API_BASE_URL + '/activities',
        getActivityListbyId: API_BASE_URL + '/activity/agency/',
        getSubActivityListByActivity: API_BASE_URL + '/activityById',
        getESDPProgram: API_BASE_URL + '/getESDPTraining',
        addESDPProgram: API_BASE_URL + '/SaveESDPTraining',
        updateProgram: API_BASE_URL + '/updateProgram',
        deleteSession: API_BASE_URL + '/program/session/delete',        
        // get: API_BASE_URL + '/program/get',
        // update: API_BASE_URL + '/program/update',
        // delete: API_BASE_URL + '/program/delete',
    },
    participantdata:{
        add: API_BASE_URL + '/participant/save',
        update: API_BASE_URL + '/updateParticipant',
        getDataByProgramId: API_BASE_URL + '/program/participants/dropdown/',
        getDataByProgramBYDeatisl: API_BASE_URL + '/program/participants/',
        saveOrgnization: API_BASE_URL + '/organization/save',
        getOrgnizationData: API_BASE_URL + '/organization/list',
        getParticipantList: API_BASE_URL + '/participants',
        getParticipantListByAgency: API_BASE_URL + '/agency/participants/',
        getParticipantDetailsById: API_BASE_URL + '/getParticipantById/',
    },
    counsellerData:{
        add: API_BASE_URL + '/saveCounsellor',
        getData: API_BASE_URL + '/getAllCounsellors',
    },
    userRegistration:{
        add: API_BASE_URL + '/login/user/create',
        addAgent: API_BASE_URL + '/login/user/create',
        editProfile: API_BASE_URL + '/login/user/update',
        getUserById: API_BASE_URL + '/login/user',        
    },
    masterList: {
        changePassword:API_BASE_URL+'/login/change-password',
        agencyList: API_BASE_URL + '/agencies',
        locationList: API_BASE_URL + '/locations',
        getUserList: API_BASE_URL + '/login/allusrs',
        getresources: API_BASE_URL + '/resources',
        getDistricts: API_BASE_URL + '/getAllDistricts',
        getSectors: API_BASE_URL + '/getallsectors',
        getMandal: API_BASE_URL + '/getAllmandalsOfDistrictsById/',
    },
    captureOutcome:{
        getParticipantData: API_BASE_URL + '/getParticipantsByMobileNo/',
        getOutcomelistData: API_BASE_URL + '/program/outcome/tables',
        getDynamicFormDataBasedOnOutCome: API_BASE_URL + '/program/outcome/details/',
        saveOutComes:API_BASE_URL + '/program/outcome/save/',
    },
    callCenter:{
        getParticipantVerificationById:API_BASE_URL + `/program/participant-verification`,
        getQuestionById:API_BASE_URL + `/get/questions/subactivity/id/`,
        getDataByProgramVerificationId: API_BASE_URL + '/program/participant-verification/',
        add:API_BASE_URL + `/save/callcenter/verification/data`,
        getALLQuestion:API_BASE_URL + `/all/questions`,
        getVeriaficationStatus:API_BASE_URL + `/all/verification/status`,
        saveVeriaficationStatus:API_BASE_URL + `/save/callcenter/verification/data`
    },
    Attendance:{
        getDeatails:API_BASE_URL +`/program/attendence/`,
        saveAttendance:API_BASE_URL +`/program/attendence`,
    },
    rawMaterial:{
        getDeatails:API_BASE_URL +`/program/rawmaterial/`,
        saveAttendance:API_BASE_URL +`/program/rawmaterial`,
    },
    programExpenditure:{
        getItemByExpenses:API_BASE_URL +`/bulk/transactions/items?expenseId`,
        getBulkDataByExpensesItem:API_BASE_URL +`/bulk/transactions/lookup`,
        getHeadOfExpenditure:API_BASE_URL +`/expenses`,
        saveExpenditure:API_BASE_URL +`/program/expenditure/save`,
        savebulkExpenditure:API_BASE_URL +`/bulk/expenditure/save`,
        savebulkByItemExpenditure:API_BASE_URL +`/bulk/transactions/save`,
        getExpenditure:API_BASE_URL +`/program/expenditure`,
        getBulkExpenditure:API_BASE_URL +`/bulk/expenditure`,
        getBulkExpenditureByProgramId:API_BASE_URL +`/bulk/transactions`,
    },
    programSummary:{
        getProramData:API_BASE_URL +`/program/summary/`,
    },
    programExecutions:{
        saveMediaCoverage:API_BASE_URL +`/program/execution/media-coverage`,
        saveProgramExecution:API_BASE_URL +`/program/execution/images`,
    }
}