import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http:HttpClient) { }


  getHeaders(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
    });
    return headers;
  }

  get(url:string){
    return this.http.get(url,{
      headers: this.getHeaders()
    });
  }

  put(url:string,data:any) {
    return this.http.put(url,data,{ headers: this.getHeaders() });
  }

  post(url:string,data:any){
    return this.http.post(url,data,{ headers: this.getHeaders() });
  }
}
