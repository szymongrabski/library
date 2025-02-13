import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() public message: string = '';
  @Output() public userResponse: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public onAccept(): void {
    this.userResponse.emit(true);
  }

  public onCancel(): void {
    this.userResponse.emit(false);
  }
}
