import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IArtist } from "./artist";
import { Observable, observable, of, empty, concat } from 'rxjs';
import { map } from "rxjs/operators";



@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public app_id: any;
  public _url = 'https://rest.bandsintown.com/artists/' + this.app_id + '/?app_id=codingbootcamp';
  public searchResults: any;

  constructor(private http: HttpClient) { }
  //Making HTTP request

  getArtists():Observable<IArtist[]>{
    return this.http.get<IArtist[]>(this._url);
  }

  public searchEntries(term): Observable<any>{
    if (term === "" )
    {
      console.log("Not defined");
      return of(null);    //return empty();
    }
    else
    {
      let params = {q: term }
      return this.http.get(this._url, {params})
      .pipe(  map(  response =>
              {   console.log(response)
                  return this.searchResults = response["items"];
              })
      );
    }
  }

  //returns the response
  public _searchEntries(term){
    return this.searchEntries(term);
  }

  // getting Events Information


}
