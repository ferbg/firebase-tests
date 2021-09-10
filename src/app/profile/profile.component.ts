import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserProfile } from '../models/user-profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private itemDoc : AngularFirestoreDocument<UserProfile> | null = null;
  public item     : Observable<UserProfile> | null               = null;
  private uid     : string                                       = "";

  constructor(
    public afAuth: AngularFireAuth,
    private firestore:AngularFirestore,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.uid = this.route.snapshot.paramMap.get('id') as string;
    }

  ngOnInit() {
    this.itemDoc = this.firestore.doc<UserProfile>(`users/${this.uid}`);
    this.item = this.itemDoc.valueChanges() as Observable<UserProfile>;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }

}
