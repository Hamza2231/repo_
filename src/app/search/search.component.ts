import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subject, throwError, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, retryWhen, retry } from "rxjs/operators";
import {SearchService} from "../search.service";

@Component({
  selector: 'app-search',
  template: `

  <section>
      <form [formGroup]="searchForm">
          <label>
             <input type="text" (keyup)="searchTerm.next($event)" formControlName="search" placeholder="Search Artists" />

             <div *ngIf="loading">
                  <p class="search-message">Searching</p>
                  <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
             </div>
          </label>

      </form>

      <div *ngIf="searchResults">
        <div class="results" >
          <div class="repo" *ngFor="let result of paginationElements | paginate: { itemsPerPage: 4, currentPage: page }">
              <div>
                  <img loading="lazy" [attr.src]="result.owner.avatar_url"
                      width="200"
                      height="auto"
                      alt="avatar"
                  />
                  <h2><a href="{{result.clone_url}}" target="_blank">{{result.full_name}}</a></h2>
                  <p><strong>{{result.owner.login}}</strong></p>
                  <p><em>Forks</em>: {{result.forks_count}}</p>
                  <p><em>Issues</em>: {{result.open_issues_count}}</p>
              </div>
          </div>
      </div>
          <pagination-controls (pageChange)="page = $event"></pagination-controls>
      </div>

      <div *ngIf="errorMessage" class="errorMessage">
          <h2>Error</h2>
          <p class="error">{{errorMessage}}</p>
      </div>

  </section>

  <ul *ngFor="let c of artists">
    <li>{{c.name}}</li>
  </ul>


  `,
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public app_id: any;
  public loading: boolean;
  public searchTerm = new Subject<string>();
  public _url = 'https://rest.bandsintown.com/artists/' + this.searchTerm + '/events?app_id=codingbootcamp';
  public searchResults: any;
  public paginationElements: any;
  public errorMessage: any;
  public page:any;

  constructor(private searchService: SearchService) { }

  public artists = [];

  public searchForm = new FormGroup({
    search: new FormControl('', Validators.required),
  });


  public search(){
    this.searchTerm.pipe(
      map((e: any) => {
        console.log(e.target.value);
        return e.target.value
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading = true;
        return this.searchService._searchEntries(term)
      }),
      catchError((e) => {
        console.log(e)
        this.loading = false;
        this.errorMessage = e.message;
        return throwError(e);
      }),
    ).subscribe(v => {
        this.loading = false;
        this.searchResults = v;
        this.paginationElements = this.searchResults;
    })
  }


  ngOnInit() {

    /*
    this.searchService.getArtists()
        .subscribe(data => this.artists = data); */

    this.search();
  }

}
