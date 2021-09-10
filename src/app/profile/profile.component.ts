import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
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


  loading = false;
  error: string | null = null;

  downloadURL: Observable<string> | null = null;
  uploadProgress: Observable<number> | null = null;

  constructor(
    public afAuth: AngularFireAuth,
    private firestore:AngularFirestore,
    private afStorage:AngularFireStorage,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.uid = this.route.snapshot.paramMap.get('id') as string;

      this.downloadURL = this.afStorage
        .ref(`users/${this.uid}/profile-image`)
        .getDownloadURL();
    }

  ngOnInit() {
    this.itemDoc = this.firestore.doc<UserProfile>(`users/${this.uid}`);
    this.item = this.itemDoc.valueChanges() as Observable<UserProfile>;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }


  async onSubmit(ngForm: NgForm) {
    this.loading = true;

    const {
      email,name,address,city,state,zip,ip,phone,specialty
    } = ngForm.form.getRawValue();

    const userProfile: UserProfile = {
      uid: this.uid,email,name,address,city,state,zip,ip,phone,specialty
    };

    try {
      await this.auth.updateUserDocument(userProfile);
    } catch(error: any) {
      console.log(error.message);
      this.error = error.message;
    }

    this.loading = false;
  }

  fileChange(event : any ) {
    // reseteamos las variables
    this.downloadURL = null;
    this.error = null;

    // obtenemos el archivo
    const file = event.target.files[0];

    // creamos la referencia al archivo
    const filePath = `users/${this.uid}/profile-image`;
    const fileRef = this.afStorage.ref(filePath);

    // subimos y almacenamos
    const task = this.afStorage.upload(filePath, file);
    task.catch(error => this.error = error.message);

    // modificamos el observable del progreso
    this.uploadProgress = task.percentageChanges() as Observable<number>;

    // notificación
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
        })
      )
      .subscribe();
  }


}
