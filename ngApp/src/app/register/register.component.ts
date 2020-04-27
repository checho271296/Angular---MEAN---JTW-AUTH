import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router'; 
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerUserData = {
    "name": "",
    "lastname1" : "",
    "lastname2" : "",
    "birthday" :  "",
    "email": "",
    "password": ""
  };
  errMessage = ""
  err = false
  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit(): void {
  }
  
  registerUser(){
    
    this._auth.register(this.registerUserData)
      .subscribe(
          res => {
            
            console.log(res)
            localStorage.setItem('token',res.token)
            localStorage.setItem('_id',res.user._id)
            this._router.navigate(['/home'])
          },
          err => {
              this.err = !this.err
              this.errMessage = err.error.text
              
          }       
      )
    
  }

}
