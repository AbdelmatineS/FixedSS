import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const STORAGE_KEY = 'myevents';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface CalEvent {
  id:number | null;
  title: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
}

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private storage: Storage,
    ) { }

  async init () {
    await this.storage.create();
  }

  async getData(){
    return await this.storage.get(STORAGE_KEY) || [];
  }

  async addData(item: CalEvent) {
    const data = await this.getData();
    data.push(item);
    return this.storage.set(STORAGE_KEY, data);
  }

  
}
