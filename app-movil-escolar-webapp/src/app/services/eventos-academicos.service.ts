import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FacadeService } from './facade.service';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})



export class EventosAcademicosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaEventoAcademico(){
    return {
      'nombre_evento': '',
      'tipo_evento': '',
      'fecha_realizacion': '',
      'hora_inicio': '',
      'hora_fin': '',
      'lugar': '',
      'publico_objetivo': [],
      'programa_educativo': '',
      'responsable': '',
      'descripcion': '',
      'cupo_maximo': 0
    }
  }
  //Validación para el formulario
  public validarEventoAcademico(data: any){
    console.log("Validando evento académico... ", data);
    let error: any = [];

    //nombre_evento
    if(!this.validatorService.required(data["nombre_evento"])){
      error["nombre_evento"] = this.errorService.required;
    } else {
      const alphaNumericPattern = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ ]+$/;            // Solo letras con acentos, números y espacios sin caracteres especiales.
      if (!alphaNumericPattern.test(data["nombre_evento"])) {
        alert("El nombre del evento solo puede contener letras, números y espacios.");
        error["nombre_evento"] = "Caracteres inválidos";
      }
    }


    //tipo_evento
    if(!this.validatorService.required(data["tipo_evento"])){
      error["tipo_evento"] = this.errorService.required;
    }

    //fecha_realizacion
    if(!this.validatorService.required(data["fecha_realizacion"])){
      error["fecha_realizacion"] = this.errorService.required;
    } else {
      const fechaEvento = new Date(data["fecha_realizacion"]);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaEvento < hoy) {
        error["fecha_realizacion"] = "La fecha no puede ser anterior a hoy";
      }
    }

    //hora_inicio
    if(!this.validatorService.required(data["hora_inicio"])){
      error["hora_inicio"] = this.errorService.required;
    }
    //hora_fin
    if(!this.validatorService.required(data["hora_fin"])){
      error["hora_fin"] = this.errorService.required;
    }

    if (data["hora_inicio"] && data["hora_fin"]) {
      const inicioMinutos = this.convertirHoraAMinutos(data["hora_inicio"]);
      const finMinutos = this.convertirHoraAMinutos(data["hora_fin"]);

      if (inicioMinutos >= finMinutos) {
        error["hora_fin"] = "La hora final debe ser mayor a la inicial";
      }
    }

    //lugar
    if(!this.validatorService.required(data["lugar"])){
      error["lugar"] = this.errorService.required;
    } else {
      const lugarPattern = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ ]+$/;
      if (!lugarPattern.test(data["lugar"])) {
        error["lugar"] = "Solo caracteres alfanuméricos y espacios";
      }
    }

    //publico_objetivo
    if(!this.validatorService.required(data["publico_objetivo"]) || data["publico_objetivo"].length == 0){
      error["publico_objetivo"] = this.errorService.required;
    }

    //programa_educativo
    if(!this.validatorService.required(data["responsable"])){
      error["responsable"] = this.errorService.required;
    }
    //descripcion
    if (!this.validatorService.required(data["descripcion"])) {
      error["descripcion"] = this.errorService.required;
    } else {
      const descPattern = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ .,;:¡!¿?()\-_\s"']+$/;
      if (!descPattern.test(data["descripcion"])) {
        error["descripcion"] = "Caracteres inválidos. Solo letras, números y puntuación básica.";
      }
    }


    //cupo_maximo
    if(!this.validatorService.required(data["cupo_maximo"])){
      error["cupo_maximo"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["cupo_maximo"])){
      error["cupo_maximo"] = this.errorService.numeric;
    }


    return error;
  }


  private convertirHoraAMinutos(horaStr: string): number {
    const [hours, minutes] = horaStr.split(':').map(Number);
    return (hours * 60) + minutes;
  }

  public registrarEventoAcademico(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers = new HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    return this.http.post<any>(`${environment.url_api}/eventos-academicos/`, data, { headers });
  }

  public obtenerListaEventosAcademicos(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;

    if (token) {
        headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
        headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    return this.http.get<any>(`${environment.url_api}/lista-eventos-academicos/`, { headers: headers });
  }

  public eliminarEventoAcademico(idEvento: number): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.delete<any>(`${environment.url_api}/eventos-academicos/?id=${idEvento}`, { headers });
  }

  public obtenerEventoAcademicoPorID(idEvento: number): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/eventos-academicos/?id=${idEvento}`, { headers });
  }

  public actualizarEventoAcademico(data: any): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.put<any>(`${environment.url_api}/eventos-academicos/`, data, { headers });
  }

  public obtenerResponsables(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.get<any>(`${environment.url_api}/lista-responsables/`, { headers });
  }









}
