import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models/user'
import {environment} from '../environments/environment'

@Injectable({ providedIn: 'root' })
export class UserService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
     }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    // Used to Register a user
    register(user: User) {
        return this.http.post(`${environment.apiUrl}users/register`, user);
    }

    // User to Update a User, based on the ID
    updateUser(id: String,updateUserRequest) {
        return this.http.put(`${environment.apiUrl}users/` + id, updateUserRequest);
    }

    //Find all users - to be used by the USERS tab (i.e., Admin users only)
    findallusers(): Observable<User[]> {
        return this.http.get<User[]>(`${environment.apiUrl}users`);
   }

   // Find User by ID – 
   // Retrieve any user registered in the system by their unique ID ‘users/’ + userId 
   findUserbyID(id) {
       return this.http.get<any>(`${environment.apiUrl}users/` + id);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }

 
}