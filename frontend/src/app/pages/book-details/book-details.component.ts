import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { BookService } from '../../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit {
  bookId!: number;
  constructor(private bookService: BookService, private route: ActivatedRoute, private router: Router) {};

  handleDelete(): void {
    this.bookService.deleteBook(this.bookId);
    this.router.navigate(["/admin-panel"]);
    
  }

  ngOnInit(): void {
    this.route.params.subscribe((res) => {
      this.bookId = res['id'];
    });
  }
}
