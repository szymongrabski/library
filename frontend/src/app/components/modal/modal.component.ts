import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() message: string = '';
  @Output() result: EventEmitter<boolean> = new EventEmitter<boolean>();

  onAccept() {
    this.result.emit(true);
  }

  onCancel() {
    this.result.emit(false);
  }
}
