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
        path: 'password-settings',
        component: PasswordSettingsComponent,
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
