import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './pages/DashboardComune/login/login.component';
import { RegisterComponent } from './pages/DashboardComune/register/register.component';
import {HomeComponent} from './pages/DashboardComune/home/home.components';
import { AuthGuard } from './services/auth.guard';
import {DashboardComponent} from './pages/DashboardComune/dashboard.component';
import {HeaderComponent} from './pages/DashboardComune/header-logo/header.component';
import {DashboardDocente} from './pages/DashboardDocente/dashboardDocente.component';
import {DashboardStudente} from './pages/DashboardStudente/DashboardStudente.component';
import {GuidaComponent} from './pages/DashboardComune/header-logo/guida.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'header', component: HeaderComponent},
  { path: 'guida', component: GuidaComponent},
  { path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: 'dashboardDocente', component: DashboardDocente,
    canActivate: [AuthGuard]
  },
  { path: 'dashboardStudente', component: DashboardStudente,
    canActivate: [AuthGuard]
  },
  { path: 'register', component: RegisterComponent }
];

