import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-shell',
  templateUrl: './page-shell.component.html',
  styleUrls: ['./page-shell.component.scss']
})
export class PageShellComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  @Input('navTitle') navTitle: string = 'navTitle';
  @Input('icon') icon: string = '';
  @Input('rButton') rButton: string = '';
  @Input('lButton') lButton: string = '';

  constructor(private _location: Location) { super(); }

  ngOnInit(): void {
  }
  backButtonClicked() {
    this._location.back();
  }
  leftButtonPressed() {
    this.messageEvent.emit('');
  }
  rightButtonPressed() {
    this.messageEvent.emit('');
  }
}
