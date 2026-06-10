import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet, IonContent } from '@ionic/angular/standalone';
import { TopBarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <app-topbar></app-topbar>
      <ion-content>
        <ion-router-outlet></ion-router-outlet>
      </ion-content>
      <app-footer></app-footer>
    </ion-app>
  `,
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet, IonContent, TopBarComponent, FooterComponent]
})
export class AppComponent {}