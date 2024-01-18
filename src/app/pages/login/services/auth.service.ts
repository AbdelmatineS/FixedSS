import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {map, Observable} from 'rxjs';
import { environment } from 'src/environments/environment';


const AUTH_API = `${environment.baseApiUrl}/api/authSt/`;

//const AUTH_API = 'http://localhost:8080/FixedApp/api/authSt/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient, private router:Router) { }


  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    )/* .pipe(
      map((response: any) => {
        const jwtCookie = response.headers.get('Set-Cookie'); // Assuming JWT token is set in a cookie
        const userInfo = response.body; // Assuming response body contains user info
  
        const roles = userInfo.roles; // Assuming roles are available in userInfo
        
        if (roles!='ROLE_ST'||'ROLE_ADMIN'){
        this.logout();
        }

  
      })
    ) */;
  }

  register(fullName: string,username: string, email: string, password: string, numTel: number,zone: string, nomSt: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        fullName,
        username,
        email,
        password,
        numTel,
        zone,
        nomSt,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions);
  }





}


/*

  private user$ = new BehaviorSubject<User>(null!);

  constructor(private http:HttpClient, private router:Router) { }


  private httpOptions: {headers: HttpHeaders} = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };


  get isUserLoggedIn(): Observable<boolean>{
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    )
  }

  // get userRole(): Observable<Role> {
  //   return this.user$.asObservable().pipe(
  //     switchMap((user: User) => {
  //       return of(user?.role); // for after signed out, but still subscribed
  //     })
  //   );
  // }

  register(newUser: NewUser): Observable<User>{

    return this.http.post<User>(
      `${environment.baseApiUrl}api/user/save`, newUser, this.httpOptions
    ).pipe(take(1));
  }


  login(userName: string, password: string): Observable<{ token: string }>{
    
    return this.http
    .post<{token: string}>(
      `${environment.baseApiUrl}/login/signin`, 
      {userName, password}, 
      this.httpOptions
    )
    .pipe(take(1),
    tap((response: {token: string}) => {
      Preferences.set({
        key: 'token',
        value: response.token,
      });
      const decodedToken: UserResponse = jwt_decode(response.token);
      this.user$.next(decodedToken.user);
    })
    );
  
  }


  logout(): void {
    this.user$.next(null!);
    Preferences.remove({ key: 'token' });
    this.router.navigateByUrl('/auth');
  }

*/