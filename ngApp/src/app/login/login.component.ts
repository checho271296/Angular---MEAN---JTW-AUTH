import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';             

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginUserData = {"email": "","password": ""};
  constructor(private _auth : AuthService, private _router: Router) { }
  errMessage = ""
  ngOnInit(): void {
  }

  loginUser(){

    this._auth.login(this.loginUserData)
      .subscribe( 
        res => {
        console.log(res)
        localStorage.setItem('token',res.token)
        localStorage.setItem('_id',res.user._id)
        this._router.navigate(['/home'])
      },  
        
        err =>{
          this.errMessage = err.error
          
          console.log(err)          
        }
      )
  }
}
