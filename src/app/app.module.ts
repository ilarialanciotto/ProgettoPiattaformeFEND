import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AppComponent} from './app.component';
import {NgModule} from '@angular/core';
import {LoginComponent} from './pages/DashboardComune/login/login.component';
import {RegisterComponent} from './pages/DashboardComune/register/register.component';
import {HomeComponent} from './pages/DashboardComune/home/home.components';
import {routes} from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import {AuthGuard} from './services/auth.guard';
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './pages/DashboardComune/header-logo/header.component';
import {DashboardDocente} from './pages/DashboardDocente/dashboardDocente.component';
import {DashboardComponent} from './pages/DashboardComune/dashboard.component';
import {DashboardStudente} from './pages/DashboardStudente/DashboardStudente.component';
import {GuidaComponent} from './pages/DashboardComune/header-logo/guida.component';

@NgModule({
  declarations: [
    AppComponent,
    GuidaComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HeaderComponent,
    DashboardDocente,
    DashboardStudente
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
