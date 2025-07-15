// models/pre-event-checklist.model.ts
export interface PreEventChecklist {
    item: string;
    status: boolean;
    remarks: string;
  }
  
  // models/program-delivery-detail.model.ts
  export interface ProgramDeliveryDetail {
    programDeliveryDetailsId?: number;
    speakerName: string;
    topicDelivered: string;
    timeTaken: number;
    audioVisualUsed: boolean;
    relevance: string;
    speakerEffectiveness: number;
  }
  
  // models/logistics-evaluation.model.ts
  export interface LogisticsEvaluation {
    parameter: string;
    rating: number;
    remarks: string;
  }
  
  // models/program-feedback.model.ts
//   import { PreEventChecklist } from './pre-event-checklist.model';
//   import { ProgramDeliveryDetail } from './program-delivery-detail.model';
//   import { LogisticsEvaluation } from './logistics-evaluation.model';
  
  export interface ProgramFeedback {
    state: string;
    district: string;
    dateOfMonitoring: string;
    agencyName: string;
    programType: string;
    programName: string;
    venueName: string;
    hostingAgencyName: string;
    spocName: string;
    spocContact: number;
    inTime: string;
    outTime: string;
  
    maleParticipants: number;
    femaleParticipants: number;
    transGenderParticipants: number;
    totalParticipants: number;
    noOfSHG: number;
    noOfMSME: number;
    noOfStartup: number;
    noOfDIC: number;
    noOfIAs: number;
    noOfOthers: number;
    noOfSC: number;
    noOfST: number;
    noOfOC: number;
    noOfBC: number;
    noOfMinority: number;
  
    timingPunctuality: string;
    sessionContinuity: string;
    participantInterestLevel: string;
    overallEnergyEngagement: string;
    unforeseenIssues: string;
  
    participantsFeedbackCollected: boolean;
    resourceFeedbackCollected: boolean;
    prePostTestsConducted: boolean;
    learningHighlights: string;
  
    attendanceSheet: boolean;
    registrationForms: boolean;
    participantFeedBack: boolean;
    speakerFeedBack: boolean;
    photographsAttached: boolean;
    summaryReportPrepared: boolean;
  
    observedPractices: string;
    challengesFaced: string;
    issuesAndCorrections: string;
  
    overallProgramOrganization: number;
    qualityOfSessions: number;
    participantsSatisfaction: number;
    impactPotential: number;
  
    additionalRemarks: string;
  
    preEventChecklists: PreEventChecklist[];
    programDeliveryDetails: ProgramDeliveryDetail[];
    logisticsEvaluations: LogisticsEvaluation[];
  }