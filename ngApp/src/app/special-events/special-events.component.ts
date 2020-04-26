import { Component, OnInit } from '@angular/core';
import {EventService} from '../services/event.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-special-events',
  templateUrl: './special-events.component.html',
  styleUrls: ['./special-events.component.scss']
})
export class SpecialEventsComponent implements OnInit {
  specialEvents = []
  idUser = ""
  eventData = {
    "name": "",
    "description": "",
    "idUser" : this.authService.getUser(),
    "date": ""
  }
  constructor(private _eventService: EventService,private _router: Router,private route: ActivatedRoute,public authService : AuthService) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(){
    this.route.params.subscribe(params =>{
      this._eventService.getSpecialEvents(params['idUser'])
        .subscribe(
          res => {
            this.specialEvents = res
            console.log("ASR",this.specialEvents)},
          err => {
            if(err instanceof HttpErrorResponse){
              if( err.status === 401){
                this._router.navigate(['/login'])
              }
            }
          } 
        );
    })
  }

  deleteEvent(event:any){
    let eventToDelete = this.specialEvents.find(element => element.name === event)
    this._eventService.deleteEvent(eventToDelete._id)
      .subscribe(
        res => this.getEvents()
        ,
        err => {
          if(err instanceof HttpErrorResponse){
            if( err.status === 401){
              console.log(err);  
            }
          }
        } 
      );
  }

  createEvent(){
    this.route.params.subscribe(params =>{
      this._eventService.createEvent(params['idUser'],this.eventData)
        .subscribe(
          res => {
            this.getEvents()
            console.log(res)
          },
          err => console.log(err)
        )
    })
    this.eventData = {
      "name": "",
      "description": "",
      "idUser" : this.authService.getUser(),
      "date": ""
    }
  }
}
