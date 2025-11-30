// alumnos-screen.component.ts CON SORTING MEJORADO

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_alumnos: any[] = [];
  public autorizado: boolean = false;

  displayedColumns: string[] = ['matricula', 'nombre', 'apellido', 'email', 'curp', 'edad', 'telefono', 'ocupacion', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosAlumno>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public facadeService: FacadeService,
    public alumnosService: AlumnosService,
    public eliminarUserModal: MatDialog
  ) {}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    this.token = this.facadeService.getSessionToken();
    if (this.token === "") {
        this.router.navigate([""]);
    }

    this.obtenerAlumnos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public obtenerAlumnos() {
    this.alumnosService.obtenerListaAlumnos().subscribe(
        (response) => {
            this.lista_alumnos = response.map((alumno: any) => ({
                ...alumno,
                first_name: alumno.user ? alumno.user.first_name : '',
                last_name: alumno.user ? alumno.user.last_name : '',
                email: alumno.user ? alumno.user.email : ''
            }));
            this.dataSource.data = this.lista_alumnos;

            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;

              this.dataSource.sortingDataAccessor = (data: DatosAlumno, sortHeaderId: string) => {
                switch(sortHeaderId) {
                  case 'matricula':
                    return data.matricula.toLowerCase();
                  case 'nombre':
                    return data.first_name.toLowerCase();
                  case 'apellido':
                    return data.last_name.toLowerCase();
                  case 'edad':
                    return data.edad;
                  default:
                    return (data as any)[sortHeaderId];
                }
              };

              this.dataSource.filterPredicate = (data: DatosAlumno, filter: string) => {
                const searchStr = filter.toLowerCase();
                const fullName = `${data.first_name} ${data.last_name}`.toLowerCase();

                return data.matricula.toLowerCase().includes(searchStr) ||
                       fullName.includes(searchStr) ||
                       data.email.toLowerCase().includes(searchStr) ||
                       data.curp.toLowerCase().includes(searchStr) ||
                       data.edad.toString().includes(searchStr) ||
                       data.telefono.includes(searchStr) ||
                       data.ocupacion.toLowerCase().includes(searchStr);
              };
            });
        },
        error => {
            alert("No se pudo obtener la lista de alumnos");
        }
    );
  }

  public hacerFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public goEditar(idAlumno: number) {
    this.router.navigate(["registro-usuarios/alumnos/" + idAlumno]);
  }

  public delete(idUser: number) {
    // Si el rol es administrador maestro pues entra pero si es alumno, se va y no deja.
    if (this.rol == 'administrador' || this.rol == 'maestro') {

      const dialogRef = this.dialog.open(EliminarUserModalComponent, {
        data: { id: idUser, rol: 'alumno' }, // Pasamos el rol alumno pq es lo que vamos a borrar
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.isDelete) {
          console.log("Alumno eliminado");
          alert("Alumno eliminado correctamente");
          window.location.reload();
        } else {
          alert("No se eliminó el alumno");
          console.log("No se eliminó el alumno");
        }
      });

    } else {
      // Si el rol es alumno denegamos la acción.
      alert("No tienes permisos para eliminar alumnos.");
    }
  }
}

export interface DatosAlumno {
  id: number;
  matricula: string;
  first_name: string;
  last_name: string;
  email: string;
  curp: string;
  edad: number;
  telefono: string;
  ocupacion: string;
}
