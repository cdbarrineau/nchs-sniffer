import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Shows an info dialog.
 * 
 */
@Component({
  selector: 'info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent {

  /** Title text of confirmation dialog */
	public title: string;

	/** Body text of confirmation dialog */
	public message: string;

	/** True if this is a confirmation dialog. */
	public isConfirmation = false;

  /**
	 * Creates a new ConfirmationDialogComponent instance
	 * @param dialog Reference to the Material Dialog
	 * @param data Confirmation information to display
	 */
	constructor(public dialog: MatDialogRef<InfoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string, isConfirmation?: boolean }) {
		this.title = data.title;
		this.message = data.message;
		this.isConfirmation = data.isConfirmation;
	}

  /**
	 * Handles the user clicking the ok button.
   * 
	 */
	public ok() {
		this.dialog.close();
	}

	/**
	 * Closes this dialog with a yes confirmation.
	 * 
	 */
	public yes() {
		this.dialog.close(true);
	}

	/**
	 * Closes this dialog with a no confirmation.
	 * 
	 */
	public no() {
		this.dialog.close(false);
	}
}
