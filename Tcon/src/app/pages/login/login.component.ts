import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/sharepage/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {

  }
  constructor(public authService: AuthService){}
}
