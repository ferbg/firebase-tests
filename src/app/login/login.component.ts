import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading : boolean = false;
  action  : 'login' | 'signup' = 'login';
  error   : string | null = null;

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() { }

  async onSubmit(form: NgForm) {
    this.loading = true;
    this.error   = null;

    const { email, password, firstName, lastName } = form.value;

    let resp: any;
    try {
      if (this.issignup) {
        resp = await this.afAuth.createUserWithEmailAndPassword(email, password);
        await resp.user.updateProfile({ displayName: `${firstName} ${lastName}` });
        form.reset();
      } else {
        resp = await this.afAuth.signInWithEmailAndPassword(email, password);
      }
      const uid = resp.user.uid;
      this.router.navigate([`/profile/${uid}`]);
    } catch (error: any) {
      console.log(error.message);
      this.error = error.message;
    }

    this.loading = false;
  }

  //getters
  get islogin() {
    return this.action === 'login';
  }

  get issignup() {
    return this.action === 'signup';
  }

}
