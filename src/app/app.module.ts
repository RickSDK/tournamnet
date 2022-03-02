import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './base/base.component';
import { PageShellComponent } from './page-shell/page-shell.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { BaseColorsComponent } from './base-colors/base-colors.component';
import { BaseHttpComponent } from './base-http/base-http.component';
import { OptionsComponent } from './options/options.component';
import { ButtonComponent } from './button/button.component';
import { LoginComponent } from './login/login.component';
import { EditLeagueComponent } from './edit-league/edit-league.component';
import { EditLeaguePopupComponent } from './edit-league-popup/edit-league-popup.component';
import { SpinnerComponent } from './popups/spinner/spinner.component';
import { InfoPopupComponent } from './popups/info-popup/info-popup.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { ViewStatsComponent } from './view-stats/view-stats.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    PageShellComponent,
    MainMenuComponent,
    BaseColorsComponent,
    BaseHttpComponent,
    OptionsComponent,
    ButtonComponent,
    LoginComponent,
    EditLeagueComponent,
    EditLeaguePopupComponent,
    SpinnerComponent,
    InfoPopupComponent,
    PlayerDetailComponent,
    LoadingBarComponent,
    ViewStatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
