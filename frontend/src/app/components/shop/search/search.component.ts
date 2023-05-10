import { Component, OnInit } from '@angular/core';
import { Subject, Subscription, tap } from 'rxjs';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  searchResultChanged = new Subject<void>();
  searchResult = [];

  subscription:Subscription;
  constructor(
    ){}

  ngOnInit(): void {

  }
}
