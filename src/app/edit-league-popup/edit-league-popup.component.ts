import { Component, OnInit } from '@angular/core';
import { BaseHttpComponent } from '../base-http/base-http.component';
import { Router } from '@angular/router';
import { Player } from '../classes/player';

declare var $: any;

@Component({
  selector: 'app-edit-league-popup',
  templateUrl: './edit-league-popup.component.html',
  styleUrls: ['./edit-league-popup.component.scss']
})
export class EditLeaguePopupComponent extends BaseHttpComponent implements OnInit {
  public league: any;
  public weeks: any;
  public thisWeek: number;
  public leagueId: number;
  public season: number;
  public submittedDataFlg: boolean = false;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    if (localStorage.league)
      this.league = JSON.parse(localStorage.league);

    var weeks = [];
    for (var i = 1; i <= this.league.numWeeks; i++) {
      weeks.push({ name: 'Week ' + i, id: i });
    }
    weeks.push({ name: 'Final', id: this.league.numWeeks + 1 });
    this.weeks = weeks;
  }
  show(league: number, season: number, week: number) {
    this.submittedDataFlg = false;
    this.thisWeek = week;
    this.leagueId = league;
    this.season = season;
    console.log('this.league', this.leagueId, this.season, week, this.league);
    $('#editLeagueModal').modal();
  }
  editWeek(week: any) {
    this.closeModal('#editLeagueModal');
    this.router.navigate(['/editLeague'], { queryParams: { 'league': this.leagueId, 'season': this.season, 'week': week.id } });
    console.log(week);
  }
  awardBadges() {
    this.submittedDataFlg = true;
    var seasonPlayers = JSON.parse(localStorage.seasonData);
    this.user = this.getUserObject();

    var players = [];
    var mostMoney = 0;
    var mostGamesCashed = 0;
    var mostPoints = 0;
    var mostWins = 0;
    seasonPlayers.forEach(element => {
      var player = new Player(element, this.league.numWeeks, this.league.week);
      if (player.points > mostPoints)
        mostPoints = player.points;
      if (player.money > mostMoney)
        mostMoney = player.money;
      if (player.cashedGames > mostGamesCashed)
        mostGamesCashed = player.cashedGames;
      if (player.wins > mostWins)
        mostWins = player.wins;
      players.push(player);
    });

    var awards = [];
    var sPlayers = [];
    players.forEach(player => {
      sPlayers.push({ id: player.id, points: player.points, money: player.money, stk: player.stk, games: player.numGames, cashedGames: player.cashedGames, wins: player.wins, gameStr: player.gameStr });
      if (player.points == mostPoints)
        awards.push({ id: 1, user_id: player.id, amount: mostPoints });
      if (player.money == mostMoney)
        awards.push({ id: 2, user_id: player.id, amount: mostMoney });
      if (player.cashedGames == mostGamesCashed)
        awards.push({ id: 3, user_id: player.id, amount: mostGamesCashed });
      if (player.wins == mostWins)
        awards.push({ id: 4, user_id: player.id, amount: mostWins });
    });

    console.log('mostMoney', mostMoney);
    console.log('mostGamesCashed', mostGamesCashed);
    console.log('mostPoints', mostPoints);
    console.log('awards', awards);
    console.log('this.league', this.league);
    console.log('sPlayers', sPlayers);

    var params = {
      action: 'awardBadges',
      league_id: this.league.id,
      userId: this.user.id,
      code: this.user.code,
      awards: JSON.stringify(awards),
      players: JSON.stringify(sPlayers),
    };
    console.log(params);
    this.executeApi('leagueApi.php', params, true);
    this.league.status = 'Awards';
    this.closeModal('#editLeagueModal');

  }
  postSuccessApi(file: string, data: string) {
    console.log('hey', file, data);
  }
  startNewSeason() {
    console.log('startNewSeason');
    this.user = this.getUserObject();
    var params = {
      action: 'startNewSeason',
      league_id: this.league.id,
      userId: this.user.id,
      code: this.user.code
    };
    this.executeApi('leagueApi.php', params, true);
    this.closeModal('#editLeagueModal');
  }
}
