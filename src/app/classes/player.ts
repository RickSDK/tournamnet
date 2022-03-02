declare var formatNumberToLocalCurrency: any;

export class Player {
    public name: string;
    public username: string;
    public games: any;
    public id: number;

    public shortName: string;
    public points: number;
    public totalPoints: number;
    public pointsD1: number;
    public pointsD2: number;
    public money: number;
    public moneyStr: string;
    public wins: number;
    public rebuys: number;
    public place: number;
    public numGames: number;
    public cashedGames: number;
    public losses: number;
    public sortNum: number;
    public stk: number;
    public streak: string;
    public gameStr: string;
    public longevity: string = '-';
    public pointMaker: string = '-';
    public moneyMaker: string = '-';
    public skill: string = '-';
    public finishSpots: number = 0;
    public aveFinish: number = 0;
    public avePoints: number = 0;
    public aveMoney: number = 0;
    public aveMoneyStr: string = '';
    public avePointMakerStr: string = '';
    public aveFinishStr: string = '';
    public winRating: number = 0;
    public awards: any;

    constructor(obj: any, weeks: number, currentWeek: number) {
        this.name = obj.name;
        this.awards = obj.awards;
        this.id = obj.id;
        this.shortName = obj.name;
        if (obj.name) {
            var names = obj.name.split(' ');
            if (names.length > 1)
                this.shortName = names[0] + ' ' + names[1].substring(0, 1);
        }

        this.username = obj.username || '';
        this.games = obj.games;
        this.name = obj.name;
        this.place = 1;

        var points = 0;
        var money = 0;
        var wins = 0;
        var rebuys = 0;
        var games = [];
        var low1 = 99;
        var low2 = 99;
        var numGames = 0;
        var cashedGames = 0;
        var losses = 0;
        var stk = 0;
        var finPoints = 0;
        var finGames = 0;
        var finishSpots = 0;
        if (weeks > 0) {
            for (var w = 1; w <= weeks + 1; w++) {
                var game = { points: 0, money: 0, wins: 0, rebuys: 0 };
                this.games.forEach(g => {
                    if (g.week == w)
                        game = g;
                });

                if (w <= currentWeek && w <= weeks) {
                    if (game.points < low1) {
                        low2 = low1;
                        low1 = game.points;
                    }
                    else if (game.points < low2)
                        low2 = game.points;
                }
                games.push(game);
            }
            obj.games = games;
        }
        obj.games.forEach(game => {
            if (game.points > 0) {
                finishSpots += game.points;
                if (game.wins > 0)
                    finishSpots -= 3;
                numGames++;
                rebuys += game.rebuys;
                if (game.money > 0) {
                    cashedGames++;
                    if (stk > 0)
                        stk++;
                    else
                        stk = 1;
                } else {
                    losses++;
                    if (stk < 0)
                        stk--;
                    else
                        stk = -1;
                }
            }
            if (game.week == 13 && game.points > 0) {
                finPoints = game.points;
                finGames = 1;
            }
            points += game.points;
            money += game.money;
            wins += game.wins;

        });
        //console.log('xxx', obj, currentWeek, low1, low2);

        points -= finPoints;
        this.gameStr = numGames + ' Games (' + cashedGames + 'W, ' + losses + 'L)'
        this.numGames = numGames;
        this.cashedGames = cashedGames;
        this.losses = losses;
        this.stk = stk;
        this.streak = (stk >= 0) ? 'W' + stk : 'L' + stk * -1;;
        this.totalPoints = points;
        this.pointsD1 = points - low1;
        this.pointsD2 = this.pointsD1 - low2;
        this.points = points;
        if (currentWeek > 1)
            this.points = this.pointsD1;
        if (currentWeek > 2)
            this.points = this.pointsD2;
        this.games = games;
        this.rebuys = rebuys;
        this.money = money;
        this.sortNum = this.points * 10000 + money;
        if (numGames > 0) {
            this.aveFinish = finishSpots / (numGames + rebuys);
            this.avePoints = points / (numGames + rebuys);
            this.aveMoney = money / (numGames + rebuys);
        }

        this.moneyStr = formatNumberToLocalCurrency(money);
        this.aveMoneyStr = formatNumberToLocalCurrency(this.aveMoney);
        //this.avePointMakerStr = Math.round(this.avePoints).toString();
        this.avePointMakerStr = this.avePoints.toFixed(1);
        this.aveFinishStr = this.aveFinish.toFixed(1);
        this.wins = wins;


    }
}
