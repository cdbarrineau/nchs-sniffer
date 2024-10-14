import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent {

  /** Title text of confirmation dialog */
	public title: string;

	/** Body text of confirmation dialog */
	public message: string;

	/** The input text from the user. */
	public inputText = '';

  /** Shows or hides the cancel button. */
  public showCancelButton = true;


  /**
	 * Creates a new ConfirmationDialogComponent instance
	 * @param dialog Reference to the Material Dialog
	 * @param data Confirmation information to display
	 */
	constructor(public dialog: MatDialogRef<InputDialogComponent>, 
			@Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string; showCancelButton?: boolean; defaultText?: string }) {
		this.title = data.title;
		this.message = data.message;
    this.showCancelButton = data.showCancelButton;
		this.inputText = data.defaultText ? data.defaultText : '';
	}

	/**
	 * Handles a user pressing a key in the input.
   * 
	 */
	public keyPressed(event: KeyboardEvent) {
		if (event.code === 'Enter') {
			this.ok();
		}
	}

	/**
	 * Handles the user clicking the OK button.
   * 
	 */
	public ok() {
		if (this.inputText && this.inputText.trim().length > 0) {
			this.dialog.close(this.inputText.trim());
		}
	}

	/**
	 * Handles the user clicking the cancel button.
   * 
	 */
	public cancel() {
		this.dialog.close();
	}
}
