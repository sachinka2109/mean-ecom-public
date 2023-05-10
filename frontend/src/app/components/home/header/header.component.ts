import { Component, EventEmitter, Output} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() adminPanel = new EventEmitter();
  searchResult = [];
  searchText;
  showAdminPanel = false;
  constructor(
    private router:Router,
    private authService:AuthService,
    private userService:UserService
  ){}
  isLogin = false;
  subscription:Subscription

  get token() {
    return localStorage.getItem('token');
  }

  get userName() {
    return localStorage.getItem('userName');
  }

  get admin() {
   return JSON.parse(localStorage.getItem('userAdmin'));
  }

  get seller() {
    return JSON.parse(localStorage.getItem('userSeller'));
  }


  // onSellerPage(){
  //   this.router.navigate(['/admin'])
  // }

  onMainAdmin(){
    this.adminPanel.emit('clicked');
  }

  onLogout() {
    if(confirm('Are you sure you want to logout?')){
      this.authService.logoutHandler();
      this.router.navigate(['/auth']);
    }
  }
}
