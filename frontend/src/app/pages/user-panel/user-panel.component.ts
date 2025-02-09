import { Component } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [NavBarComponent, UserFormComponent],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.scss'
})
export class UserPanelComponent {
  showEditUserForm: boolean = false;

  toggleShowEditUserForm(): void {
    this.showEditUserForm = !this.showEditUserForm
  }
}
