import { Component } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { BookTableComponent } from "../../components/book-table/book-table.component";
import { BookFormComponent } from "../../components/book-form/book-form.component";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [NavBarComponent, BookTableComponent, BookFormComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  showAddBookForm: boolean = false;

  toggleShowAddBookForm() {
    this.showAddBookForm = !this.showAddBookForm;
  }
}
