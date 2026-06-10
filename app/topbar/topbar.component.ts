import { Component } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { NgForm, FormsModule } from '@angular/forms'; 
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common'; 
import { setLocation, selectLocationState } from '../location-reducer'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({ 
  selector: 'app-topbar',
  templateUrl: './topbar.component.html', 
  styleUrls: ['./topbar.component.scss'],
  standalone: true,        
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
}) 
export class TopBarComponent { 
  loc: string = '';
  location$: Observable<string>;

  constructor(private store: Store) { 
    this.location$ = this.store.select(selectLocationState);
  }

  search(searchForm: NgForm): void { 
    if (searchForm.invalid || !this.loc.trim()) return; 
    
    this.store.dispatch(setLocation({ 
      city: this.loc.trim(), 
      lat: 52.3676, 
      lon: 4.9041 
    })); 
    
    this.loc = ''; 
    searchForm.resetForm();
  }
}