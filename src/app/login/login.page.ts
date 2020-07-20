import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string;
  password: string;
  btnDisabled = true;

  constructor(private router: Router,
              private auth: AuthService,
              private toastController: ToastController) { }

  ngOnInit() {
    this.username = '';
    this.password = '';
  }

  onTextEdit() {
    if (this.username.length > 3 && this.password.length > 4){
      this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }
  }

  async userLogIn() {
    const status = this.auth.checkLogin(this.username, this.password);
    if (status){
      this.router.navigate(['/home']);
    } else {
      const toast = await this.toastController.create({
        message: 'Invalid username or password.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
      this.username = '';
      this.password = '';
    }
  }
}
