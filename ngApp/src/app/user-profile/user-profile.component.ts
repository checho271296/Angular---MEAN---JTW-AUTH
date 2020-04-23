import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  registerUserData = {
    "_id" : "",
    "name": "",
    "lastname1" : "",
    "lastname2" : "",
    "birthday" :  "",
    "email": "",
    "password": "",
    "__v": ""
  };

  constructor(private userService: UserService,private route: ActivatedRoute) { }

  public updateFlag = false;
  
  ngOnInit(): void {
    this.getInfo()
  }

  getInfo(){
    this.route.params.subscribe(parms => {
      this.userService.getUserInfo(parms['_id'])
        .subscribe(
          (res: any) => {
            this.registerUserData = res,
            console.log(this.registerUserData)},
          err => console.log(err)
        )
    })
  }

  chageStatus(){
    this.updateFlag = !this.updateFlag
  }

  updateUser(){
    this.updateFlag = !this.updateFlag
    this.route.params.subscribe(params =>{
      this.userService.updateUser(params['_id'],this.registerUserData)
        .subscribe((res:any) => {
          console.log(res);
        },
        err => console.log(err))
    })      
  } 
}
