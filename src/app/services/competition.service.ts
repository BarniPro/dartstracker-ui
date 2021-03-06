import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {throwError as observableThrowError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {CompetitionModel} from '../models/competition.model';
import Competition = CompetitionModel.Competition;
import {UserModel} from '../models/user.model';
import User = UserModel.User;
import {httpOptions} from './auth.service';

@Injectable()
export class CompetitionService {

  private baseUrl = 'http://localhost:8080/competitions';

  constructor(private http: HttpClient) {
    const token = window.localStorage.getItem('token');
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Basic ' + token);
  }

  get() {
    return this.http
      .get<Competition[]>(this.baseUrl, httpOptions)
      .pipe(map(data => data), catchError(this.handleError));
  }

  getOne(request: CompetitionModel.GetRequest) {
    const url = this.baseUrl + '/' + request.id.toString();
    return this.http
      .get<Competition>(url, httpOptions)
      .pipe(map(data => data), catchError(this.handleError));
  }

  create(request: CompetitionModel.CreateRequest) {
    return this.http
      .post<Competition>(this.baseUrl, request, httpOptions)
      .pipe(map(data => data), catchError(this.handleError));
  }

  update(request: CompetitionModel.UpdateRequest) {
    const url = this.baseUrl + '/' + request.id.toString();
    return this.http
      .put<Competition>(url, request, httpOptions)
      .pipe(map(data => data), catchError(this.handleError));
  }

  delete(request: CompetitionModel.DeleteRequest) {
    const url = this.baseUrl + '/' + request.id.toString();
    return this.http
      .delete<Competition>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(res: HttpErrorResponse | any) {
    console.error(res.error || res.body.error);
    return observableThrowError(res.error || 'Server error');
  }

  // editor-fold official controller

  getOfficials(request: CompetitionModel.QueryOfficialsRequest) {
    const url = this.baseUrl + '/' + request.competition_id + '/officials';
    return this.http
      .get<User[]>(url, httpOptions)
      .pipe(map(data => data), catchError(this.handleError));
  }

  removeOfficials(request: CompetitionModel.RemoveOfficialsRequest) {
    const url = this.baseUrl + '/' + request.competition_id + '/officials';
    return this.http
      .delete<User>(url, httpOptions)
      .pipe(map(data => data), catchError(this.handleError));
  }

  addOfficial(request: CompetitionModel.AddOfficialRequest, official: User) {
    const url = this.baseUrl + '/' + request.competition_id + '/officials';
    return this.http
      .post<User>(url, official, httpOptions)
      .pipe(map(data => data), catchError(this.handleError));
  }

  removeOfficial(request: CompetitionModel.RemoveOfficialRequest) {
    const url = this.baseUrl + '/' + request.competition_id + '/officials/' + request.id;
    return this.http
      .delete<User>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  // editor-fold


}
