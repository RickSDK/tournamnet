import { Component, OnInit } from '@angular/core';
import { BaseColorsComponent } from '../base-colors/base-colors.component';

declare var $:any;

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent extends BaseColorsComponent implements OnInit {
  public title = 'title';
  public buttonIdx = 0;
  public user:any;

  constructor() { super();  }

  ngOnInit(): void {
  }
  ngStyleGame(game: any) {
    if (game.wins > 0)
      return { 'background-color': 'green', 'color': 'white' }
    if (game.money > 0)
      return { 'background-color': '#ccffcc', 'color': 'black' }
  }
  ngClassSegment(num: number, buttonIdx: number) {
    if (num == buttonIdx)
      return 'btn btn-warning segmentButton roundButton';
    else
      return 'btn btn-success segmentButton roundButton';
  }
  openModal(id: string) {
    $(id).modal();
  }
  closeModal(id: string) {
    $(id).modal('hide');
  }
  getUserObject() {
    return getUserObject();
  }
}
function getUserObject() {
  return { id: localStorage.userId, username: localStorage.username, code: localStorage.code, email: localStorage.email}
}