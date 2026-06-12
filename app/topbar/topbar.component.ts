import { Component } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { NgForm, FormsModule } from '@angular/forms'; 
import { Observable } from 'rxjs';
import { CommonModule, AsyncPipe } from '@angular/common'; 
import { loadLocation, selectCity } from '../location-reducer'; 

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({ 
  selector: 'app-topbar',
  templateUrl: './topbar.component.html', 
  styleUrls: ['./topbar.component.scss'],
  standalone: true,        
  imports: [
    CommonModule, 
    AsyncPipe, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ]
}) 
export class TopBarComponent { 
  public loc: string = '';
  public cityName$: Observable<string>; 

  constructor(private store: Store) { 
  
    this.cityName$ = this.store.select(selectCity);
  }

  public search(searchForm: NgForm): void { 
    if (searchForm.invalid || !this.loc.trim()) return; 
 
    this.store.dispatch(loadLocation({ cityName: this.loc.trim() }));
    
    this.loc = '';
    searchForm.resetForm();
  }
}