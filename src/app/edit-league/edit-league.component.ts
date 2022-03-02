import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseHttpComponent } from '../base-http/base-http.component';

declare var getTextFieldValue: any;
declare var $: any;
//declare var changeSelectedOption: any;

@Component({
  selector: 'app-edit-league',
  templateUrl: './edit-league.component.html',
  styleUrls: ['./edit-league.component.scss']
})
export class EditLeagueComponent extends BaseHttpComponent implements OnInit {
  public league: any;
  public weeks: any;
  public params: any;
  public week: number = 0;
  public buttonIdx: number = 0;
  public displayPlayers = [];
  public seasonPlayers = [];
  public usernames = [];
  public players: any;
  public gameDataSavedFlg = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    super();
    this.route.queryParams
      .subscribe(params => {
        this.week = params.week;
        this.params = params;
      });
  }

  ngOnInit(): void {
    if (localStorage.league)
      this.league = JSON.parse(localStorage.league);
    this.user = this.getUserObject();

    var weeks = [];
    for (var i = 1; i <= this.league.numWeeks; i++) {
      weeks.push('Week ' + i);
    }
    weeks.push({ name: 'Final', id: this.league.numWeeks + 1 });
    this.weeks = weeks;

    var seasonPlayers;
    if (localStorage.seasonData)
      seasonPlayers = JSON.parse(localStorage.seasonData);

    this.populatePlayers(seasonPlayers);
    this.readExistingPlayers();
    this.loadThisWeeksPlayers(seasonPlayers);

  }
  readExistingPlayers() {
    var params = {
      action: 'getAllPlayers',
      league_id: this.league.id,
      season: this.params.season,
      week: this.params.week,
      userId: this.user.id,
      code: this.user.code
    };
    this.executeApi('leagueApi.php', params, true);
  }
  loadThisWeeksPlayers(seasonPlayers: any) {
    console.log(seasonPlayers);


    var displayPlayers = [];
    seasonPlayers.forEach(player => {
      player.games.forEach(game => {
        if (game.week == this.params.week) {
          player.points = game.points;
          player.money = game.money;
          player.wins = game.wins;
          player.rebuyFlg = (game.rebuys > 0);
          displayPlayers.push(player);
          //nameHash[player.name] = true;
        }
      });
    });
    this.displayPlayers = displayPlayers;
    this.displayPlayers.sort((curr: any, next: any) => {
      return curr.points > next.points ? -1 : 1;
    });
  }
  populatePlayers(seasonPlayers: any) {
    var displayPlayers = [];
    var nameHash = {};

    if (0) {
      seasonPlayers.forEach(player => {
        player.games.forEach(game => {
          if (game.week == this.week) {
            player.points = game.points;
            player.money = game.money;
            player.wins = game.wins;
            displayPlayers.push(player);
            nameHash[player.name] = true;
          }
        });
      });
    }

    this.seasonPlayers = seasonPlayers;

    this.players = [];
    this.usernames = [];
    seasonPlayers.forEach(player => {
      if (!nameHash[player.name]) {
        nameHash[player.name] = true;
        this.players.push(player.name);
        this.usernames.push(player.username);
      }
    });
    //    this.displayPlayers = displayPlayers;
    //    this.displayPlayers.sort((curr: any, next: any) => {
    //     return curr.points > next.points ? -1 : 1;
    //   });
    /*
    this.players.sort((curr: any, next: any) => {
      return curr < next ? -1 : 1;
    });
    this.usernames.sort((curr: any, next: any) => {
      return curr < next ? -1 : 1;
    });*/

    this.players.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    this.usernames.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    console.log('seasonPlayers', seasonPlayers);
    console.log('displayPlayers', this.displayPlayers);
    console.log('players', this.players);
    this.addUpPoints();
    console.log(this.league);
  }
  playerOfName(name: string) {
    var player = this.seasonPlayers[0];
    this.seasonPlayers.forEach(p => {
      if (p.name === name || p.username === name)
        player = p;

    });
    return player;
  }
  rebuyClicked(player: any) {
    player.rebuyFlg = !player.rebuyFlg;
  }
  addExistingPlayer() {
    var name = getTextFieldValue('playerSelect');
    if (this.buttonIdx == 1) {
      name = getTextFieldValue('playerSelect2');
    }
    var player = this.playerOfName(name);
    name = player.name;
    this.displayPlayers.push({ name: player.name, username: player.username });
    this.addUpPoints();

    var players = [];
    this.players.forEach(player => {
      if (player != name)
        players.push(player);
    });
    this.players = players;

    var params = {
      action: 'addExistingPlayer',
      league_id: this.league.id,
      week: this.week,
      season: this.league.season,
      userId: this.user.id,
      code: this.user.code,
      name: name,
    };

    console.log(params);
    this.executeApi('leagueApi.php', params, true);
  }
  removePlayer(player: any) {
    var displayPlayers = [];
    this.displayPlayers.forEach(p => {
      if (p.name != player.name)
        displayPlayers.push(p);
    });
    this.displayPlayers = displayPlayers;
    this.addUpPoints();
    var params = {
      action: 'removePlayer',
      league_id: this.league.id,
      week: this.week,
      season: this.league.season,
      userId: this.user.id,
      code: this.user.code,
      name: player.name,
    };
    console.log(params);
    this.executeApi('leagueApi.php', params, true);
  }
  addNewPlayer() {
    var name = getTextFieldValue('name');
    var username = getTextFieldValue('username');

    if (name === '' || username === '') {
      this.showAlertPopup('Fill out name and screen name.');
      return;
    }
    var dupeFlg = false;
    this.displayPlayers.forEach(player => {
      if (name.toLowerCase() === player.name.toLowerCase())
        dupeFlg = true;
    });
    if (dupeFlg) {
      this.showAlertPopup('That name already exists in this league.');
      return;
    }
    this.displayPlayers.push({ name: name, username: username });
    this.addUpPoints();
    var params = {
      action: 'addPlayer',
      league_id: this.league.id,
      week: this.week,
      season: this.league.season,
      userId: this.user.id,
      code: this.user.code,
      name: name,
      username: username,
    };
    console.log(params);
    $('#name').val('');
    $('#username').val('');
    this.executeApi('leagueApi.php', params, true);
  }
  addUpPoints() {
    this.displayPlayers.sort((curr: any, next: any) => {
      return curr.place < next.place ? -1 : 1;
    });
    if (this.displayPlayers.length > 0) {
      var place = 1;
      var maxPoints = this.displayPlayers.length;
      this.displayPlayers.forEach(player => {
        player.wins = (place == 1) ? 1 : 0;
        player.money = player.money || 0;
        player.place = place++;
        player.points = maxPoints--;
      });
      this.displayPlayers[0].points += 3;
    }
  }
  updatePlayerMoney(player: any, money: number) {
    player.money = money;
  }
  updatePlayerPlace(player: any, place: string) {
    player.place = parseInt(place) - .5;
    this.addUpPoints();
  }
  saveGame() {
    console.log(this.displayPlayers);
    var data = '';
    this.displayPlayers.forEach(player => {
      var list = [];
      list.push(player.id);
      list.push(player.place);
      list.push(player.points);
      list.push(player.money);
      list.push(player.wins);
      list.push(player.name);
      list.push(player.rebuyFlg ? 'Y' : 'N');
      data += list.join('|') + '<b>';
    });
    var params = {
      action: 'saveStats',
      league_id: this.league.id,
      week: this.week,
      season: this.league.season,
      userId: this.user.id,
      code: this.user.code,
      data: data,
    };
    console.log(params);
    this.executeApi('leagueApi.php', params, true);
    this.gameDataSavedFlg = true;
  }
  postSuccessApi(file: string, data: string) {
    console.log('**postSuccessApi**', file, data);
    if (this.gameDataSavedFlg)
      this.router.navigate(['']);

    if (data && data.length > 20 && data.substring(0, 21) === 'success|getAllPlayers')
      this.loadAllPlayers(data);
  }
  postErrorApi(file: string, data: string) {
    console.log('error', file, data);
    if (data)
      this.showAlertPopup(data);
  }
  loadAllPlayers(data: string) {
    var playerList = [];
    var players = data.split('<a>');
    players.forEach(line => {
      var c = line.split('|');
      if (c.length == 4) {
        playerList.push({ name: c[1], username: c[2] })
      }

    });
    console.log('playerList', playerList);
    this.populatePlayers(playerList);
  }
  moveToTop(player: any) {
    player.place = 0;
    this.addUpPoints();
  }
  moveUp(player: any) {
    player.place -= 1.5;
    this.addUpPoints();
  }
  moveDown(player: any) {
    player.place += 1.5;
    this.addUpPoints();
  }
  moveToBottom(player: any) {
    player.place = this.displayPlayers.length + 1;
    this.addUpPoints();
  }
}


