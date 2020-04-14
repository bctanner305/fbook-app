import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../_models/user'
import { AuthenticationService } from '../_services/authentication.service';
import { PostService } from '../_services/post.service'
import { AlertService } from '../_services/alert.service';
import { FilesService } from '../_services/files.service';
import { Post } from '../_models/post';
import { Friend } from '../_models/friend';
import { FbookcommonComponent } from '../fbookcommon/fbookcommon.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(FbookcommonComponent, { static: false }) fbookcommonComponent: FbookcommonComponent;
  currentUser: User;
  homeForm: FormGroup;
  newpost: Post;
  posts = [];
  potentialposts = [];
  post: string;
  posttext: string;
  myfriends: Friend[];
  potentialfriends: Friend[];
  selectedFile: File;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private filesService: FilesService,
    private postService: PostService) {

  }

  ngOnInit() {
    this.homeForm = this.formBuilder.group({
      post: ['', Validators.required]
    });

    // Obtain Local Storage (currentUser)  
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Clear the Alert Message.
    this.alertService.clear();

    // Get all of the posts  
    this.getAllPosts();

  }

  get f() { return this.homeForm.controls; }

  onSubmit() {

    this.alertService.clear();

    // Stop here if form is invalid
    if (this.homeForm.invalid) {
      return;
    }

    // Create the Post Request.
    this.newpost = new Post()
    this.newpost.post = this.f.post.value;
    this.newpost.userId = this.currentUser._id;
    this.newpost.userName = this.currentUser.firstName + " " + this.currentUser.lastName;
    this.newpost.userPhotoId = this.currentUser.photoId;
    this.newpost.postImageId = "";
    this.newpost.isActive = this.currentUser.isActive;
    this.newpost.isAdmin = this.currentUser.isAdmin;
    this.newpost.profession = "President";  // TODO  - this should be changed, in the 
    // next Release.

    // Call the service (postService) to submit the Post Request.
    this.callPostServiceCreatePost(this.newpost);

  }

  // Call the Post Service to Create a Poat (either a text Post or a Image)
  callPostServiceCreatePost(post: Post) {
    this.postService.createpost(this.newpost)
      .pipe(first())
      .subscribe(
        data => {

          // Update the Child Component for Post Count (fbookcommonComponent)
          this.fbookcommonComponent.getPostsCount();

          // RE-LOAD all of the posts  
          this.getAllPosts();

          // display a Success Message
          this.alertService.success("Post created successfully");
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");

        });

  }

  getUserPostImage(Id, i) {

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
      this.potentialposts[i].postImage = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  // Call the service (postService) to obtain a list of all of the
  // Posts 
  getAllPosts() {

    this.posts = [];
    this.postService.getPosts()
      .pipe(first())
      .subscribe(
        data => {
          this.potentialposts = data;

          // Load all post  pictures
          for (let i = 0; i < this.potentialposts.length; i++) {

            // Only include isActive Posts. 			
            if (this.potentialposts[i].isActive) {

              // Check if they have an image. if so then retrieve it.
              if (this.potentialposts[i].postImageId) {
                this.getUserPostImage(this.potentialposts[i].postImageId, i)
              }

              this.posts.push(this.potentialposts[i]);
            }

          }
        },
        error => {
          this.alertService.error("Error retrieving Data. Please re-login and try again!");

        });
  }


  // A new image is to be posted
  onPostImage(event) {

    // Clean any outstanding alert messages.	
    this.alertService.clear();

    this.selectedFile = event.target.files[0]
    const uploadData = new FormData();
    uploadData.append('picture', this.selectedFile, this.selectedFile.name);
    this.filesService.uploadfiles(uploadData).pipe(first())
      .subscribe(
        (data: any) => {

          // Create the Post Request.
          this.newpost = new Post()
          this.newpost.post = '';
          this.newpost.userId = this.currentUser._id;
          this.newpost.userName = this.currentUser.firstName + " " + this.currentUser.lastName;
          this.newpost.userPhotoId = '';
          this.newpost.postImageId = data.uploadId;
          this.newpost.isActive = this.currentUser.isActive;
          this.newpost.isAdmin = this.currentUser.isAdmin;
          this.newpost.profession = "President";  // TODO  - this should be changed, in the 
          // next Release.

          // Call the service (postService) to submit the Post Image.
          this.callPostServiceCreatePost(this.newpost);

          this.alertService.success("Your new Post Image has been posted.");

        },
        error => {
          this.alertService.error("Error retrieving Data. ");

        });
  }

  // Sort the Posts, so that on the screen, the most recent posts, will 
  // appear at the top of the screen
  get sortPosts() {
    return this.posts.sort((a, b) => {
      return <any>new Date(b.createdDate) - <any>new Date(a.createdDate);
    });
  }
}
