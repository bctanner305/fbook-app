import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../_services/user.service';
import { FriendsService } from '../_services/friends.service';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service'
import { Friend } from '../_models/friend';
import { User } from '../_models/user';
import { FilesService } from '../_services/files.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  potentialfriends: Friend[];
  friends: Friend[] = new Array();
  submitted = false;
  currentUser: User;

  constructor( private userService: UserService,
    private friendsService: FriendsService,
    private filesService: FilesService,
    private alertService: AlertService) {

  }

  ngOnInit() {

	// Obtain Local Storage (currentUser)  
    this.currentUser = JSON.parse( localStorage.getItem('currentUser'));
  
    // Call the service (FriendsService) to obtain a list of all of the
    // friends ()
    this.friendsService.getAllFriendRequest()
      .pipe(first())
      .subscribe(
        data => {

          this.potentialfriends = data;
          this.friends = new Array;

          for (let i = 0; i < this.potentialfriends.length; i++) {
            if ((this.currentUser._id == this.potentialfriends[i].userId ||
              this.currentUser._id == this.potentialfriends[i].friendId) &&
              (this.potentialfriends[i].status == "You are friend")) {

              if (this.currentUser._id != this.potentialfriends[i].userId) {
                this.finduserNameAndPhotoId(this.potentialfriends[i].userId, i);
              }

              if (this.currentUser._id != this.potentialfriends[i].friendId) {
                this.finduserNameAndPhotoId(this.potentialfriends[i].friendId, i);
              }

              this.friends.push(this.potentialfriends[i]);

            }

          }

        },
        error => {
          // this.alertService.error("Error retrieving Data. Please re-login and try again!");

        });
  }

  //  Added the User Name to the List of Friends
  finduserNameAndPhotoId(friendId, i) {
    this.userService.findUserbyID(friendId)

      .subscribe((data: User) => {

        this.potentialfriends[i].friendName = data.lastName + ", " + data.firstName;
        this.potentialfriends[i].photoId = data.photoId;
 
        // Load the profile picture for the Friend
        this.getUserPhotoImage(this.potentialfriends[i].photoId, i)
      },
        error => {
          this.alertService.error("Unable to find a User");

        });
  }


  getUserPhotoImage(Id, i) {

    this.filesService.getFilePhotoOrImageById(Id)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.createImageFromBlob(data, i);
        },
        error => {
          this.alertService.error("Error retrieving Data. ");

        });
  }


  createImageFromBlob(image: Blob, i) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.potentialfriends[i].photoImg = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


}