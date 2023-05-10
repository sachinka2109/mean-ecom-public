import { LocationStrategy } from '@angular/common';
import { Component, OnInit ,ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from './components/shared/loader.service';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterContentChecked{
  mainAdmin:boolean = false;
  loading$ = this.loaderService.loading$;
  constructor(
    private userService:UserService,
    private route:ActivatedRoute,
    private url:LocationStrategy,
    private cdRef: ChangeDetectorRef,
    public loaderService:LoaderService
    ){}

  ngOnInit(): void {

  }

  ngAfterContentChecked() {
    this.loading$ = this.loaderService.loading$;
    this.cdRef.detectChanges();
  }

  onUserPanel(event){
    this.mainAdmin = false;
  }

  onAdminPanel(event){
    this.mainAdmin = true;
  }
}
