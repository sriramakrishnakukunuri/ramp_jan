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
        data: { roles: [Role.Admin,Role.User] }
    },
    {
        path: 'password-settings',
        component: PasswordSettingsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.User] }
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
        data: { roles: [Role.Admin,Role.User] }
    },
    {
        path: 'veiw-program-creation',
        component: VeiwProgramCreationComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.User] }
    },
    {
        path: 'add-participant-data',
        component: AddParticipantDataComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.User] }
    },
    {
        path: 'update-program-execution',
        component: UpdateProgramExecutionComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin,Role.User] }
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
