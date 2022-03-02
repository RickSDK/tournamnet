import { Component, OnInit } from '@angular/core';
import { BaseHttpComponent } from '../base-http/base-http.component';
import { Player } from '../classes/player';

declare var numberVal: any;

@Component({
  selector: 'app-view-stats',
  templateUrl: './view-stats.component.html',
  styleUrls: ['./view-stats.component.scss']
})
export class ViewStatsComponent extends BaseHttpComponent implements OnInit {
  public columnHeaders = [
    'Name', 'G', '1st', 'W', 'L', 'Stk', 'Points', 'Money', 'Rby', 'Point Maker', 'Money Maker', 'Wins', 'Rating'
  ];
  public minGames = 4;

  constructor() { super(); }

  ngOnInit(): void {
    this.user = this.getUserObject();
    console.log('user', this.user);
    this.sortbyCol = 'Rating';
    this.getLeageData(0);
  }
  getLeageData(season: number) {
    this.season = season;
    this.loadingFlg = true;
    var params = {
      action: 'getLeagueStats',
      league_id: '1',
      season: season
    };
    this.executeApi('leagueApi.php', params, true);
  }
  postSuccessApi(file: string, data: string) {
    this.loadingFlg = false;
    if (!data)
      return;

    var parts = data.split('<a>');
    if (parts.length > 1) {
      this.league = this.leagueDataFromLine(parts[0]);
      if (this.season == 0)
        this.season = this.league.season;
      this.data = this.seasonDataFromLine(parts[1]);
      console.log('xxx', this.data);
      if (this.league) {
        this.minGames = this.league.season * 2;
        if (this.minGames > 10)
          this.minGames = 10;
        console.log('league', this.league);
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
        var rebuys = numberVal(c[10]);
        var game = { week: numberVal(c[6]), points: numberVal(c[7]), money: numberVal(c[8]), wins: numberVal(c[9]), rebuys: rebuys }
        var player = { name: c[1], id: c[2], username: c[3], league: c[4], season: c[5], games: [game] }
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
      this.data.forEach(element => {
        var player = new Player(element, 0, 0);
        if (player.numGames >= this.minGames)
          displayData.push(player);
      });
    }

    this.displayData = displayData;
    console.log('displayData', this.displayData);

    var minMaxObj = { minFinish: 999, maxFinish: 0, minPoints: 999, maxPoints: 0, minMoney: 999, maxMoney: 0, minWins: 0, maxWins: 0 };
    this.displayData.forEach(player => {
      if (player.aveFinish < minMaxObj.minFinish)
        minMaxObj.minFinish = player.aveFinish;
      if (player.aveFinish > minMaxObj.maxFinish)
        minMaxObj.maxFinish = player.aveFinish;

      if (player.avePoints < minMaxObj.minPoints)
        minMaxObj.minPoints = player.avePoints;
      if (player.avePoints > minMaxObj.maxPoints)
        minMaxObj.maxPoints = player.avePoints;

      if (player.aveMoney < minMaxObj.minMoney)
        minMaxObj.minMoney = player.aveMoney;
      if (player.aveMoney > minMaxObj.maxMoney)
        minMaxObj.maxMoney = player.aveMoney;

      if (player.wins > minMaxObj.maxWins)
        minMaxObj.maxWins = player.wins;

    });
    console.log('minMaxObj', minMaxObj);
    this.displayData.forEach(player => {
      player.longevity = this.findStat(minMaxObj.minFinish, minMaxObj.maxFinish, player.aveFinish);
      player.pointMaker = this.findStat(minMaxObj.minPoints, minMaxObj.maxPoints, player.avePoints);
      player.moneyMaker = this.findStat(minMaxObj.minMoney, minMaxObj.maxMoney, player.aveMoney);
      player.winRating = this.findStat(minMaxObj.minWins, minMaxObj.maxWins, player.wins);
      player.skill = Math.round((player.winRating + player.pointMaker + player.moneyMaker) / 3);
    });

    this.sortTheData();

  }
  findStat(min, max, value) {
    if (max - min <= 0)
      return '-';
    return Math.round(100 * (value - min) / (max - min));
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
    if (this.sortbyCol == '1st') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.wins > next.wins ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'Name') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.name > next.name ? val1 : val2;
      });
    }

    if (this.sortbyCol == 'W') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.cashedGames > next.cashedGames ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'L') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.losses > next.losses ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'Stk') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.stk > next.stk ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'Point Maker') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.pointMaker > next.pointMaker ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'Money Maker') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.moneyMaker > next.moneyMaker ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'Wins') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.winRating > next.winRating ? val1 : val2;
      });
    }
    if (this.sortbyCol == 'Rating') {
      this.displayData.sort((curr: any, next: any) => {
        return curr.skill > next.skill ? val1 : val2;
      });
    }
  }
  ngClassColumn(col: string) {
    if (col.length < 4)
      return "hidden-sm"
  }
}
