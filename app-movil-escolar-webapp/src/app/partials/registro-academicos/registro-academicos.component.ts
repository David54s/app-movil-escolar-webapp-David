import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { EventosAcademicosService } from 'src/app/services/eventos-academicos.service';

@Component({
  selector: 'app-registro-academicos',
  templateUrl: './registro-academicos.component.html',
  styleUrls: ['./registro-academicos.component.scss']
})
export class RegistroAcademicosComponent implements OnInit {

  public evento: any = {};
  public errors: any = {};
  public minDate: Date = new Date();
  public lista_responsables: any[] = [];
  public editar: boolean = false;
  public idEvento: number = 0;

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private eventosService: EventosAcademicosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.evento = this.eventosService.esquemaEventoAcademico();
    this.obtenerResponsables();

    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      this.idEvento = this.activatedRoute.snapshot.params['id'];
      this.eventosService.obtenerEventoAcademicoPorID(this.idEvento).subscribe(
        (response)=>{
          this.evento = response;
          if(this.evento.publico_objetivo && typeof this.evento.publico_objetivo === 'string'){
             this.evento.publico_objetivo = this.evento.publico_objetivo.split(', ');
          }
        }, (error)=>{
          alert("No se pudo obtener el evento");
        }
      );
    }
  }



  public obtenerResponsables() {
    this.eventosService.obtenerResponsables().subscribe(
      (response) => { this.lista_responsables = response; },
      (error) => { console.error(error); }
    );
  }

  public goBack() {
    this.location.back();
  }

  public changeFecha(event: any) {
    if (event.value) {
      this.evento.fecha_realizacion = event.value.toISOString().split('T')[0];
    }
  }

  public checkboxChange(event: any){
    if(event.checked){
      this.evento.publico_objetivo.push(event.source.value);
    }else{
      this.evento.publico_objetivo.forEach((item: any, i: any) => {
        if(item == event.source.value){
          this.evento.publico_objetivo.splice(i,1);
        }
      });
    }
  }

  public isEstudianteSelected(): boolean {
    return this.evento.publico_objetivo && this.evento.publico_objetivo.includes('Estudiantes');
  }

  public registrar() {
    this.errors = {};
    this.errors = this.eventosService.validarEventoAcademico(this.evento);
    if (Object.keys(this.errors).length > 0) {
      let listaErrores = "";
      Object.values(this.errors).forEach(err => {
        listaErrores += `• ${err}\n`;
      });
      alert("No se puede registrar:\n" + listaErrores);
      return false;
    }
    const eventoAEnviar = { ...this.evento };
    if(Array.isArray(this.evento.publico_objetivo)){
        eventoAEnviar.publico_objetivo = this.evento.publico_objetivo.join(', ');
    }

    this.eventosService.registrarEventoAcademico(eventoAEnviar).subscribe(
      (response) => {
        alert("Evento registrado exitosamente");
        this.router.navigate(['/eventos-academicos']);
      },
      (error) => {
        alert("Error al registrar el evento");
      }
    );
  }

  // 👇 ACTUALIZAR AHORA ES DIRECTO (SIN MODAL)
  public actualizar() {
    // 1. Validar
    this.errors = {};
    this.errors = this.eventosService.validarEventoAcademico(this.evento);
    if (Object.keys(this.errors).length > 0) {
      let listaErrores = "";
      Object.values(this.errors).forEach(err => {
        listaErrores += `• ${err}\n`;
      });
      alert("No se puede actualizar:\n" + listaErrores);
      return false;
    }

    // 2. Preparar datos
    const eventoAEnviar = { ...this.evento };
    if(Array.isArray(this.evento.publico_objetivo)){
      eventoAEnviar.publico_objetivo = this.evento.publico_objetivo.join(', ');
    }

    // 3. Llamar servicio directo
    this.eventosService.actualizarEventoAcademico(eventoAEnviar).subscribe(
      (response) => {
        alert("Evento actualizado correctamente");
        this.router.navigate(['/eventos-academicos']);
      },
      (error) => {
        alert("Error al actualizar el evento");
      }
    );
  }




}
