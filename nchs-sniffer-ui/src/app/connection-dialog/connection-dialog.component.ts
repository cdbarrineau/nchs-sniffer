import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'connection-dialog',
  templateUrl: './connection-dialog.component.html',
  styleUrls: ['./connection-dialog.component.scss']
})
export class ConnectionDialogComponent {

  /** The message to display. */
  public message = 'Connection has been lost. Attempting to reconnect...';

  /**
   * Creates a new ConfirmationDialogComponent instance
   * @param dialog Reference to the Material Dialog
   * @param data Confirmation information to display
   */
  constructor(
    public dialog: MatDialogRef<ConnectionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {	message?: string }) {
      if (data.message) {
        this.message = data.message;
      }
  }
}
