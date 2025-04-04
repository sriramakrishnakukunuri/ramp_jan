import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { AdminComponent } from './admin';
import { LoginComponent } from './login';
import { FormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ProfileComponent } from './profile/profile.component';
import { PasswordSettingsComponent } from './password-settings/password-settings.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { ProgramCreationComponent } from './PIA/program-creation/program-creation.component';
import { AddParticipantDataComponent } from './PIA/add-participant-data/add-participant-data.component';
import { VeiwProgramCreationComponent } from './PIA/veiw-program-creation/veiw-program-creation.component';
import { UpdateProgramExecutionComponent } from './PIA/update-program-execution/update-program-execution.component';
import { HasRoleDirective } from './app.component'; // Import the directive
import { ViewParticipateCreationComponent } from './PIA/view-praticipate-creation/view-praticipate-creation.component';
import { OrganizationsListComponent } from './organizations-list/organizations-list.component';
import { CaptureOutcomeComponent } from './PIA/capture-outcome/capture-outcome.component';
import { CaptureOutcomeDynamicComponent } from './PIA/capture-outcome-dynamic/capture-outcome-dynamic.component';
import { ESDPTrainingComponent } from './PIA/esdp-training/esdp-training.component';
import { ShgTrainingStatusComponent } from './PIA/shg-training-status/shg-training-status.component';
import { GlobalDashboardComponent } from './Dashboard/global-dashboard/global-dashboard.component';
import { MsmeCouncellorRegisterationComponent } from './PIA/msme-councellor-registeration/msme-councellor-registeration.component';
import { ViewParticipantComponent } from './PIA/view-participant/view-participant.component';
import { GetOutcomeComponent } from './PIA/get-outcome/get-outcome.component';
import { ViewMsmeCouncellorDataComponent } from './PIA/view-msme-councellor-data/view-msme-councellor-data.component';
import { ProgramSessionsComponent } from './PIA/program-sessions/program-sessions.component';
import { AllParticipantsVerificationComponent } from './CALL_CENTER/all-participants-verification/all-participants-verification.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
            timeOut: 15000, // 15 seconds
            closeButton: true,
            progressBar: true,
        }),
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        AdminComponent,
        LoginComponent,
        ProfileComponent,
        PasswordSettingsComponent,
        UserRegistrationComponent,
        ProgramCreationComponent,
        AddParticipantDataComponent,
        VeiwProgramCreationComponent,
        UpdateProgramExecutionComponent,
        HasRoleDirective, // Declare the directive
        ViewParticipateCreationComponent,
        OrganizationsListComponent,
        CaptureOutcomeComponent,
        CaptureOutcomeDynamicComponent,
        ESDPTrainingComponent,
        ShgTrainingStatusComponent,
        GlobalDashboardComponent,
        MsmeCouncellorRegisterationComponent,
        ViewParticipantComponent,
        GetOutcomeComponent,
        ViewMsmeCouncellorDataComponent, ProgramSessionsComponent, AllParticipantsVerificationComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }