import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  
  constructor(private http: HttpClient) { }

  upload(file: File){

      let headers = new HttpHeaders(
        {
            //'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'method': 'POST',
            'Authorization': localStorage.getItem('JWTToken')
        }
    );
    
    let formParams = new FormData();
    formParams.append('file', file)    
    return this.http.post(`${environment.apiUrl}/api/FileManager/uploads`, formParams)
    
  }

  getFiles(): Observable<any> {
    //return this.http.get(`${this.baseUrl}/files`);

        let headers = new HttpHeaders(
          {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'method': 'GET',
              'Authorization': localStorage.getItem('JWTToken')
          }
      );
      let options = { headers: headers };
      return this.http.get<Request[]>(`${environment.apiUrl}/api/FileManager/files`, options);
    }
}