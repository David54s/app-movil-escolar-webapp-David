import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from 'src/app/services/facade.service';

export interface DatosAdmin {
  id: number;
  clave_admin: string;
  first_name: string;
  last_name: string;
  email: string;
  rfc: string;
  ocupacion: string;
}

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})


export class AdminScreenComponent implements OnInit {

  public name_user: string = "";
  public lista_admins: DatosAdmin[] = [];
  public lista_admins_filtrada: DatosAdmin[] = [];
  public lista_admins_paginada: DatosAdmin[] = [];

  public Math = Math;

  public buscadorPalabra: string = "";

  public sortColumna: string = "";
  public sortDireccion: 'asc' | 'desc' = 'asc';

  public paginaDefault: number = 1;
  public paginaTamano: number = 5;
  public totalPages: number = 0;
  public paginaTamanoOptions: number[] = [5, 10, 20];

  constructor(
    public facadeService: FacadeService,
    private administradoresService: AdministradoresService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.obtenerAdmins();
  }

  public obtenerAdmins() {
    this.administradoresService.obtenerListaAdmins().subscribe(
      (response) => {

        this.lista_admins = response.map((admin: any) => ({
          id: admin.id,
          clave_admin: admin.clave_admin,
          first_name: admin.user.first_name,
          last_name: admin.user.last_name,
          email: admin.user.email,
          rfc: admin.rfc,
          ocupacion: admin.ocupacion
        }));

        console.log("Lista admins: ", this.lista_admins);
        this.aplicarFiltrosYPaginacion();
      }, (error) => {
        alert("No se pudo obtener la lista de administradores");
      }
    );
  }

  public hacerFiltro(event: Event) {
    this.buscadorPalabra = (event.target as HTMLInputElement).value;
    this.paginaDefault = 1;
    this.aplicarFiltrosYPaginacion();
  }

  public ordenarPor(columna: string) {
    if (this.sortColumna === columna) {

      this.sortDireccion = this.sortDireccion === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumna = columna;
      this.sortDireccion = 'asc';
    }
    this.aplicarFiltrosYPaginacion();
  }

  public logoSorting(columna: string): string {
    if (this.sortColumna !== columna) {
      return 'bi-arrow-down-up';
    }
    return this.sortDireccion === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  public cambiarPagina(size: number) {
    this.paginaTamano = size;
    this.paginaDefault = 1;
    this.aplicarFiltrosYPaginacion();
  }

  public irAPagina(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.paginaDefault = page;
      this.aplicarFiltrosYPaginacion();
    }
  }

  private aplicarFiltrosYPaginacion() {
    if (this.buscadorPalabra.trim() === "") {
      this.lista_admins_filtrada = [...this.lista_admins];
    } else {
      const searchLower = this.buscadorPalabra.toLowerCase();
      this.lista_admins_filtrada = this.lista_admins.filter(admin =>
        admin.clave_admin.toLowerCase().includes(searchLower) ||
        `${admin.first_name} ${admin.last_name}`.toLowerCase().includes(searchLower) ||
        admin.email.toLowerCase().includes(searchLower) ||
        admin.rfc.toLowerCase().includes(searchLower) ||
        admin.ocupacion.toLowerCase().includes(searchLower)
      );
    }

    if (this.sortColumna) {
      this.lista_admins_filtrada.sort((a, b) => {
        let valorA: any;
        let valorB: any;

        switch(this.sortColumna) {
          case 'clave_admin':
            valorA = a.clave_admin.toLowerCase();
            valorB = b.clave_admin.toLowerCase();
            break;
          case 'nombre':
            valorA = a.first_name.toLowerCase();
            valorB = b.first_name.toLowerCase();
            break;
          case 'apellido':
            valorA = a.last_name.toLowerCase();
            valorB = b.last_name.toLowerCase();
            break;
          case 'email':
            valorA = a.email.toLowerCase();
            valorB = b.email.toLowerCase();
            break;
          case 'rfc':
            valorA = a.rfc.toLowerCase();
            valorB = b.rfc.toLowerCase();
            break;
          case 'ocupacion':
            valorA = a.ocupacion.toLowerCase();
            valorB = b.ocupacion.toLowerCase();
            break;
          default:
            return 0;
        }

        if (valorA < valorB) {
          return this.sortDireccion === 'asc' ? -1 : 1;
        }
        if (valorA > valorB) {
          return this.sortDireccion === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    this.totalPages = Math.ceil(this.lista_admins_filtrada.length / this.paginaTamano);

    if (this.paginaDefault > this.totalPages && this.totalPages > 0) {
      this.paginaDefault = this.totalPages;
    }

    const startIndex = (this.paginaDefault - 1) * this.paginaTamano;
    const endIndex = startIndex + this.paginaTamano;
    this.lista_admins_paginada = this.lista_admins_filtrada.slice(startIndex, endIndex);
  }

  public getPaginasVisibles(): number[] {
    const maxPaginas = 5;
    const paginas: number[] = [];

    let inicio = Math.max(1, this.paginaDefault - Math.floor(maxPaginas / 2));
    let fin = Math.min(this.totalPages, inicio + maxPaginas - 1);

    if (fin - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  public goEditar(idUser: number) {
    this.router.navigate(["registro-usuarios/administrador/" + idUser]);
  }

  public delete(idUser: number){
    // Mostrar alerta indicando que un administrador no puede eliminar a otro
    alert("Un administrador no puede eliminar a otro administrador.");
  }
}
