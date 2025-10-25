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
import { LoanApplicationFormComponent } from './TIHCL/loan-application-form/loan-application-form.component';
import { Level1ApprovalComponent } from './tihcl-manager/level1-approval/level1-approval.component';
import { Level2ApprovalComponent } from './tihcl-manager/level2-approval/level2-approval.component';
import { Level3ApprovalComponent } from './tihcl-manager/level3-approval/level3-approval.component';
import { LoanAppilicationNewComponent } from './TIHCL/loan-appilication-new/loan-appilication-new.component';
import { NewApplicationExecutiveComponent } from './tihcl-executive/new-application-executive/new-application-executive.component';
import { PendingApplicationExecutiveComponent } from './tihcl-executive/pending-application-executive/pending-application-executive.component';
import { ExecutiveWorkflowComponent } from './tihcl-executive/executive-workflow/executive-workflow.component';
import { DicApprovalComponent } from './tihcl-dic/dic-approval/dic-approval.component';
import { ViewApplicationsComponent } from './tihcl-coi/view-applications/view-applications.component';
import { SanctionedAmountComponent } from './sanctioned-amount/sanctioned-amount.component';

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
        data: { roles: [Role.Admin,Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
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
        data: { roles:  [Role.TIHCL_EXECUTOR,Role.TIHCL_MANAGER,Role.TIHCL_COI,Role.TIHCL_DIC] }
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
        path: 'program-sessions-edit/:id',
        component: ProgramSessionsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.AGENCY_MANAGER,Role.AGENCY_EXECUTOR] }
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'loan-application-process',
        component: LoanAppilicationNewComponent
    },
     {
        path: 'password-settings',
        component: PasswordSettingsComponent,
    },
    {
        path: 'Manager-approval-1',
        component: Level1ApprovalComponent,
         canActivate: [AuthGuard],
        data: { roles: [Role.TIHCL_MANAGER] }
    },
     {
        path: 'Manager-approval-2',
        component: Level2ApprovalComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.TIHCL_MANAGER] }
    },
      {
        path: 'Manager-approval-3',
        component: Level3ApprovalComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.TIHCL_MANAGER] }
    },
     {
        path: 'new-application',
        component: NewApplicationExecutiveComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.TIHCL_EXECUTOR] }
    },
    {
        path: 'sanctioned-amount',
        component: SanctionedAmountComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.TIHCL_COI] }
    },
    {
        path: 'pending-application',
        component: PendingApplicationExecutiveComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.TIHCL_EXECUTOR] }
    },
      {
        path: 'executive-workflow',
        component: ExecutiveWorkflowComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.TIHCL_EXECUTOR] }
    },
      {
        path: 'view-application',
        component: ViewApplicationsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.TIHCL_COI,Role.TIHCL_DIC] }
    },
      {
        path: 'DIC-NOC',
        component: DicApprovalComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.TIHCL_MANAGER,Role.TIHCL_DIC] }
    },


    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
