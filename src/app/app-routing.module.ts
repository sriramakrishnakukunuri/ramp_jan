import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AdminComponent } from './admin';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { Role } from './_models';
import { ProfileComponent } from './profile/profile.component';
import { PasswordSettingsComponent } from './password-settings/password-settings.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { ProgramCreationComponent } from './PIA/program-creation/program-creation.component';
import { VeiwProgramCreationComponent } from './PIA/veiw-program-creation/veiw-program-creation.component';
import { AddParticipantDataComponent } from './PIA/add-participant-data/add-participant-data.component';
import { UpdateProgramExecutionComponent } from './PIA/update-program-execution/update-program-execution.component';
import { ViewParticipateCreationComponent } from './PIA/view-praticipate-creation/view-praticipate-creation.component';
import { OrganizationsListComponent } from './organizations-list/organizations-list.component';
import { CaptureOutcomeComponent } from './PIA/capture-outcome/capture-outcome.component';
import { CaptureOutcomeDynamicComponent } from './PIA/capture-outcome-dynamic/capture-outcome-dynamic.component';
import { ESDPTrainingComponent } from './PIA/esdp-training/esdp-training.component';
import { ShgTrainingStatusComponent } from './PIA/shg-training-status/shg-training-status.component';
import { MsmeCouncellorRegisterationComponent } from './PIA/msme-councellor-registeration/msme-councellor-registeration.component';
import { ViewMsmeCouncellorDataComponent } from './PIA/view-msme-councellor-data/view-msme-councellor-data.component';
import { GlobalDashboardComponent } from './Dashboard/global-dashboard/global-dashboard.component';
import { ViewParticipantComponent } from './PIA/view-participant/view-participant.component';
import { ProgramSessionsComponent } from './PIA/program-sessions/program-sessions.component';
import { AllParticipantsVerificationComponent } from './CALL_CENTER/all-participants-verification/all-participants-verification.component';
import { AttentanceParticipantComponent } from './PIA/attentance-participant/attentance-participant.component';
import { VerificationParticipantComponent } from './CALL_CENTER/verification-participant/verification-participant.component';
import { RawMaterialsParticipantsComponent } from './PIA/raw-materials-participants/raw-materials-participants.component';
import { ProgramExpenditureComponent } from './PIA/program-expenditure/program-expenditure.component';
import { BulkExpenditureComponent } from './PIA/bulk-expenditure/bulk-expenditure.component';
import { ProgramSummaryComponent } from './PIA/program-summary/program-summary.component';
import { AddProgramSessionsComponent } from './PIA/add-program-sessions/add-program-sessions.component';
import { ViewProgramAgenciesComponent } from './PIA/view-program-agencies/view-program-agencies.component';
import { ProgramMonitoringComponent } from './PIA/program-monitoring/program-monitoring.component';
import { ViewAllAgencySessionsComponent } from './PIA/view-all-agency-sessions/view-all-agency-sessions.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR,Role.CALL_CENTER] }
    },
    {
        path: 'password-settings',
        component: PasswordSettingsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR,Role.CALL_CENTER] }
    },
    {
        path: 'user-registration',
        component: UserRegistrationComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'program-creation',
        component: ProgramCreationComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'program-creation-edit/:id',
        component: ProgramCreationComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'veiw-program-creation',
        component: VeiwProgramCreationComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
      {
        path: 'program-monitoring',
        component: ProgramMonitoringComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'veiw-program',
        component: ViewProgramAgenciesComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'add-participant-data',
        component: AddParticipantDataComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'add-participant-data-edit/:id',
        component: AddParticipantDataComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'update-program-execution',
        component: UpdateProgramExecutionComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'view-program-participate',
        component: ViewParticipateCreationComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'view-table-organization',
        component: OrganizationsListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
        path: 'capture-outcome',
        component: CaptureOutcomeDynamicComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'esdp-training',
        component: ESDPTrainingComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },    
    {
        path: 'shg-training',
        component: ShgTrainingStatusComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'MSME-councellor-registeration',
        component: MsmeCouncellorRegisterationComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'view-MSME-councellor',
        component: ViewMsmeCouncellorDataComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'global-dashboard',
        component: GlobalDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR,Role.CALL_CENTER,Role.Admin] }
    },
    {
        path: 'view-participant-data',
        component: ViewParticipantComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'program-sessions',
        component: ProgramSessionsComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'add-sessions',
        component: AddProgramSessionsComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'view-agency-sessions',
        component: ViewAllAgencySessionsComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.Admin] }
    },
    {
        path: 'program-sessions-edit/:id',
        component: ProgramSessionsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'attendance-Participant',
        component: AttentanceParticipantComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR]}
    },
    {
        path: 'rawMaterials-Participant',
        component: RawMaterialsParticipantsComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR]}
    },
    {
        path: 'program-expenditure',
        component: ProgramExpenditureComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR]}
    },
    {
        path: 'program-summary',
        component: ProgramSummaryComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.Admin,Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR]}
    },
    {
        path: 'bulk-expenditure',
        component: BulkExpenditureComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.Admin,Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR]}
    },
    {
        path: 'participant-details',
        component: VerificationParticipantComponent,
        canActivate: [AuthGuard],
        data: { roles:  [Role.CALL_CENTER] }
    },
    {
        path: 'login',
        component: LoginComponent
    },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
