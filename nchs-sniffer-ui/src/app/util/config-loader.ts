import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';

import { AppConfig } from "./app-config";

/**
 * Service used to load configuration data.
 * 
 */
@Injectable()
export class ConfigLoader {

  /** The config file. */
  private static readonly ConfigFile = 'assets/json/app-config.json';

  /** In memory cache of the app config. */
  private appConfigModel: AppConfig;

  /**
   * Constructor.
   *
   * @param http Used to file data.
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Gets the app config model.
   * 
   * @returns Returns the app config model.
   */
  public getConfig(): Observable<AppConfig> {

    if (this.appConfigModel) {
      return of(this.appConfigModel);
    }
    else {
      return this.http.get<AppConfig>(ConfigLoader.ConfigFile).pipe(map(result => {
        this.appConfigModel = result;
        return this.appConfigModel;
      }),
        catchError(this.handleError));
    }
  }

  /**
   * Handles a back-end error.
   *
   * @param error The error to handle.
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error communicating with Server.', error);
    return throwError(() =>
      'Error communicating with the Server.  Make sure your Server is running and check the console for details.'
    );
  }
}