import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { EventosAcademicosService } from 'src/app/services/eventos-academicos.service';
import { EliminarEventoModalComponent } from 'src/app/modals/eliminar-evento-modal/eliminar-evento-modal.component';

@Component({
  selector: 'app-eventos-academicos',
  templateUrl: './eventos-academicos.component.html',
  styleUrls: ['./eventos-academicos.component.scss']
})
export class EventosAcademicosComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_eventos: any[] = [];

  displayedColumns: string[] = ['nombre', 'tipo', 'fecha', 'hora', 'lugar', 'publico', 'responsable', 'cupo', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosEvento>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public facadeService: FacadeService,
    public eventosService: EventosAcademicosService
  ) {}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    this.token = this.facadeService.getSessionToken();
    if (this.token === "") {
        this.router.navigate([""]);
    }

    this.obtenerEventos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public obtenerEventos() {
    this.eventosService.obtenerListaEventosAcademicos().subscribe(
        (response) => {
            this.lista_eventos = response;
            this.dataSource.data = this.lista_eventos;

            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;

              this.dataSource.sortingDataAccessor = (data: DatosEvento, sortHeaderId: string) => {
                switch(sortHeaderId) {
                  case 'nombre':
                    return data.nombre_evento.toLowerCase();
                  case 'tipo':
                    return data.tipo_evento.toLowerCase();
                  case 'fecha':
                    return new Date(data.fecha_realizacion).getTime();
                  case 'cupo':
                    return data.cupo_maximo;
                  default:
                    return (data as any)[sortHeaderId];
                }
              };

              this.dataSource.filterPredicate = (data: DatosEvento, filter: string) => {
                const searchStr = filter.toLowerCase();

                return data.nombre_evento.toLowerCase().includes(searchStr) ||
                       data.tipo_evento.toLowerCase().includes(searchStr) ||
                       data.lugar.toLowerCase().includes(searchStr) ||
                       data.responsable.toLowerCase().includes(searchStr) ||
                       data.publico_objetivo.toLowerCase().includes(searchStr);
              };
            });
        },
        error => {
            alert("No se pudo obtener la lista de eventos");
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

  public goRegistrar() {
    this.router.navigate(["registro-academicos"]);
  }

  public goEditar(idEvento: number) {
    this.router.navigate(["registro-academicos/" + idEvento]);
  }

  public delete(idEvento: number) {
    if (this.rol == 'administrador' || this.rol == 'maestro') {
      const dialogRef = this.dialog.open(EliminarEventoModalComponent, {
        data: { id: idEvento },
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.isDeleted) {
          console.log("Evento eliminado");
          alert("Evento eliminado correctamente.");
          window.location.reload();
        } else {
          alert("Evento no se ha podido eliminar.");
          console.log("No se eliminó el evento");
        }
      });
    } else {
      alert("No tienes permisos para eliminar eventos.");
    }
  }

  public canRegisterEvent(): boolean {
    return this.rol === 'administrador' || this.rol === 'maestro';
  }
}

export interface DatosEvento {
  id: number;
  nombre_evento: string;
  tipo_evento: string;
  fecha_realizacion: string;
  hora_inicio: string;
  hora_final: string;
  lugar: string;
  publico_objetivo: string;
  programa_educativo: string;
  responsable: string;
  descripcion: string;
  cupo_maximo: number;
}
