import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private afAuth: AngularFireAuth) { }

  logout() {
    this.afAuth.signOut();
    this.router.navigate(['']);
  }

  isLoggedIn() {
    return this.afAuth.currentUser;
  }
}
