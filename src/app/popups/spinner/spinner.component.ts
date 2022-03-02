import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

declare var $: any;

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent extends BaseComponent implements OnInit {
  public apiMessage: string;
  public loadingFlg: boolean;
  public loadingMessage:string = 'Loading...';

  constructor() { super(); }

  ngOnInit(): void {
  }
  show() {
    this.loadingFlg = true;
    this.apiMessage = '';
    $('#spinnerPopup').modal();
  }
  setApiMessage(apiMessage: string) {
    this.loadingFlg = false;
    this.apiMessage = apiMessage;
  }
  setLoadingMessage(message: string) {
    this.loadingMessage = message;
  }
  close() {
    this.loadingFlg = false;
    this.closeModal('#spinnerPopup')
  }
}
