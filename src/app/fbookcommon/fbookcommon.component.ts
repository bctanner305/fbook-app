import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../_models/user'
import { AuthenticationService } from '../_services/authentication.service';
import { PostService } from '../_services/post.service'
import { AlertService } from '../_services/alert.service';
import { FilesService } from '../_services/files.service';
import { FriendsService } from '../_services/friends.service';
import { Post } from '../_models/post';
import { Friend } from '../_models/friend';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-fbookcommon',
  templateUrl: './fbookcommon.component.html',
  styleUrls: ['./fbookcommon.component.css']
})
export class FbookcommonComponent implements OnInit {
  currentUser: User;
  updateUser: User;
  fbookcommonForm: FormGroup;
  newpost: Post;
  posts = [];
  posttext: string;
  myposts: Post[];
  myfriends: Friend[];
  potentialfriends: Friend[];
  selectedFile: File;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private friendsService: FriendsService,
    private filesService: FilesService,
    private userService: UserService,
    private postService: PostService) {
  }

  ngOnInit() {

     // Obtain Local Storage (currentUser)  
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

	// If the user has a photoId, then get the photo image.
    if (this.currentUser.photoId) {
      this.getUserPhotoImage(this.currentUser.photoId);
    }

	// Get the Number of POSTS - for display
    this.getPostsCount();

	// Get the Number of Connections - for display
    this.getFriendsCount();
	
  }

  // Call the service (FriendsService) to obtain a list of all of the
  // friends for the CURRENT USER (i.e., we want a count of
  // the number of friends that the user has)
  public getFriendsCount() {

    this.friendsService.getAllFriendRequest()
      .pipe(first())
      .subscribe(
        data => {
          this.potentialfriends = data;
          this.myfriends = new Array;

          for (let i = 0; i < this.potentialfriends.length; i++) {
            if ((this.currentUser._id == this.potentialfriends[i].userId ||
              this.currentUser._id == this.potentialfriends[i].friendId) &&
              (this.potentialfriends[i].status == "You are friend")) {

              this.myfriends.push(this.potentialfriends[i]);

            }

          }
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");

        });
  }

  // Call the service (postService) to obtain a list of all of the
  // Posts by the CURRENT USER (i.e., we want a count of
  // the number of posts by the user)
  getPostsCount() {

    this.postService.getPostsByUserId(this.currentUser._id)
      .pipe(first())
      .subscribe(
        (data: Post[]) => {
          this.myposts = data;
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");

        });
  }

  // Get the Users Photo Image
  getUserPhotoImage(Id) {

    this.filesService.getFilePhotoOrImageById(Id)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.createImageFromBlob(data);
        },
        error => {
          this.alertService.error("Error retrieving Data. ");

        });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.currentUser.photoImg = reader.result;
      // update Local Storage
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


  // A new Photo has been selected by the User, update the image, Local Storage,
  // as well as Persistance Storage (i.e., call the service to update the DB)
  onNewPhoto(event) {
    this.selectedFile = event.target.files[0]
    const uploadData = new FormData();
    uploadData.append('picture', this.selectedFile, this.selectedFile.name);
    this.filesService.uploadfiles(uploadData).pipe(first())
      .subscribe(
        (data: any) => {
          this.getUserPhotoImage(data.uploadId);
          this.currentUser.photoId = data.uploadId;
          // update Local Storage
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

          // Now Update the presistance Storage
          this.updateUserPhotoId(data.uploadId);

          this.alertService.success("Your new Photo Image has been changed.");

        },
        error => {
          this.alertService.error("Error retrieving Data. ");

        });
  }

  // Update the Users Photo Id, by calling the User Service (updatUser)
  updateUserPhotoId(id) {

    // Call the User Service to updat the Photo Id
    this.updateUser = new User;
    this.updateUser.id = this.currentUser._id;
    this.updateUser.photoId = id;

    this.userService.updateUser(this.currentUser._id, this.updateUser).pipe(first())
      .subscribe(
        (data: any) => {

        },
        error => {
          this.alertService.error("Error Updatmin Data. ");

        });

  }


}
