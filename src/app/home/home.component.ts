import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfigLoader } from '../util/config-loader';
import { NchsSnifferService } from '../nchs-sniffer.service';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { InputDialogComponent } from '../input-dialog/input-dialog.component';
import { AppConfig } from '../util/app-config';
import { ConnectionDialogComponent } from '../connection-dialog/connection-dialog.component';
import { MessageViewComponent } from '../message-view/message-view.component';


/**
 * Main view for the sniffer.
 * 
 */
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  /** Reference to the message view to clear table data. */
  @ViewChild(MessageViewComponent)
  public messageViewComponent: MessageViewComponent;

  /** The version of the app. */
  public version: string;

  /** List of topics to display in the list. */
  public topics: string[] = [];

  /** The currently selected topic. */
  public selectedTopic: string;

  /** True if the toolbar buttons should be disabled. */
  public toolbarButtonsDisabled = true;

  /** True for playing events, false for paused. */
  public playingEvents = true;

  /** Reference to the splash screen dialog. */
	private connectionDialogRef: MatDialogRef<ConnectionDialogComponent, any> | null;

  /** Used to unsubscribe from connected events. */
  private connectedSubsciption: Subscription;

  /** Used to unsubscribe from disconnected events. */
  private disconnectedSubscription: Subscription;

  /** Used to unsubscribe from error events. */
  private errorSubscription: Subscription;

  /** Used to unsubscribe from new topic events. */
  private newTopicSubscription: Subscription;
  

  /**
   * Constructor.
   * 
   * @param dialog Used to show dialogs.
   * @param configLoader Used to load config data.
   * @param nchsSnifferService Used to interface with the back-end message broker.
   */
  constructor(
    private dialog: MatDialog,
    private configLoader: ConfigLoader, 
    private nchsSnifferService: NchsSnifferService) {
  }

  /**
   * Fired to initialize this component.
   * 
   */
  public ngOnInit(): void {
    this.configLoader.getConfig().subscribe({
      next: (config) => {
        this.initialize(config);
      },
      error: (error) => {
        console.error('Error loading config data.', error);
        this.info('Error', 'Error loading config data: ' + JSON.stringify(error));
      }
    });
  }

  /**
   * Fired to destroy this component.
   * 
   */
  public ngOnDestroy(): void {
    this.connectedSubsciption.unsubscribe();
    this.disconnectedSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
    this.newTopicSubscription.unsubscribe();
  }

  /**
   * Fired when the user selects a topic from the topic list.
   * 
   * @param event The event associated with the selection change.
   */
  public selectedTopicChanged(event: MatSelectionListChange) {
    if (event.options.length > 0) {
      this.selectedTopic = event.options[0].value;
    }
    else {
      this.selectedTopic = null;
    }

    this.toolbarButtonsDisabled = !this.messageViewComponent.hasEvents();
  }

  /**
   * Clears all data in the table for the selected topic.
   * 
   */
  public clearTableData() {
    this.info('Confirm', 'Are you sure you want to clear all events for this topic?', true).subscribe(result => {
      if (result) {
        this.messageViewComponent.clear();
        this.nchsSnifferService.clearMessages(this.selectedTopic);
      }
    });
  }

  /**
   * Fired from the table component when messages are added or deleted.
   * 
   * @param hasMessages True if there are messages in the table, false if not.
   */
  public tableMessagesChanged(hasMessages: boolean) {
    // Get around expression checked error.
    setTimeout(() => {
      this.toolbarButtonsDisabled = !hasMessages;
    }, 100);
  }

  /**
   * Plays events being added to the table.
   * 
   */
  public play() {
    this.playingEvents = true;
  }

  /**
   * Pauses events being added to the table.
   * 
   */
  public pause() {
    this.playingEvents = false;
  }

  /**
   * Initializes the back-end.
   * 
   * @param appConfig The application configuration data.
   */
  private initialize(appConfig: AppConfig) {

    for (const topic of this.nchsSnifferService.topics) {
      this.addTopic(topic);
    }

    this.connectedSubsciption = this.nchsSnifferService.onConnected.subscribe(() => this.onConnected());
    this.disconnectedSubscription = this.nchsSnifferService.onDisconnected.subscribe(message => this.onDisconnected(message));
    this.errorSubscription = this.nchsSnifferService.onError.subscribe(error => this.handleError(error));
    this.newTopicSubscription = this.nchsSnifferService.onNewTopic.subscribe(topic => this.addTopic(topic));

    this.showInputDialog('Message Broker IP', 'Enter the IP of the Message Broker', false, 'localhost').subscribe({
      next: (ip) => {
        this.showConnectionDialog('Attempt to connect to message broker at ' + ip + '...', true);
        
        this.nchsSnifferService.connect(ip, appConfig);
      }
    });
  }

  /**
   * Fired when connected to the message broker.
   * 
   */
  private onConnected() {
    this.closeConnectionDialog();
  }

  /**
   * Fired when disconnected from the message broker.
   * 
   * @param message Any message associated with the disconnect.
   */
  private onDisconnected(message: string) {
    this.showConnectionDialog(message);
  }

  /**
   * Adds a topic to the topic list if not present already.
   * 
   * @param topic The topic to add if it does not exist already.
   */
  private addTopic(topic: string) {
    const index = this.topics.indexOf(topic);
    if (index < 0) {
      this.topics.push(topic);
    }
  }

  /**
   * Handles an error.
   * 
   * @param error The error to handle.
   */
  private handleError(error: string) {
    console.error('Got error: ', error);
    this.info('Error', error);
  }

  /**
   * Shows an input dialog.
   * 
   * @param title The title to display in the dialog.
   * @param message The message to display in the dialog.
   * @param showCancelButton True to show the cancel button, false to hide it.
   * @param defaultText Any default text to display in the dialog input field.
   * @returns Returns an Observable after the user has closed the dialog.
   */
  private showInputDialog(title: string, message: string, showCancelButton: boolean, defaultText: string) {
    return this.dialog
      .open(InputDialogComponent, {
        data: { title, message, showCancelButton, defaultText },
        disableClose: true,
      })
      .afterClosed();
  }

  /**
   * Show an info dialog.
   *
   * @param title title of dialog.
   * @param message Message body of dialog.
   * @returns Returns an Observable after the dialog has been closed.
   */
  private info(title: string, message: string, isConfirmation?: boolean) {
    return this.dialog
      .open(InfoDialogComponent, {
        data: { 
          title: title,
          message: message,
          isConfirmation: isConfirmation },
        disableClose: true,
      })
      .afterClosed();
  }

  /**
	 * Shows the connection lost dialog.
	 * 
   * @param message Any message to show the user.
	 */
	private showConnectionDialog(message?: string, showCancelButton?: boolean) {
		if (!this.connectionDialogRef) {
			this.connectionDialogRef = this.dialog.open(ConnectionDialogComponent, {
        data: { 
          message: message,
          showCancelButton: showCancelButton 
        },
        disableClose: true
      });
		}
	}

	/**
	 * Closes the connection dialog.
	 * 
	 */
	private closeConnectionDialog() {
		if (this.connectionDialogRef) {
			this.connectionDialogRef.close();
			this.connectionDialogRef = null;
		}
	}
}
