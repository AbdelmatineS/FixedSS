import { Injectable } from '@angular/core';
//import { Storage } from '@ionic/storage-angular';


const USER_KEY = 'auth-user';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
    //this.initStorage();
   }

 /*   async initStorage(){
    await this.storage.create();
   }

   async set(key: string,value: any) {
    await this.storage.set(key, value);
    return true;
   }

   async get(key: string){
    const value = await this.storage.get(key);
   }


   async remove(key: string){
    await this.storage.remove(key);
    return
   } */






  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public getUserId(): number | null {
    const user = window.sessionStorage.getItem(USER_KEY);
    
    if (user) {
      const userObject = JSON.parse(user);
      
      // Check if the 'id' property exists in the user object
      if (userObject && userObject.id) {
        return userObject.id;
      }
    }
    
    // Return null or an appropriate default value if 'id' is not found
    return null;
  }

  
  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
  
}


