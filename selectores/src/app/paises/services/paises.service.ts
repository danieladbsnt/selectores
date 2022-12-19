import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Country, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
private baseUrl: string = 'https://restcountries.com/v3.1'

//le pasamos un nuevo arreglo, pero desestructurado. De manera que si accidentalmente se hacen cambios en esta propiedad, nunca se manipulará la de _regions.
get regions(): string[] {
  return [...this._regions];
}
  constructor(private http: HttpClient) { }

    getCountriesByRegion(region: string): Observable<Country[]> {
      const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name`
      return this.http.get<Country[]>(url)
    }

    getCountryByCode(codigo: string): Observable<Pais[] | null> {

      if(!codigo) {
        return of(null)
      }

      const url = `${this.baseUrl}/alpha/${codigo}`
      return this.http.get<Pais[]>(url)
    }
  
    getCountryByCodeSmall(codigo: string): Observable<Country> {
      const url = `${this.baseUrl}/alpha/${codigo}?fields=cca3;name`;
      return this.http.get<Country>(url)
    }
  
    getPaisesPorCodigo(borders: Pais[]): Observable<Country[]> {
      if (!borders[0]?.borders) {
        return of([])
      }
      const requests: Observable<Country>[] = [];
      borders[0]?.borders.forEach(codigo => {
        const peticion = this.getCountryByCodeSmall(codigo);
        requests.push(peticion);
      });
      return combineLatest(requests);
    }

}
