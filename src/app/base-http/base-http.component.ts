import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { SpinnerComponent } from '../popups/spinner/spinner.component';
import { InfoPopupComponent } from '../popups/info-popup/info-popup.component';

declare var $: any;
declare var getPostDataFromObj: any;

//---------------------------------------
//  Useage: add these
// <app-info-popup #infoModal></app-info-popup>
// <app-spinner #spinnerPopup></app-spinner>
//---------------------------------------

@Component({
  selector: 'app-base-http',
  templateUrl: './base-http.component.html',
  styleUrls: ['./base-http.component.scss']
})
export class BaseHttpComponent extends BaseComponent implements OnInit {
  @ViewChild(SpinnerComponent) spinnerComponent: SpinnerComponent = new (SpinnerComponent);
  @ViewChild(InfoPopupComponent) infoPopupComponent: InfoPopupComponent = new (InfoPopupComponent);

  public apiMessage: string = '';
  public loadingFlg: boolean = false;
  public apiExecutedFlg: boolean = false;
  public displayData: any;
  public sortbyCol = 'Points';
  public sortByAscending = false;
  public league: any;
  public season: number = 1;
  public data: any;
  constructor() { super(); }

  ngOnInit(): void {
  }
  getHostname() {
    return 'https://www.appdigity.com/poker/';
  }
  showAlertPopup(message: string) {
    this.infoPopupComponent.show(message);
  }
  startSpinner() {
    if (this.spinnerComponent)
      this.spinnerComponent.show();
  }
  setApiMessage(message: string) {
    if (this.spinnerComponent)
      this.spinnerComponent.setApiMessage(message);
  }
  setLoadingMessage(message: string) {
    if (this.spinnerComponent)
      this.spinnerComponent.setLoadingMessage(message);
  }
  stopSpinner() {
    if (this.spinnerComponent)
      this.spinnerComponent.close();
  }
  /*uploadNetTrackerData(game: any) {

  }*/
  executeApi(file: string, params: any = null, displaySuccessFlg: boolean = false) {
    if (!params) {
      params =
      {
        Username: localStorage.email,
        code: localStorage.code
      };
    }
    var url = this.getHostname() + file;
    var postData = getPostDataFromObj(params);
    this.loadingFlg = true;
    this.apiExecutedFlg = true;
    //   if (this.spinnerComponent && displaySuccessFlg)
    //    this.spinnerComponent.show();
    fetch(url, postData).then((resp) => resp.text())
      .then((data) => {
        this.loadingFlg = false;
        console.log('bytesXXX', data.length);
        if (this.verifyServerResponse(data)) {
          //this.spinnerComponent.close();
          setTimeout(() => {
            //this.spinnerComponent.close();
          }, 300);
          this.postSuccessApi(file, data);
        } else {
          this.postErrorApi(file, data);
        }
      })
      .catch(error => {
        this.loadingFlg = false;
        this.postErrorApi(file, error);
      });
  }
  verifyServerResponse(data: string) {
    if (data && data.substring(0, 7) == 'Success' || data.length > 380)
      return true;
    else {
      console.log('ERROR! no "Success" found in reply!');
      return false;
    }
  }
  postSuccessApi(file: string, data: string) {
    //    if (this.spinnerComponent)
    //      this.spinnerComponent.setApiMessage('Success!');
    console.log('postSuccessApi');
  }
  postErrorApi(file: string, error: string) {
    if (this.spinnerComponent) {
      this.spinnerComponent.show();
      this.spinnerComponent.setApiMessage(error);
    }

    console.log('postErrorApi', error);
  }
}

