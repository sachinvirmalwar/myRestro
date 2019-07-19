import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeaders(): Observable<Leader[]> {

    return of (LEADERS).pipe(delay(2000));
    // return Promise.resolve(LEADERS);
    // return new Promise(resolve => {
    //   //Simulate server latency with 2 second delay
    //   setTimeout(() => resolve(LEADERS),2000);
    // });
  }

  getLeader(id: string): Observable<Leader> {
    return of (LEADERS.filter((Leader) => (Leader.id === id))[0]).pipe(delay(2000));

    // return Promise.resolve(LEADERS.filter((Leader) => (Leader.id === id))[0]);
    // return new Promise(resolve => {
    //   //Simulate server latency with 2 second delay
    //   setTimeout(() => resolve(LEADERS.filter((Leader) => (Leader.id === id))[0]),2000);
    // });
  }

  getFeaturedLeader(): Observable<Leader> {
    return of (LEADERS.filter((Leader) => Leader.featured)[0]).pipe(delay(2000));
    // return Promise.resolve(LEADERS.filter((Leader) => Leader.featured)[0]);
    // return new Promise(resolve => {
    //   //Simulate server latency with 2 second delay
    //   setTimeout(() => resolve(LEADERS.filter((Leader) => Leader.featured)[0]),2000);
    // });
  }
}
