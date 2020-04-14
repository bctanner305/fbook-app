import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Post } from '../_models/post'
import {environment} from '../environments/environment'

// This module is responsible for uploading and downloading the user profile 
// image and post images from server/database
@Injectable({ providedIn: 'root' })
export class FilesService {
    constructor(private http: HttpClient) { }

	// Upload File – Upload any new user profile photo or post image
	uploadfiles(formData ) {
		return this.http.post<any>(`${environment.apiUrl}files/uploadfile`, formData);
	}
  
	// Get Image/Photo by ID – Download/Fetch any user profile photo or post image using ID
	getFilePhotoOrImageById(photoOrImageId: string ) {
		return this.http.get(`${environment.apiUrl}files/` + photoOrImageId, { responseType: "blob" });
	}

}