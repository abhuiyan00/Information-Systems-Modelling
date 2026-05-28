import { Routes } from '@angular/router';
import { StudentListComponent } from './features/students/student-list/student-list';
import { StudentFormComponent } from './features/students/student-form/student-form';
import { HomeComponent } from './features/home/home';
import { BuildListComponent } from './features/builds/build-list/build-list';
import { BuildDetailComponent } from './features/builds/build-detail/build-detail';
import { BuildFormComponent } from './features/builds/build-form/build-form';
import { MyBuildsComponent } from './features/my-builds/my-builds';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { StatisticsComponent } from './features/statistics/statistics';
import { AdminQueueComponent } from './features/admin/admin-queue/admin-queue';
import { AdminUsersComponent } from './features/admin/admin-users/admin-users';
import { AccountComponent } from './features/account/account';
import { TestRunsComponent } from './features/test-runs/test-runs';
import { MarketplaceComponent } from './features/marketplace/marketplace';
import { MessagesComponent } from './features/messages/messages';

export const routes: Routes = [
  // Home dashboard
  { path: '',                 component: HomeComponent },

  // Explore (public) — also reachable via /builds for backwards compat
  { path: 'explore',          component: BuildListComponent },
  { path: 'builds',           component: BuildListComponent },

  // Builds CRUD
  { path: 'builds/create',    component: BuildFormComponent },     // before :id
  { path: 'builds/edit/:id',  component: BuildFormComponent },
  { path: 'builds/:id',       component: BuildDetailComponent },

  // My Builds
  { path: 'my-builds',        component: MyBuildsComponent },

  // Auth
  { path: 'login',            component: LoginComponent },
  { path: 'register',         component: RegisterComponent },

  // Account
  { path: 'account',          component: AccountComponent },

  // Admin
  { path: 'admin/queue',      component: AdminQueueComponent },
  { path: 'admin/users',      component: AdminUsersComponent },

  // System
  { path: 'statistics',       component: StatisticsComponent },

  // New surfaces (Phase 5)
  { path: 'test-runs',        component: TestRunsComponent },
  { path: 'marketplace',      component: MarketplaceComponent },
  { path: 'messages',         component: MessagesComponent },

  // Legacy (kept routable but no longer in nav)
  { path: 'students',          component: StudentListComponent },
  { path: 'students/create',   component: StudentFormComponent },
  { path: 'students/edit/:id', component: StudentFormComponent }
];
