import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Friend } from '../_models/friend'
import {environment} from '../environments/environment'

@Injectable({ providedIn: 'root' })
export class FriendsService {

    constructor(private http: HttpClient) { }

    // Used to create a Friend Request
    createrequest (friendRequest) {

         return this.http.post<Friend>(`${environment.apiUrl}friends/createrequest/`, friendRequest  );

    }

    //  Update Friend Request by ID – Update any friend request by unique request ID
    //‘friends/’ + updateRequest.id, updatedRequest 
    updateFriendRequest (friendRequest, friendrequestId) {
 
        return this.http.put(`${environment.apiUrl}friends/` + friendrequestId, friendRequest);

    }

	// Get All Friend Request – Retrieve all friend requests available in the system
	getAllFriendRequest(){
		 return this.http.get<any>(`${environment.apiUrl}friends/`);
	}
	
    // Get Friend Request by ID – Simply retrieve any friend request by unique request ID 
    getFriendRequest (requestId: string) {
    
        return this.http.get<Friend>(`${environment.apiUrl}friends/`+ requestId);

    }
}