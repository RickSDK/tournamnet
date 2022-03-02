import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

declare var $: any;

@Component({
  selector: 'app-info-popup',
  templateUrl: './info-popup.component.html',
  styleUrls: ['./info-popup.component.scss']
})
export class InfoPopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public message: string = 'm1';
  public message2: string = 'm2';
  constructor() { super(); }

  ngOnInit(): void {
  }
  show(message: string) {
    this.message = message;
    $('#infoModal').modal();
  }
  okButtonPressed() {
    this.closeModal('#infoModal');
    this.messageEvent.emit('ok');
  }
}
