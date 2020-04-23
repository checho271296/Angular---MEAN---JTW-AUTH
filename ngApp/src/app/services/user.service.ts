import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _profile = "http://localhost:3000/api/profile/"
  constructor(private http: HttpClient) { }

  getUserInfo(_id: String){
    return this.http.get(this._profile+`${_id}`)
  }

  updateUser(_id :String,user){
    return this.http.put(this._profile+`${_id}`,user)
  }
  
}
