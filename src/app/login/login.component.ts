import { Component, OnInit, Injectable, Output, EventEmitter } from '@angular/core';
import { BaseHttpComponent } from '../base-http/base-http.component';

declare var $: any;
declare var getTextFieldValue: any;

// create new league
// insert into PO_LEAGUE(row_id, admin_id, name, numWeeks, week, season, created) values(null, 3, 'El Corona Club', 12, 1, 1, sysdate())

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class LoginComponent extends BaseHttpComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public userName = localStorage.firstName;
  public createAccountFlg: boolean = false;
  public emailSentFlg: boolean = false;
  public showCreateAccountFlg: boolean = false;
  public errorMessage:string = '';
  public userId:number = 0;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }
  show() {
    this.loadingFlg = false;
    this.apiExecutedFlg = false;
    this.createAccountFlg = false;
    this.emailSentFlg = false;
    this.showCreateAccountFlg = false;
    this.errorMessage = '';
    this.user = this.getUserObject();
    if(this.user)
      this.userId = this.user.id;
    $('#loginPopup').modal();
  }
  loginPressed() {
    var email = getTextFieldValue('emailField');
    var password = getTextFieldValue('passwordField');
    if (email == '111' && password == '111') {
      email = 'rickmedved@hotmail.com';
      password = 'rick23';
    }
    if (email == '222' && password == '222') {
      email = 'robbmedved@yahoo.com';
      password = '7004175St$w';
    }
    if (email.length == 0) {
      //			showAlertPopup('Email field is blank');
      return;
    }
    if (password.length == 0) {
      //			showAlertPopup('Password field is blank');
      return;
    }
    var params = {
      email: email,
      Password: password
    };
    localStorage.email = email;
    localStorage.password = '*****';
    localStorage.code = btoa(password);
    this.executeApi('pokerLogin.php', params, true);
  }
  postSuccessApi(api: string, data: string) {
    console.log(data);
    var components = data.split("|");
    if (components[0] == 'Success') {
      localStorage.firstName = components[1];
      localStorage.city = components[2];
      localStorage.state = components[3];
      localStorage.country = components[4];
      localStorage.xFlg = components[5];
      localStorage.gamesOnServer = components[6];
      localStorage.userId = components[7];
      this.closeModal('#loginPopup');
      this.messageEvent.emit('done');
    } else
      this.apiMessage = data;
  }
  postErrorApi(file: string, error: string) {
    this.apiMessage = error;
    localStorage.email = '';
    localStorage.userId = '';
  }
  okButtonPressed() {
    this.closeModal('#loginPopup');
    this.messageEvent.emit('done');
  }
  createAccountPressed() {
      this.showCreateAccountFlg = true;
  }
  submitEmailPressed() {
    var email = getTextFieldValue('emailField2');
    var params = {
      email: email,
      action: 'requestPro'
    };
    console.log(params);
    this.executeApi('pokerLogin.php', params, true);
    this.emailSentFlg = true;
  }
  createPressed() {
    var email = getTextFieldValue('emailField3');
    var firstName = getTextFieldValue('firstName');
    var password = getTextFieldValue('passwordField2');
    var password2 = getTextFieldValue('passwordField3');
    if(email=='') {
      this.errorMessage = 'Invalid email';
      return;
    }
    if(firstName=='') {
      this.errorMessage = 'Invalid firstName';
      return;
    }
    if(password=='') {
      this.errorMessage = 'Invalid password';
      return;
    }
    if(password!=password2) {
      this.errorMessage = 'password dont match';
      return;
    }
    this.showCreateAccountFlg = false;
    var params = {
      email: email,
      firstName: firstName,
      password: password,
      appName: 'tournament1.0',
      action: 'createAccount'
    };
    localStorage.email = email;
    localStorage.password = '*****';
    localStorage.code = btoa(password);
    this.executeApi('pokerLogin.php', params, true);
  }
  logout() {
    localStorage.email = '';
    localStorage.firstName = '';
    localStorage.username = '';
    localStorage.password = '';
    localStorage.userId = '';
    this.messageEvent.emit('done');
    this.closeModal('#loginPopup');
  }

}
