import { Component, OnInit } from '@angular/core';
import {EventService} from '../services/event.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-special-events',
  templateUrl: './special-events.component.html',
  styleUrls: ['./special-events.component.scss']
})
export class SpecialEventsComponent implements OnInit {
  specialEvents = []
  idUser = ""
  constructor(private _eventService: EventService,private _router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(){
    this.route.params.subscribe(params =>{
      this._eventService.getSpecialEvents(params['idUser'])
        .subscribe(
          res => this.specialEvents = res,
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

  deleteEvent(event:String){
    let eventToDelete = this.specialEvents.find(element => element.name === event)
    this._eventService.deleteEvent(eventToDelete)
      .subscribe(
        res => this.getEvents()
        ,
        err => {
          if(err instanceof HttpErrorResponse){
            if( err.status === 401){
              this._router.navigate(['/login'])
            }
          }
        } 
      );
  }

}
