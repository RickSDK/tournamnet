import { Component, OnInit } from '@angular/core';
import { BaseHttpComponent } from '../base-http/base-http.component';
import { ActivatedRoute } from '@angular/router';
import { Player } from '../classes/player';

declare var numberVal: any;
declare var formatNumberToLocalCurrency: any;

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss']
})
export class PlayerDetailComponent extends BaseHttpComponent implements OnInit {
  public player_id: number = 0;
  public league: any;
  public seasonPlayers: any = [];
  public thisPlayer: any;
  public seasonList = [];
  public season = 1;
  public lifetimeStats: any;
  public awards = [];
  public loadingSeasonFlg = false;

  constructor(private route: ActivatedRoute) {
    super();
    this.route.queryParams
      .subscribe(params => {
        this.player_id = params.id;
      });
  }

  ngOnInit(): void {
    if (localStorage.league) {
      this.league = JSON.parse(localStorage.league);
      console.log('this.league: ', this.league, this.league.numSeasons);
      this.season = this.league.season;
      this.seasonList = [];
      for (var x = 1; x <= this.league.numSeasons; x++)
        this.seasonList.push(x);
      this.user = this.getUserObject();
    } else {
      console.log('No league data!!');
    }

    if (localStorage.seasonData)
      this.seasonPlayers = JSON.parse(localStorage.seasonData);
    this.seasonPlayers.forEach(player => {
      if (player.id == this.player_id)
        this.thisPlayer = new Player(player, this.league.numWeeks, this.league.week);
    });

    this.gotoSeason(this.season);
  }
  gotoSeason(season: number) {
    this.loadingSeasonFlg = true;
    this.season = season;
    this.loadingFlg = true;
    var params = {
      action: 'getLeaguePlayer',
      league_id: '1',
      userId: this.player_id,
      season: season
    };
    this.executeApi('leagueApi.php', params, true);
  }
  postSuccessApi(file: string, data: string) {
    this.loadingFlg = false;
    if (!data)
      return;

    console.log('xxx', data);
    var parts = data.split('<a>');
    //console.log(parts);
    if (parts.length > 1) {

      this.league = this.leagueDataFromLine(parts[0]);
      if (this.season == 0)
        this.season = this.league.season;
      var players = this.seasonDataFromLine(parts[1]);
      this.thisPlayer.games = [];
      players.forEach(player => {
        if (player.id == this.player_id) {
          this.thisPlayer = new Player(player, this.league.numWeeks, this.league.week);
          this.thisPlayer.seasonData = this.seasonDataFromString(parts[4]);
        }
      });

      this.lifetimeStats = this.lifetimeStatsFromLine(parts[2]);
      this.awards = this.awardsFromLine(parts[3]);
      //console.log('xxx', this.thisPlayer);
      this.loadingSeasonFlg = false;

    }
  }
  awardsFromLine(line: string) {
    var awards = [];
    var awardList = line.split('<b>');
    awardList.forEach(item => {
      if (item && item.length > 0) {
        var c = item.split('|');
        var amount = c[3];
        if (c[2] == "2")
          amount = formatNumberToLocalCurrency(c[3]);
        awards.push({ league_id: c[0], season: c[1], award_id: c[2], amount: amount });
      }

    });
    return awards;
  }
  lifetimeStatsFromLine(line: string) {
    var c = line.split('|');
    return { points: c[0], money: c[1], moneyStr: formatNumberToLocalCurrency(c[1]), games: c[2], cashedGames: c[3], wins: c[4], rebuys: c[5] }
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
  seasonDataFromString(seasonString: string) {
    var seasonStats = seasonString.split('<b>');
    var seasonData = [];
    seasonStats.forEach(line => {
      if (line) {
        var c = line.split('|');
        var temp = c[0].split(' ');
        var season = '1';
        if (temp.length > 0)
          season = temp[1];
        seasonData.push({ name: c[0], season: season, gameStr: c[1], money: c[2], moneyStr: formatNumberToLocalCurrency(c[2]), wins: c[3], points: c[4], games: c[5], place: c[6], ordSuf: ordinal_suffix_of(c[6]), awards: c[7] });
      }
    });
    console.log('xxx', seasonData);
    return seasonData;
  }
  seasonDataFromLine(line: string) {
    var lines = line.split('<b>');
    var players = [];
    var playerHash = {};
    lines.forEach(line => {
      console.log(line);
      if (line && line.length > 10) {
        var c = line.split('|');
        var rebuys = numberVal(c[10]);
        var game = { week: numberVal(c[6]), points: numberVal(c[7]), money: numberVal(c[8]), wins: numberVal(c[9]), rebuys: rebuys }
        var player = { name: c[1], id: c[2], username: c[3], league: c[4], season: c[5], games: [game], seasonData: [] }
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
}

function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}