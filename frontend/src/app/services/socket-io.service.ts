import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {io,Socket} from 'socket.io-client'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  socket:Socket
  constructor() {
    this.socket = io(environment.SOCKET_URL,{transports:['websocket','polling','flashsocket']});
  }


  listener():Observable<any> {
    return new Observable<any>(observer =>{
      this.socket.on('product',(data)=>{
        observer.next(data);
      })
      return ()=>{
        this.socket.disconnect();
      }
    });
  }
}
