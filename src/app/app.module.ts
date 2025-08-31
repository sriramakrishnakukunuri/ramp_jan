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
import { LoanApplicationFormComponent } from './TIHCL/loan-application-form/loan-application-form.component';
import { Level1ApprovalComponent } from './tihcl-manager/level1-approval/level1-approval.component';
import { Level2ApprovalComponent } from './tihcl-manager/level2-approval/level2-approval.component';
import { Level3ApprovalComponent } from './tihcl-manager/level3-approval/level3-approval.component';
import { LoanAppilicationNewComponent } from './TIHCL/loan-appilication-new/loan-appilication-new.component';
import { MultiselectDropdownComponent } from './seperate-components/multiselect-dropdown/multiselect-dropdown.component';
import { NewApplicationExecutiveComponent } from './tihcl-executive/new-application-executive/new-application-executive.component';
import { PendingApplicationExecutiveComponent } from './tihcl-executive/pending-application-executive/pending-application-executive.component';
import { ExecutiveWorkflowComponent } from './tihcl-executive/executive-workflow/executive-workflow.component';
import { PreliminarAssessmentComponent } from './tihcl-executive/executive-workflow/pages/preliminar-assessment/preliminar-assessment.component';
import { ManagerApprovalComponent } from './tihcl-executive/executive-workflow/pages/manager-approval/manager-approval.component';
import { UnitVisitComponent } from './tihcl-executive/executive-workflow/pages/unit-visit/unit-visit.component';
import { DiagnosticReportComponent } from './tihcl-executive/executive-workflow/pages/diagnostic-report/diagnostic-report.component';
import { DiConcernLetterComponent } from './tihcl-executive/executive-workflow/pages/di-concern-letter/di-concern-letter.component';
import { RampChecklistComponent } from './tihcl-executive/executive-workflow/pages/ramp-checklist/ramp-checklist.component';
import { PrimaryNocComponent } from './tihcl-executive/executive-workflow/pages/primary-noc/primary-noc.component';
import { SanctionedDetailsComponent } from './tihcl-executive/executive-workflow/pages/sanctioned-details/sanctioned-details.component';
import { DisbursementDetailsComponent } from './tihcl-executive/executive-workflow/pages/disbursement-details/disbursement-details.component';
import { PaginationComponent } from './seperate-components/multiselect-dropdown/pagination/pagination.component';
import { MultiLevelDropdownComponent } from './seperate-components/multiselect-dropdown/multi-level-dropdown/multi-level-dropdown.component';
import { DicApprovalComponent } from './tihcl-dic/dic-approval/dic-approval.component';
import { ViewApplicationsComponent } from './tihcl-coi/view-applications/view-applications.component';
import { LoaderComponent } from './common_components/loader/loader.component';

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
        ViewMsmeCouncellorDataComponent, ProgramSessionsComponent, LoanApplicationFormComponent, 
        Level1ApprovalComponent, Level2ApprovalComponent, Level3ApprovalComponent, LoanAppilicationNewComponent,
        MultiselectDropdownComponent, NewApplicationExecutiveComponent, PendingApplicationExecutiveComponent,
        ExecutiveWorkflowComponent, PreliminarAssessmentComponent,
        ManagerApprovalComponent, UnitVisitComponent, DiagnosticReportComponent,
        DiConcernLetterComponent, RampChecklistComponent, PrimaryNocComponent, SanctionedDetailsComponent,
        DisbursementDetailsComponent, PaginationComponent, MultiLevelDropdownComponent, DicApprovalComponent, ViewApplicationsComponent,
        LoaderComponent,
    ],
    exports:[
        LoaderComponent
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