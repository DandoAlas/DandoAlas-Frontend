import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-asientos',
  templateUrl: './asientos.component.html',
  styleUrls: ['./asientos.component.css']
})
export class AsientosComponent implements OnInit{
  rows: any[] = [];
  disabledCheckboxes: string[] = [];
  selected: number = 0;
  isRandomActive = false;
  public eventListenersAttached: boolean = false;
  @Input() maxSelectedCheckboxes: number = 1;
  @ViewChild('seatsContainer') seatsContainer!: ElementRef;
  @Output() emitArrayAsientos = new EventEmitter<string[]>();
  allCheckboxes: HTMLInputElement[] = [];
  habilitadoImageSrc: string = '../assets/habilitado.jpg';
  desHabilitadoImageSrc: string = '../assets/desHabilitado.jpg';

  constructor(private el: ElementRef) {
    // Agrega las filas y asientos a la estructura
    for (let rowNumber = 1; rowNumber <= 9; rowNumber++) {
      const seats = ['A', 'B', 'C', 'D', 'E', 'F']; // Asientos de A a F por fila
      const row = {
        rowNumber: rowNumber,
        seats: seats.map(seat => ({
          id: `${rowNumber}${seat}`,
          selected: true,
          enabled: true, // Inicialmente, todos los asientos están habilitados
          imageSrc: this.habilitadoImageSrc // Inicialmente, se muestra la imagen habilitada
        }))
      };
      this.rows.push(row);
    }
    console.log(this.rows);
  }
  ngOnInit(): void {
    this.disableCheckboxes();
  }
  
  toggleSeatState(seat: any) {
    seat.enabled = !seat.enabled;
    seat.imageSrc = seat.enabled ? this.habilitadoImageSrc : this.desHabilitadoImageSrc;
    this.rows.forEach((row) => {
      row.seats.forEach((seat: any) => {
        seat.selected = false;
      });
    });
  }

  toggleRandom(): void {
    this.isRandomActive = !this.isRandomActive;

    if (!this.isRandomActive) {
      this.selectedCheckboxes = [];
      this.selected = 0;
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        if (checkbox instanceof HTMLInputElement) {
          checkbox.checked = false;
        }
      });
      this.rows.forEach((row) => {
        row.seats.forEach((seat: any) => {
          seat.selected = false;
        });
      });
      this.emitArrayAsientos.emit(this.selectedCheckboxes);
      console.log(this.selectedCheckboxes);
      for (const row of this.rows) {
        for (const seat of row.seats) {
          if (seat.selected) {
            seat.enabled = !seat.enabled;
            seat.imageSrc = seat.enabled ? this.habilitadoImageSrc : this.desHabilitadoImageSrc;
          }
        }
      }
    } 
    
    if (this.isRandomActive) {
      // Aquí puedes llamar a la función para seleccionar aleatoriamente los checkboxes
      this.selectedCheckboxes = [];
      this.selected = 0;
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        if (checkbox instanceof HTMLInputElement) {
          checkbox.checked = false;
        }
      });
      this.rows.forEach((row) => {
        row.seats.forEach((seat: any) => {
          seat.selected = false;
        });
      });
      this.selectRandomCheckboxes();
      this.emitArrayAsientos.emit(this.selectedCheckboxes);
      console.log(this.selectedCheckboxes);
      for (const row of this.rows) {
        for (const seat of row.seats) {
          if (seat.selected) {
            seat.enabled = !seat.enabled;
            seat.imageSrc = seat.enabled ? this.habilitadoImageSrc : this.desHabilitadoImageSrc;
          }
        }
      }
    }
  }

  selectedCheckboxes: string[] = [];

  extractSelectedCheckboxes() {
    this.selectedCheckboxes = [];
    for (const row of this.rows) {
      for (const seat of row.seats) {
        if (seat.selected) {
          this.selectedCheckboxes.push(seat.id);
        }
      }
    }
  }

  handleCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const rowIdMatches = checkbox.id.match(/^(\d+)/);
    if (rowIdMatches) {
      const rowId = Number(rowIdMatches[1]) - 1;
      if (rowId >= 0 && rowId <= this.rows.length) {
        const row = this.rows[rowId].seats;
        const selectedSeat = row.find((seat: any) => seat.id === checkbox.id);
  
        if (selectedSeat) {
          selectedSeat.selected = checkbox.checked;
          this.extractSelectedCheckboxes();
        }
  
        if (checkbox.checked) {
          if (this.selectedCheckboxes.length <= this.maxSelectedCheckboxes) {
            this.selected++;
            if (this.selectedCheckboxes.length === this.maxSelectedCheckboxes) {
            }
          } else {
            checkbox.checked = false;
          }
        } else {
          this.selected--;
        }
      } else {
        console.log('Row ID fuera de límites:', rowId);
      }
    }
  }

  disableCheckboxes() {
    const checkboxes: NodeListOf<HTMLInputElement> = this.el.nativeElement.querySelectorAll(
      'input[type="checkbox"]'
    );

    checkboxes.forEach((checkbox) => {
      if (this.disabledCheckboxes.includes(checkbox.id)) {
        checkbox.disabled = true;
      } else {
        checkbox.disabled = false;
      }
    });
  }

// Selecciona aleatoriamente 'count' checkboxes de la matriz de checkboxes disponibles
selectRandomCheckboxes() {
  const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:not(:disabled)')) as HTMLInputElement[];
  const availableCheckboxes = checkboxes.filter((checkbox) => !this.selectedCheckboxes.includes(checkbox.id));
  let count = this.maxSelectedCheckboxes - this.selectedCheckboxes.length;

  while (count > 0 && availableCheckboxes.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableCheckboxes.length);
    const randomCheckbox = availableCheckboxes.splice(randomIndex, 1)[0];
    randomCheckbox.checked = true;

    // Simular un evento 'change' en el checkbox seleccionado aleatoriamente
    const event = new Event('change', { bubbles: true });
    Object.defineProperty(event, 'target', { value: randomCheckbox, enumerable: true });

    this.handleCheckboxChange(event);

    count--;
  }
}

  displayStyle = "none";
  
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.emitArrayAsientos.emit(this.selectedCheckboxes);
    this.displayStyle = "none";
  }
}
