import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChildService } from '../child.service'; 
import { CommonModule } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-child4',
  templateUrl: './child4.component.html',
  styleUrls: ['./child4.component.scss'],
  standalone: true, // GEFIXT: Standalone ingeschakeld
  imports: [
    CommonModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    FormsModule
  ] 
})
export class Child4Component implements OnInit {
  ChildInvoerModel: string = '';
  berichtenLijst$: Observable<string[]>;
  laatsteBericht$: Observable<string>;

  constructor(private childService: ChildService) {
    this.berichtenLijst$ = this.childService.invoerLijst$;
    this.laatsteBericht$ = this.childService.laatsteInvoer$;
  }

  ngOnInit(): void { }

  onChildInvoer(): void {
    if (this.ChildInvoerModel.trim()) {
      this.childService.onChildInvoerCreated(this.ChildInvoerModel);
      this.ChildInvoerModel = ''; 
    }
  }

  verwijderBericht(item: string): void {
    this.childService.onChildInvoerDeleted(item);
  }
}