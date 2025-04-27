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

export const routes: Routes = [
  { path: 'ajouter-annonce', component: AjouterAnnonceComponent },
  { path: 'property/:id', component: PropertyDetailsComponent },
  { path: 'mes-annonces', component: MesAnnoncesComponent },


  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard-client', component: DashboardClientComponent },
  { path: 'dashboard-proprietaire', component: DashboardProprietaireComponent },
  { path: 'chat', component: ChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
