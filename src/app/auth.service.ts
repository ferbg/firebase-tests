import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

import { UserProfile } from './models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private afAuth: AngularFireAuth, private firestore : AngularFirestore) { }

  logout() {
    this.afAuth.signOut();
    this.router.navigate(['']);
  }

  isLoggedIn() {
    return this.afAuth.currentUser;
  }

  async createUserDocument() {
    // obtenemos el usuario actual, como es una promesa, lo hacemos con await
    const user = await this.afAuth.currentUser;

    if ( user ) {
      // creamos el objeto con los datos basados en la interfaz
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        specialty: '',
        ip: ''
      };

      // los escribimos en el  Cloud Firestore
      return this.firestore.doc(`users/${user.uid}`).set(userProfile);
    }

  }
}
