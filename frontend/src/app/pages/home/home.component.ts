import { Component } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { BookListComponent } from "../../components/book-list/book-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavBarComponent, BookListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
