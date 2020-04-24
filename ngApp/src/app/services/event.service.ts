import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private _eventsUrl = "http://localhost:3000/api/events"  ;
  private _specialEventsUrl = "http://localhost:3000/api/special/" ; 
  
  constructor(private http : HttpClient) { }

  getEvents(){
    return this.http.get<any>(this._eventsUrl)
  }

  getSpecialEvents(idUser:String){
    return this.http.get<any>(this._specialEventsUrl+`${idUser}`)
  }

  deleteEvent(eventName: any){
    return this.http.delete<any>(this._specialEventsUrl+`${eventName.name}`)
  
  }

  createEvent(idUser:String,event){
    return  this.http.post<any>(this._specialEventsUrl+`${idUser}`,event)
  }

  
}
