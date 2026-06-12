import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChildService {
  private invoerLijstSignal = signal<string[]>([]);
  

  public invoerLijst = this.invoerLijstSignal.asReadonly();
  

  public laatsteInvoer = computed(() => {
    const lijst = this.invoerLijstSignal();
    return lijst.length > 0 ? lijst[lijst.length - 1] : '';
  });

  
  public onChildInvoerCreated(nieuweInvoer: string): void {
    const trimmed = nieuweInvoer?.trim();
    if (!trimmed) return;
    this.invoerLijstSignal.update(huidigeLijst => [...huidigeLijst, trimmed]);
  }
  public onChildInvoerDeleted(indexTeVerwijderen: number): void {
    this.invoerLijstSignal.update(huidigeLijst => 
      huidigeLijst.filter((_, index) => index !== indexTeVerwijderen)
    );
  }
}