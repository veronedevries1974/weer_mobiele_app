import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChildService {
  // 1. Private writeable signal voor het beheren van de interne staat
  private invoerLijstSignal = signal<string[]>([]);
  
  // 2. Public read-only signals waar de componenten veilig naar kunnen luisteren
  // In de HTML-templates roep je dit aan als een functie: berichtenLijst()
  public invoerLijst = this.invoerLijstSignal.asReadonly();
  
  // 3. Gecalculeerde state: updateert zichzelf automatisch zodra de invoerLijst verandert
  // In de HTML-templates roep je dit aan als een functie: laatsteBericht()
  public laatsteInvoer = computed(() => {
    const lijst = this.invoerLijstSignal();
    return lijst.length > 0 ? lijst[lijst.length - 1] : '';
  });

  /**
   * Voegt een nieuw tekstsignaal of bericht toe aan de centrale lijst.
   * Ongeacht vanaf welk tabblad (Child 1, 2, 3 of 4) dit wordt aangeroepen.
   * @param nieuweInvoer De ingevoerde tekst string
   */
  public onChildInvoerCreated(nieuweInvoer: string): void {
    const trimmed = nieuweInvoer?.trim();
    
    // Blokkeer lege invoer of invoer met alleen spaties
    if (!trimmed) return;
    
    // Voeg de nieuwe string toe aan de array op een immutable (onveranderbare) manier
    this.invoerLijstSignal.update(huidigeLijst => [...huidigeLijst, trimmed]);
  }

  /**
   * Verwijdert een specifiek bericht uit de lijst op basis van zijn unieke positie (index).
   * GEFIXED: Dit voorkomt dat bij identieke teksten (bijv. 2x "Zon") de hele lijst wordt gewist.
   * @param indexTeVerwijderen De exacte indexpositie in de array (number)
   */
  public onChildInvoerDeleted(indexTeVerwijderen: number): void {
    this.invoerLijstSignal.update(huidigeLijst => 
      huidigeLijst.filter((_, index) => index !== indexTeVerwijderen)
    );
  }
}