import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const BACKEND_URL = 'http://localhost:3000/api/channel';


@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(
    private http: HttpClient,
  ) { }

  getChannels(): Observable<any[]> {
    return this.http.get<any[]>(BACKEND_URL);
  }
}
