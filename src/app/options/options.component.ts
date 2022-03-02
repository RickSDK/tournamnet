import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent extends BaseComponent implements OnInit {
  public currentTheme: any = {lightColor: '', darkColor: '', navBarColor: '', grayColor: ''};
  public colorThemeName = localStorage.colorThemeName || 'Default Theme';

  public types = ['NFL', 'NBA', 'MLB', 'NHL', 'NCAA', 'MLS'];
  public themes = [
    { type: '-1', name: 'Default Theme', lightColor: '#e6e15c', darkColor: '#228822', navBarColor: '#006600', grayColor: '#bbbbbb' },
    { type: '0', name: 'Arizona Cardinals', lightColor: '#FFB612', darkColor: '#97233F', navBarColor: '#000000', grayColor: '#bbbbbb' },
    { type: '0', name: 'Carolina Panthers', lightColor: '#0085CA', darkColor: '#101820', navBarColor: '#000000', grayColor: '#BFC0BF' },
    { type: '0', name: 'Green Bay Packers', lightColor: '#FFB612', darkColor: '#203731', navBarColor: '#203731', grayColor: '#bbbbbb' },
    { type: '0', name: 'Seattle Seahawks', lightColor: '#69BE28', darkColor: '#002244', navBarColor: '#002244', grayColor: '#A5acaf' },
    { type: '0', name: 'Jacksonville Jaguars', lightColor: '#D7A22A', darkColor: '#006778', navBarColor: '#101820', grayColor: '#9F792C' },
    { type: '0', name: 'San Francisco 49ers', lightColor: '#B3995D', darkColor: '#AA0000', navBarColor: '#000000', grayColor: '#bbbbbb' },
    { type: '0', name: 'Dallas Cowboys', lightColor: '#869397', darkColor: '#003594', navBarColor: '#041E42', grayColor: '#7F9695' },
    { type: '0', name: 'Philadelphia Eagles', lightColor: '#A5ACAF', darkColor: '#004C54', navBarColor: '#000000', grayColor: '#ACC0C6' },
    { type: '0', name: 'Pittsburgh Steelers', lightColor: '#FFB612', darkColor: '#003087', navBarColor: '#101820', grayColor: '#a5acaf' },
    { type: '0', name: 'Washington Redskins', lightColor: '#FFB612', darkColor: '#773141', navBarColor: '#000000', grayColor: '#a5acaf' },
    { type: '1', name: 'Phoenix Suns', lightColor: '#e56020', darkColor: '#1d1160', navBarColor: '#000000', grayColor: '#63727A' },
    { type: '1', name: 'Los Angeles Lakers', lightColor: '#FDB927', darkColor: '#552583', navBarColor: '#000000', grayColor: '#bbbbbb' },
    { type: '1', name: 'Golden State Warriors', lightColor: '#ffc72c', darkColor: '#1D428A', navBarColor: '#26282A', grayColor: '#63727A' },
    { type: '1', name: 'Miami Heat', lightColor: '#F9A01B', darkColor: '#98002E', navBarColor: '#000000', grayColor: '#63727A' },
    { type: '1', name: 'Boston Celtics', lightColor: '#BA9653', darkColor: '#007A33', navBarColor: '#963821', grayColor: '#E59E6D' },
    { type: '1', name: 'Denver Nuggets', lightColor: '#FEC524', darkColor: '#8B2131', navBarColor: '#0E2240', grayColor: '#bbbbbb' },
    { type: '2', name: 'Seattle Mariners', lightColor: '#C4CED4', darkColor: '#005C5C', navBarColor: '#0C2C56', grayColor: '#C4CED4' },
    { type: '2', name: 'Boston Red Sox', lightColor: '#BD3039', darkColor: '#0C2340', navBarColor: '#0C2340', grayColor: '#bbbbbb' },
    { type: '2', name: 'Houston Astros', lightColor: '#F4911E', darkColor: '#002D62', navBarColor: '#EB6E1F', grayColor: '#bbbbbb' },
    { type: '2', name: 'Oakland Athletics', lightColor: '#EFB21E', darkColor: '#003831', navBarColor: '#003831', grayColor: '#a2aaad' },
    { type: '2', name: 'Miami Marlins', lightColor: '#00A3E0', darkColor: '#EF3340', navBarColor: '#000000', grayColor: '#41748D' },
    { type: '2', name: 'Arizona Diamondbacks', lightColor: '#E3D4AD', darkColor: '#A71930', navBarColor: '#000000', grayColor: '#30CED8' },
    { type: '2', name: 'Colorado Rockies', lightColor: '#C4CED4', darkColor: '#33006F', navBarColor: '#000000', grayColor: '#C4CED4' },
    { type: '3', name: 'Anaheim Ducks', lightColor: '#F47A38', darkColor: '#B9975B', navBarColor: '#000000', grayColor: '#bbbbbb' },
    { type: '3', name: 'Dallas Stars', lightColor: '#8F8F8C', darkColor: '#006847', navBarColor: '#000000', grayColor: '#bbbbbb' },
    { type: '3', name: 'Colorado Avalanche', lightColor: '#A2AAAD', darkColor: '#236192', navBarColor: '#6F263D', grayColor: '#bbbbbb' },
    { type: '3', name: 'New York Islanders', lightColor: '#f47d30', darkColor: '#00539b', navBarColor: '#00539b', grayColor: '#bbbbbb' },
    { type: '4', name: 'Michigan Wolverines', lightColor: '#ffcb05', darkColor: '#00274c', navBarColor: '#00274c', grayColor: '#bbbbbb' },
    { type: '4', name: 'Washington Huskies', lightColor: '#b7a57a', darkColor: '#4B2E83', navBarColor: '#85754d', grayColor: '#bbbbbb' },
    { type: '4', name: 'Florida State Seminoles', lightColor: '#CEB888', darkColor: '#782F40', navBarColor: '#000000', grayColor: '#bbbbbb' },
    { type: '4', name: 'Miami Hurricanes', lightColor: '#F47321', darkColor: '#005030', navBarColor: '#005030', grayColor: '#ffffff' },
    { type: '5', name: 'Austin FC', lightColor: '#00b140', darkColor: '#000000', navBarColor: '#000000', grayColor: '#bbbbbb' },
    { type: '5', name: 'LA Galaxy', lightColor: '#FFD200', darkColor: '#0065A4', navBarColor: '#00245D', grayColor: '#C4C7DC' },
    { type: '5', name: 'Seattle Sounders', lightColor: '#658D1B', darkColor: '#236192', navBarColor: '#1D252D', grayColor: '#bbbbbb' },
    { type: '5', name: 'Houston Dynamo', lightColor: '#92c3f1', darkColor: '#f4911e', navBarColor: '#231F20', grayColor: '#bbbbbb' },
  ]
  constructor() { super() }

  ngOnInit(): void {
    this.loadCurrentTheme();
  }
  chooseTheme(theme: any) {
    console.log(theme);
    localStorage.lightColor = theme.lightColor;
    localStorage.darkColor = theme.darkColor;
    localStorage.navBarColor = theme.navBarColor;
    localStorage.grayColor = theme.grayColor;
    localStorage.colorThemeName = theme.name;
    this.colorThemeName = theme.name;

    this.loadColors()
    this.navBarColor = theme.navBarColor;
    this.loadCurrentTheme();
  }
  loadCurrentTheme() {
    this.currentTheme.lightColor = this.lightColor;
    this.currentTheme.darkColor = this.darkColor;
    this.currentTheme.navBarColor = this.navBarColor;
    this.currentTheme.grayColor = this.grayColor;
  }
  colorPicked($event) {
    if($event.target.id == 'lightColor') {
      localStorage.lightColor = $event.target.value;
    }
    if($event.target.id == 'darkColor') {
      localStorage.darkColor = $event.target.value;
    }
    if($event.target.id == 'navBarColor') {
      localStorage.navBarColor = $event.target.value;
    }
    if($event.target.id == 'grayColor') {
      localStorage.grayColor = $event.target.value;
    }
    this.loadCurrentTheme();
  }

}
