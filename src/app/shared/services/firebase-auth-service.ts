import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private auth = inject(Auth);

  googleLogin(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    return signInWithPopup(this.auth, provider)
      .then(async (result) => {
        const idToken = await result.user.getIdToken();
        localStorage.setItem('accessToken', idToken);
        localStorage.setItem('user', JSON.stringify(result.user));
        console.log('✅ Logged in as:', result.user.displayName);
      })
      .catch((err) => {
        console.error('❌ Google login failed:', err);
      });
  }

  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      localStorage.clear();
      console.log('🚪 Logged out');
    });
  }

  get user$(): Observable<any> {
    return user(this.auth);
  }
}
