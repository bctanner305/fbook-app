import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Post } from '../_models/post'
import { environment } from '../environments/environment'

@Injectable({ providedIn: 'root' })
export class PostService {
    constructor(private http: HttpClient) { }

    // Make the call to get ALL of the posts    
    getPosts() {
        return this.http.get<Post[]>(`${environment.apiUrl}posts/`);
    }

    //Get Posts by User ID – Fetch all posts posted by a specific user 
    //using user ID
    getPostsByUserId(id ){
        return this.http.post<Post[]>(`${environment.apiUrl}posts/findpostbyuserid`, {"id" : id});
    }

     // The call to submit/create a post
    createpost(post: Post) {
        return this.http.post<Post>(`${environment.apiUrl}posts/createpost`, post);
    }
	
	// Update multiple post record in singe request. Used to update user profile photo 
	// or each post record when the photo of user changed who has posted the posts
	updatemanyposts (updatePayload) {
		return this.http.post<Post>(`${environment.apiUrl}posts/updatemanyposts`, updatePayload);
    }
}