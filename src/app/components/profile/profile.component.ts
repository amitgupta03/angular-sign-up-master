import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { format } from 'path';
import { switchMap, tap } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { UsersService } from 'src/app/services/users.service';

export interface UserElement {
  id?: number;
  name: string;
  age: number;
  dob: string;
}

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;

  displayedColumns: string[] = ['name', 'age', 'dob'];
  dataSource: UserElement[] = [];

  profileForm = new FormGroup({
    //uid: new FormControl(''),
    displayName: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
  });

  constructor(
    private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.usersService.currentUserProfile$
      .pipe(untilDestroyed(this), tap(console.log))
      .subscribe((user) => {
        this.dataSource = [...user.userList];
      });
  }

  get name() {
    return this.profileForm.get('name');
  }

  get age() {
    return this.profileForm.get('age');
  }

  get dob() {
    return this.profileForm.get('dob');
  }

  uploadFile(event: any, { uid }: ProfileUser) {
    this.imageUploadService
      .uploadImage(event.target.files[0], `images/profile/${uid}`)
      .pipe(
        this.toast.observe({
          loading: 'Uploading profile image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        }),
        switchMap((photoURL) =>
          this.usersService.updateUser({
            uid,
            photoURL,
          })
        )
      )
      .subscribe();
  }

  saveProfile(user: any) {
    const profileData = { ...this.profileForm.value, uid: user.uid, userList: this.dataSource };
    this.usersService
      .updateUser(profileData)
      .pipe(
        this.toast.observe({
          loading: 'Saving profile data...',
          success: 'Profile updated successfully',
          error: 'There was an error in updating the profile',
        })
      )
      .subscribe();
  }

  addMember() {
    if (this.profileForm.valid) {
      let dateOfBirth = this.formatDate(this.profileForm.value.dob)
      this.dataSource.push({ name: this.profileForm.value.name, age: this.profileForm.value.age, dob: dateOfBirth })
      this.dataSource = [...this.dataSource];
      this.profileForm.reset();
    } else {
      return
    }

  }

  formatDate(date: any) {
    let d = new Date(date),
      month = ("0" + (d.getMonth() + 1)).slice(-2),
      day = ("0" + d.getDate()).slice(-2);
    return [d.getFullYear(), month, day].join("/");
  }
}
