import { HttpInterceptor,HttpRequest,HttpHandler, HttpEvent,HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, finalize, tap, throwError } from "rxjs";
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from "@angular/router";
import { LoaderService } from "./components/shared/loader.service";


@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toast: HotToastService,private router:Router,public loaderService:LoaderService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    return next.handle(req).pipe(
      tap((event:HttpResponse<any>)=> {
        if (event instanceof HttpResponse) {
          if(event.body.success && event.body.message) {
            this.toast.success(event.body.message);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "There was an error";
        if(error.error.message) {
          errorMessage = error.error.message;
        }
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            localStorage.removeItem('token');
            this.router.navigate(['/auth']);
          }
        }
        this.toast.error(errorMessage)
        return throwError(() => errorMessage);
      }),
      finalize(()=> {
        this.loaderService.hide();
      })
    )
  }
}
