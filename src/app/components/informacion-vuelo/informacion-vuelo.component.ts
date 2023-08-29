import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-informacion-vuelo',
  templateUrl: './informacion-vuelo.component.html',
  styleUrls: ['./informacion-vuelo.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InformacionVueloComponent {

  constructor(
    public dialogRef: MatDialogRef<InformacionVueloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
