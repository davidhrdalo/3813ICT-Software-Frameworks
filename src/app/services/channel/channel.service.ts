import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const BACKEND_URL = 'http://localhost:3000/api/channel';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(private http: HttpClient) {}

  getChannels(): Observable<any[]> {
    return this.http.get<any[]>(BACKEND_URL);
  }

  getChannelsByGroupId(groupId: number): Observable<any[]> {
    return this.getChannels().pipe(
      map((channels) =>
        channels.filter((channel) => channel.groupId === groupId)
      )
    );
  }
}
