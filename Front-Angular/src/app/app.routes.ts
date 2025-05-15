import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardProprietaireComponent } from './dashboard-proprietaire/dashboard-proprietaire.component';
import { DashboardClientComponent } from './dashboard-client/dashboard-client.component';
import { HomeComponent } from './home/home.component';
import {AjouterAnnonceComponent} from './ajouter-annonce/ajouter-annonce.component';
import {PropertyDetailsComponent} from './property-details/property-details.component';
import {ChatComponent} from './chat/chat.component';
import {MesAnnoncesComponent} from './mes-annonces/mes-annonces.component';
import {SearchResultsComponent} from './search-results/search-results.component';
import { AuthGuard } from './guards/auth.guard';
import {ProfilComponent} from './profil/profil.component';
import {MesReservationsComponent} from './mes-reservations/mes-reservations.component';



export const routes: Routes = [
  { path: 'ajouter-annonce', component: AjouterAnnonceComponent,canActivate: [AuthGuard] },
  { path: 'property/:id', component: PropertyDetailsComponent,canActivate: [AuthGuard] },
  { path: 'mes-annonces', component: MesAnnoncesComponent, canActivate: [AuthGuard] },

  {path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
  {path: 'mes-reservations', component: MesReservationsComponent, canActivate: [AuthGuard] },


  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard-client', component: DashboardClientComponent,canActivate: [AuthGuard] },
  { path: 'dashboard-proprietaire', component: DashboardProprietaireComponent , canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'search',component: SearchResultsComponent,canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
