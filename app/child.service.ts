import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChildService {
  private invoerLijstSignal = signal<string[]>([]);
  
  // Alleen-lezen signal voor de componenten
  public invoerLijst = this.invoerLijstSignal.asReadonly();
  
  // Automatisch bijgewerkte afgeleide waarde
  public laatsteInvoer = computed(() => {
    const lijst = this.invoerLijstSignal();
    return lijst.length > 0 ? lijst[lijst.length - 1] : '';
  });

  // Voegt een nieuw signaal/bericht toe aan de lijst
  public onChildInvoerCreated(nieuweInvoer: string): void {
    const trimmed = nieuweInvoer?.trim();
    if (!trimmed) return;
    this.invoerLijstSignal.update(huidigeLijst => [...huidigeLijst, trimmed]);
  }

  // Verwijdert een specifiek signaal/badge op basis van de index
  public onChildInvoerDeleted(indexTeVerwijderen: number): void {
    this.invoerLijstSignal.update(huidigeLijst => 
      huidigeLijst.filter((_, index) => index !== indexTeVerwijderen)
    );
  }
}