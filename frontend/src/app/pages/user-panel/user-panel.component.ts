import { Component } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserRentalsComponent } from '../../components/user-rentals/user-rentals.component';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [NavBarComponent, UserFormComponent, UserRentalsComponent],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.scss',
})
export class UserPanelComponent {
  protected showEditUserForm: boolean = false;

  protected toggleShowEditUserForm(): void {
    this.showEditUserForm = !this.showEditUserForm;
  }
}
