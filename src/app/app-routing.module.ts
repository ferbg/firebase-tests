import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { redirectUnauthorizedTo, AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { map } from 'rxjs/operators';

const redirectionToLog = () => redirectUnauthorizedTo(['']);
const redirectionToProfile = () => map(user => user ? ['profile', (user as any).uid]: true);

const routes: Routes = [
  {
    path: '',
    component:  LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectionToProfile }
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectionToLog }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
