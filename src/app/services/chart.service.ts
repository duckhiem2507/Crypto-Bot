import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor(private socket: Socket) { }
  
}
