import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-informacion-vuelo',
  templateUrl: './informacion-vuelo.component.html',
  styleUrls: ['./informacion-vuelo.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InformacionVueloComponent {

  constructor(
    public dialogRef: MatDialogRef<InformacionVueloComponent>
  ) { 
    
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
