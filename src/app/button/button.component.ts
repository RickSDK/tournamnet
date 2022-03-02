import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent extends BaseComponent implements OnInit {
  @Input('name') name: string = '';
  @Input('disabled') disabled: boolean = false;
  @Input('class') class: string = '';
  @Input('icon') icon: string = '';
  @Input('label') label: string = '';
  @Input('butStyle') butStyle: number = 0;
  public buttonObj: any;
  public styleNum: number = 1;

  constructor() { super(); }

  ngOnInit(): void {
    if (!this.label)
      this.label = '';
    this.buttonObj = {}
    this.styleNum = (this.butStyle > 0) ? this.butStyle : 1;
  }

}
