import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // Toegevoegd voor <router-outlet>
import { IonApp, IonContent } from '@ionic/angular/standalone'; // IonContent toegevoegd, IonRouterOutlet verwijderd
import { TopBarComponent } from './topbar/topbar.component'; // Behoudt uw eigen Schrijfwijze (hoofdletter B)
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonApp, 
    IonContent,      // Toegevoegd voor <ion-content>
    RouterOutlet,    // Toegevoegd voor <router-outlet>
    TopBarComponent, // Uw originele TopBar component
    FooterComponent
    // IonRouterOutlet is hier volledig verwijderd
  ]
})
export class AppComponent {}