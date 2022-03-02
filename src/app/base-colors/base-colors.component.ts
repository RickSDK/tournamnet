import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-colors',
  templateUrl: './base-colors.component.html',
  styleUrls: ['./base-colors.component.scss']
})
export class BaseColorsComponent implements OnInit {
  public lightColor: string;
  public darkColor: string;
  public navBarColor: string;
  public grayColor: string;

  // 1 = light color
  // 2 = dark color
  // 3 = navbar color
  // 4 = gray color
  // 5 = red color

  constructor() { this.loadColors(); }

  ngOnInit(): void {
  }
  loadColors() {
    this.lightColor = this.geLightColor();
    this.darkColor = this.getDarkColor();
    this.navBarColor = this.getNavBarColor();
    this.grayColor = this.getGrayColor();
  }
  ngStyleIcon(num: number) {
    return { 'color': this.geLightColor() };
  }
  geLightColor() {
    return localStorage.lightColor || '#869397';
  }
  getDarkColor() {
    return localStorage.darkColor || '#003594';
  }
  getNavBarColor() {
    return localStorage.navBarColor || '#041E42';
  }
  getGrayColor() {
    return localStorage.grayColor || '#7F9695';
  }
  ngStyleSegment(num: number, buttonIdx: number, formDisabledFlg = false) {
    if (formDisabledFlg)
      return this.ngStyleButton(1, true);
    if (num == buttonIdx)
      return this.ngStyleButton(2);
    else
      return this.ngStyleButton(1);
  }
  ngStyleButton(num: number, disabledFlg: boolean = false, hover = false, clicked = false) {
    if (disabledFlg)
      return { 'background-color': '#777', 'color': '#999' };
    if (clicked)
      return { 'background-color': 'black', 'color': 'white' };
    if (hover)
      return { 'background-color': 'white', 'color': 'black' };
    if (num == 1) // light colored
      return { 'background-color': this.geLightColor(), 'color': 'black' };
    if (num == 2) // dark colored
      return { 'background-color': this.getDarkColor(), 'color': 'white' };
    if (num == 3) //navbar
      return { 'background-color': this.getNavBarColor(), 'color': 'white' };
    if (num == 4) //gray
      return { 'background-color':this.getGrayColor(), 'color': 'black' };
    if (num == 5) //red
      return { 'background-color': 'red', 'color': 'white' };
  }

}
