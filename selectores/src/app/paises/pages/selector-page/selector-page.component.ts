import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { Country } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})

export class SelectorPageComponent implements OnInit {

myForm: FormGroup = this.formBuilder.group({
  region: ['', Validators.required],
  pais: ['', Validators.required],
  frontera: ['', Validators.required]

})

//Llenar selectores
regiones: string[] = [];
paises: Country[] = [];
// fronteras: string[] = [];
fronteras: Country[] = [];

//UI cargando
cargando: boolean =false;

  constructor(private formBuilder: FormBuilder, private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regions;
    //Cuando cambie la region
    // this.myForm.get('region')?.valueChanges.subscribe(region => {
    //   console.log(region);
    //   this.paisesService.getCountriesByRegion(region).subscribe(paises => {
    //     this.paises = paises;
    //     console.log(paises);
    //   })
    // })
    //Esto de arriba se puede hacer de una forma más corta y mejor así:
    this.myForm.get('region')?.valueChanges
    .pipe(
      tap( (_) => {
        this.myForm.get('pais')?.reset('');
        this.cargando = true;
      }),
      switchMap(region =>  this.paisesService.getCountriesByRegion(region))
    )
    .subscribe(paises => {
      this.paises = paises;
      this.cargando = false;
    })
  //Cuando cambia el pais
  this.myForm.get('pais')?.valueChanges
  .pipe(
    tap( () => {
      this.myForm.get('frontera')?.reset('');
      this.cargando = true;
    }),
    switchMap(codigo => this.paisesService.getCountryByCode(codigo)),
    switchMap(pais => this.paisesService.getPaisesPorCodigo(pais || []))
  )
    .subscribe((paises) => {
      if (paises.length > 0) {
        this.fronteras = paises;
        this.cargando = false;
      } else {
        this.fronteras = [];
        this.cargando = false;
      }
    })
  }

save() {
  console.log(this.myForm.value);
}
}
