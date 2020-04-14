import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service'
import { AlertService } from '../_services/alert.service'
import { FriendsService } from '../_services/friends.service';
import { Friend } from '../_models/friend';
import { FilesService } from '../_services/files.service';
import { FbookcommonComponent } from '../fbookcommon/fbookcommon.component';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  @ViewChild(FbookcommonComponent, { static: false }) fbookcommonComponent: FbookcommonComponent;
  friends: Friend[] = [];
  friendsrequest: Friend[] = [];
  users: User[] = [];
  currentUser: User;
  networkForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private userService: UserService,
    private friendsService: FriendsService,
    private filesService: FilesService,
    private alertService: AlertService) {

  }

  ngOnInit() {

    // Obtain Local Storage (currentUser)  
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Clear the Alert Message.
    this.alertService.clear();

    // Load ALL users
    this.getAllNetworkUsers();

  }

  // Send a Request to Potential Friend.
  sendrequestuser(id) {

    this.alertService.clear;

    var friendRequest = {
      'userId': JSON.parse(localStorage.getItem('currentUser'))._id,
      'friendId': id,
      'status': "Request Pending"
    };
    // Send the Request
    this.friendsService.createrequest(friendRequest).pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Friend request sent successfully");
          this.getAllNetworkUsers();
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");
          this.loading = false;
        });


  }

  // Acceot a Friend Request.
  acceptfriendRequest(id, friendrequestId) {

    this.alertService.clear;

    var friendRequest = {
      'userId': id,
      'friendId': JSON.parse(localStorage.getItem('currentUser'))._id,
      'status': "You are friend"
    };
    // Send the Request
    this.friendsService.updateFriendRequest(friendRequest, friendrequestId).pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Friend added successfully");
          this.getAllNetworkUsers();

          // Update the Child Component (fbookcommonComponent)
          this.fbookcommonComponent.getFriendsCount();
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");
          this.loading = false;
        });


  }

  // Call the service (UserService) to obtain a list of all of the
  // people on the network
  getAllNetworkUsers() {
    this.userService.findallusers()
      .pipe(first())
      .subscribe(
        data => {
          this.users = data;
          // Call the Friend service to see which people on the network are friends (or
          // potential Friends).
          this.getfriendsrequests();
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");
          this.loading = false;
        });
  }

  getfriendsrequests() {
    // Call the service (FriendsService) to obtain a list of all of the
    // friends ()
    this.friendsService.getAllFriendRequest()
      .pipe(first())
      .subscribe(
        data => {
          this.friendsrequest = data;
          this.UpdateStatus();

          // Load all profile pictures
          for (let i = 0; i < this.users.length; i++) {
            this.getUserPhotoImage(this.users[i].photoId, i)
          }
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");
          this.loading = false;
        });

  }

  // Update the Status of the Friends.
  UpdateStatus() {
    for (var i = 0; i < this.users.length; i++) {   // Looping through list of Network
      this.users[i].status = "Send Request";

      for (var j = 0; j < this.friendsrequest.length; j++) {   // Looping through list of Friends

        if (((this.users[i].id == this.friendsrequest[j].userId) &&
          (this.currentUser._id == this.friendsrequest[j].friendId)) ||
          ((this.users[i].id == this.friendsrequest[j].friendId) &&
            (this.currentUser._id == this.friendsrequest[j].userId))) {

          this.users[i].status = this.friendsrequest[j].status;
          this.users[i].friendrequestId = this.friendsrequest[j]._id;

          // Accept Friend Request 
          if ((this.currentUser._id == this.friendsrequest[j].friendId) &&
            (this.friendsrequest[j].status == "Request Pending")) {
            this.users[i].status = "Accept Friend Request"
          }

        }

      }

    }
  }
  getUserPhotoImage(Id, i) {

    this.filesService.getFilePhotoOrImageById(Id)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.createImageFromBlob(data, i);
        });
  }


  createImageFromBlob(image: Blob, i) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.users[i].photoImg = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
