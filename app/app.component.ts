import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TopBarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonApp, IonRouterOutlet, TopBarComponent, FooterComponent]
})
export class AppComponent {}