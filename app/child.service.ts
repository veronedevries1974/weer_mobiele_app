import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChildService {
  private invoerLijstSource = new BehaviorSubject<string[]>([]);
  invoerLijst$: Observable<string[]> = this.invoerLijstSource.asObservable();

  private laatsteInvoerSource = new BehaviorSubject<string>('');
  laatsteInvoer$: Observable<string> = this.laatsteInvoerSource.asObservable();

  onChildInvoerCreated(nieuweInvoer: string): void {
    if (!nieuweInvoer || !nieuweInvoer.trim()) return;
    const huidigeLijst = this.invoerLijstSource.getValue();
    this.invoerLijstSource.next([...huidigeLijst, nieuweInvoer.trim()]);
    this.laatsteInvoerSource.next(nieuweInvoer.trim());
  }

  onChildInvoerDeleted(teVerwijderenItem: string): void {
    const huidigeLijst = this.invoerLijstSource.getValue();
    const opgeschoondeLijst = huidigeLijst.filter(item => item !== teVerwijderenItem);
    this.invoerLijstSource.next(opgeschoondeLijst);
    
    const huidigLaatsteBericht = this.laatsteInvoerSource.getValue();
    if (huidigLaatsteBericht === teVerwijderenItem) {
      if (opgeschoondeLijst.length > 0) {
        this.laatsteInvoerSource.next(opgeschoondeLijst[opgeschoondeLijst.length - 1]);
      } else {
        this.laatsteInvoerSource.next('');
      }
    }
  }
}