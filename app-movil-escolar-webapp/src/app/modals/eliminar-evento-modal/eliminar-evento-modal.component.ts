import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventosAcademicosService } from 'src/app/services/eventos-academicos.service';

@Component({
  selector: 'app-eliminar-evento-modal',
  templateUrl: './eliminar-evento-modal.component.html',
  styleUrls: ['./eliminar-evento-modal.component.scss']
})
export class EliminarEventoModalComponent implements OnInit {

  constructor(
    private eventosService: EventosAcademicosService,
    private dialogRef: MatDialogRef<EliminarEventoModalComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log("Id evento a eliminar:", this.data.id);
  }

  public cerrar_modal(){
    this.dialogRef.close({isDeleted:false});
  }

  public eliminarEvento(){
    this.eventosService.eliminarEventoAcademico(this.data.id).subscribe(
      (response)=>{
        console.log(response);
        this.dialogRef.close({isDeleted:true});
      }, (error)=>{
        console.error(error);
        this.dialogRef.close({isDeleted:false});
      }
    );
  }
}
