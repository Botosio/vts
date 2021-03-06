import { Injectable } from '@angular/core';
import { AngularFireAuth }  from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private user = new BehaviorSubject<firebase.User>(null);
  public loggedInUser$ = this.user.asObservable();
  // todo, create class/interface for logged in model

  constructor(private authFire: AngularFireAuth) {}

  public isUserSignedIn(): void {
    this.authFire.onAuthStateChanged(user => {
      this.user.next(user);
    });


  }

  public getUser(): Observable<firebase.User> {
    return this.loggedInUser$; //.pipe(filter(user => user)); // TODO: check this logic
  }
  /**
   * * returns if there is a current user
   * @returns firebase
   */
  public checkIfUserExist(): Promise<firebase.User> {
    return this.authFire.currentUser;
  }

  public isUserLoggedIn(): Observable<boolean> {
    return this.getUser().pipe(
      map(user => {
        return user ? true : false;
      })
    );
  }

  public signOutUser() {
    this.authFire.signOut()
      .then(function() {
        // Sign-out successful.
        console.debug('user was signed out');
      })
      .catch(function(error) {
        // An error happened.
      });
  }

  public signInUserEmail(email, password) {
    return this.authFire.signInWithEmailAndPassword(email, password)
      .catch(error => {
        // Handle Errors here.
        console.log(error.code, error.message);
        //this._actionToast.failedSave(error.message);
      })
      .finally(() => {
        this.isUserSignedIn();
      });
  }

  public resetPassword(email: string) {
    this.authFire.sendPasswordResetEmail(email)
      .then(function() {
        // Email sent.
      })
      .catch(function(error) {
        // An error happened.
      });
  }
}
