import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseHttpComponent } from '../base-http/base-http.component';
import { Player } from '../classes/player';
import { LoginComponent } from '../login/login.component';
import { EditLeaguePopupComponent } from '../edit-league-popup/edit-league-popup.component';

declare var numberVal: any;

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent extends BaseHttpComponent implements OnInit {
  @ViewChild(LoginComponent) loginComponent: LoginComponent;
  @ViewChild(EditLeaguePopupComponent) editLeaguePopupComponent: EditLeaguePopupComponent;
  public local: string;
  public seasonList = [];
  public columnHeaders = [
    'Name', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12', 'Fin', 'G', 'Points', 'Money', '1st '
  ]
  constructor() { super(); }

  ngOnInit(): void {
    this.user = this.getUserObject();
    console.log('user', this.user);
    this.getLeageData(0);
  }
  gotoSeason(season: number) {
    this.season = season;
    this.getLeageData(season);
  }
  getLeageData(season: number) {
    this.season = season;
    this.loadingFlg = true;
    var params = {
      action: 'getLeague',
      league_id: '1',
      season: season
    };
    this.executeApi('leagueApi.php', params, true);
  }
  postSuccessApi(file: string, data: string) {
    //console.log('postSuccessApi!!', data);
    this.loadingFlg = false;
    if (!data)
      return;

    var parts = data.split('<a>');
    
    if (parts.length > 1) {
      this.league = this.leagueDataFromLine(parts[0]);
      if (this.season == 0)
        this.season = this.league.season;
      this.data = this.seasonDataFromLine(parts[1]);
      if (this.league) {
        console.log('league', this.league);
        this.seasonList = [];
        for (var x = 1; x <= this.league.numSeasons; x++)
          this.seasonList.push(x);

        localStorage.league = JSON.stringify(this.league);
      }
      if (this.data) {
        console.log('seasonData', this.data);
        localStorage.seasonData = JSON.stringify(this.data);
        this.processLeagueData();
      }
    }
  }
  leagueDataFromLine(line: string) {
    var c = line.split('|');
    var season = parseInt(c[3]);
    var numWeeks = parseInt(c[4]);
    var week = parseInt(c[5]);
    var currentSeason = parseInt(c[7]);
    var numSeasons = parseInt(c[7]);
    if (season != currentSeason)
      week = numWeeks + 1;
    return { id: parseInt(c[1]), name: c[2], season: parseInt(c[3]), numWeeks: parseInt(c[4]), week: week, status: c[6], currentSeason: c[7], numSeasons: numSeasons }
  }
  seasonDataFromLine(line: string) {
    var lines = line.split('<b>');
    var players = [];
    var playerHash = {};
    lines.forEach(line => {
      if (line && line.length > 10) {
        var c = line.split('|');
        var awards = c[11].split(':');
        var rebuys = numberVal(c[10]);
        var game = { week: numberVal(c[6]), points: numberVal(c[7]), money: numberVal(c[8]), wins: numberVal(c[9]), rebuys: rebuys }
        var player = { name: c[1], id: c[2], username: c[3], league: c[4], season: c[5], games: [game], awards: awards }
        if (playerHash[player.name]) {
          players.forEach(p => {
            if (p.name === player.name)
              p.games.push(game);
          });
        } else {
          playerHash[player.name] = true;
          players.push(player);
        }
      }
    });
    return players;
  }
  processLeagueData() {
    var displayData = [];
    if (this.league && this.league.numWeeks) {
      var numWeeks = this.league.numWeeks;
      var week = this.league.week;
      console.log('hey!', this.league, week);
      this.data.forEach(element => {
        displayData.push(new Player(element, numWeeks, week))
      });
    }

    this.displayData = displayData;
    console.log('displayData', this.displayData);
    this.sortTheData();
    console.log('done sorting');

  }
  refreshUser(msg: string) {
    this.user = this.getUserObject();
    console.log('refreshUser', this.user);
  }
  sortby(sortbyCol: string) {
    if (sortbyCol === this.sortbyCol)
      this.sortByAscending = !this.sortByAscending;
    else
      this.sortbyCol = sortbyCol;

    this.sortTheData();
  }
  sortTheData() {
    var val1 = this.sortByAscending ? 1 : -1;
    var val2 = this.sortByAscending ? -1 : 1;
    if (this.sortbyCol == 'Points') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.sortNum > next.sortNum ? val1 : val2;
      });
      if (!this.sortByAscending) {
        let place = 1;
        this.displayData.forEach(record => {
          record.place = place++;
        });
      }
    }
    if (this.sortbyCol == 'G') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.numGames > next.numGames ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'Money') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.money > next.money ? val1 : val2;
      });
    }
    if (this.sortbyCol == '1st ') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.wins > next.wins ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'Name') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.name > next.name ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'W1') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[0].points > next.games[0].points ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'W2') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[1].points > next.games[1].points ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'W3') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[2].points > next.games[2].points ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'W4') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[3].points > next.games[3].points ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'W5') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[4].points > next.games[4].points ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'W6') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[5].points > next.games[5].points ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'W7') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[6].points > next.games[6].points ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'W8') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[7].points > next.games[7].points ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'W9') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[8].points > next.games[8].points ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'W10') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[9].points > next.games[9].points ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'W11') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[10].points > next.games[10].points ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'W12') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[11].points > next.games[11].points ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'Fin') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.games[12].points > next.games[12].points ? val1 : val2;
      });
    }
  }
  ngClassColumn(col: string) {
    if (col.length <= 3)
      return "hidden-sm"
  }
  buttonClicked(msg: string) {
    this.loginComponent.show();
  }
  edit() {
    this.editLeaguePopupComponent.show(this.league.id, this.season, this.league.week);
  }
}
