import { Component, OnInit, Signal } from '@angular/core';
import { ChildService } from '../child.service'; 

// Alle benodigde Angular en Material modules voor standalone registratie
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
  standalone: true,
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
  public ChildInvoerModel: string = '';
  
  // GEFIXED: Explicit type definition met string arrays om bindingfouten uit te sluiten
  public berichtenLijst: Signal<string[]>;
  public laatsteBericht: Signal<string>;

  constructor(private childService: ChildService) {
    // Directe koppeling aan de read-only Signals uit de ChildService
    this.berichtenLijst = this.childService.invoerLijst;
    this.laatsteBericht = this.childService.laatsteInvoer;
  }

  ngOnInit(): void { }

  public onChildInvoer(): void {
    if (this.ChildInvoerModel.trim()) {
      this.childService.onChildInvoerCreated(this.ChildInvoerModel);
      this.ChildInvoerModel = ''; 
    }
  }

  public verwijderBericht(index: number): void {
    this.childService.onChildInvoerDeleted(index);
  }
}