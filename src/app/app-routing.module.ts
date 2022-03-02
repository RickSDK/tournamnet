import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainMenuComponent } from './main-menu/main-menu.component';
import { OptionsComponent } from './options/options.component';
import { EditLeagueComponent } from './edit-league/edit-league.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { ViewStatsComponent } from './view-stats/view-stats.component';

const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'options', component: OptionsComponent },
  { path: 'editLeague', component: EditLeagueComponent },
  { path: 'player', component: PlayerDetailComponent },
  { path: 'view-stats', component: ViewStatsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
