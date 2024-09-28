import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { InfoDialogComponent } from 'src/app/info-dialog/info-dialog.component';
import { NchsMessage } from 'src/app/messages/nchs-message';
import { NchsSnifferService } from 'src/app/nchs-sniffer.service';
import { NchsViewMessage } from 'src/app/messages/view/nchs-view-message';
import { getMessageTypeDisplayString } from 'src/app/messages/icd/message-type';

/**
 * Displays a table of messages for a given topic.
 * 
 */
@Component({
  selector: 'message-table',
  templateUrl: './message-table.component.html',
  styleUrls: ['./message-table.component.scss']
})
export class MessageTableComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  /** The table sorter. */
  @ViewChild(MatSort)
  public sort: MatSort;

  /** The topic to display messages for. */
  @Input()
  public topic: string;

  /** Fired when the selected message in the table changes. */
  @Output()
  public selectedMessageChanged = new EventEmitter<NchsViewMessage>();

  /** Fired when messages have been added or removed from the table. */
  @Output()
  public messagesChanged = new EventEmitter<boolean>();

  /** Any selected message. */
  public selectedMessage: NchsViewMessage;

  /** Backing data source for the Message table. */
  public dataSource = new MatTableDataSource<NchsViewMessage>();

  /** The name of the KDAS device columns that are displayed. */
  public displayedColumns = ['messageType', 'timestamp', 'deviceId', 'deviceIdAsMac'];

  /** True for playing events, false for paused. */
  public playingEvents = true;

  /** Used to unsibscribe from message events. */
  private messageSubscription: Subscription;

  /** Used to unsibscribe from max message deleted events. */
  private messageDeletedSubscription: Subscription;


  /**
   * Constructor.
   * 
   * @param dialog Used to show dialogs.
   * @param nchsSnifferService Used to interface with the back-end.
   */
  constructor(
    private dialog: MatDialog,
    private nchsSnifferService: NchsSnifferService) {
  }

  /**
   * Fired to initialize this component.
   * 
   */
  public ngOnInit(): void {
    this.messageSubscription = this.nchsSnifferService.onMessage.subscribe(message => this.addMessage(message));
    this.messageDeletedSubscription = this.nchsSnifferService.messageDeleted.subscribe(message => this.deleteMessage(message));

    this.loadMessages();
  }

  /**
   * Installs the table sorter.
   * 
   */
  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    // Default sort the table by timestamp.
    // Get around the expression changed after checked.
    setTimeout(() => {
      this.sort.sort({ id: 'timestamp', start: 'desc', disableClear: false });
    }, 100);
  }

  /**
   * Fired when changes have occured to the inputs.
   * 
   * @param changes The changes.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['topic'] && this.topic) {
      this.loadMessages();
    }
  }

  /**
   * Fired to destroy this component.
   * 
   */
  public ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
    this.messageDeletedSubscription.unsubscribe();
  }

  /**
   * Applies a filtering of the LOMAH table.
   * 
   * @param event The event to apply the filter with.
   */
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Changes the selected message in the table.
   * 
   * @param row The row in the table that was clicked.
   */
  public tableRowClicked(row: NchsViewMessage) {
    if (this.selectedMessage && this.selectedMessage.message.id === row.message.id) {
      this.selectedMessage = null;

      this.selectedMessageChanged.next(null);
    }
    else {
      this.selectedMessage = row;

      this.selectedMessageChanged.next(row);
    }
  }

  /**
   * True if there are events in the table, false for no events.
   * 
   */
  public hasEvents() {
    return this.dataSource.data.length > 0;
  }

  /**
   * Clears the table data.
   * 
   */
  public clear() {
    this.selectedMessage = null;
    this.dataSource.data.length = 0;
    this.dataSource.data = this.dataSource.data;

    this.selectedMessageChanged.next(null);

    this.messagesChanged.emit(false);
  }

  /**
   * Plays events being added to the table.
   * 
   */
  public play() {
    this.playingEvents = true;

    this.loadMessages();
  }

  /**
   * Pauses events being added to the table.
   * 
   */
  public pause() {
    this.playingEvents = false;
  }

  /**
   * Loads all specified messages.
   * 
   */
  private loadMessages() {
    if (!this.topic) {
      return;
    }

    const messages = this.nchsSnifferService.getMessages(this.topic);
    if (messages) {
      const viewMessages: NchsViewMessage[] = [];

      for (const message of messages) {
        viewMessages.push(this.createViewMessage(message));
      }

      this.dataSource.data = viewMessages;

      this.messagesChanged.emit(true);
    }
  }

  /**
   * Adds a message to the map and optionally the messages being displayed.
   * 
   * @param message The message to add.
   */
  private addMessage(message: NchsMessage) {
    if (!this.playingEvents) {
      return;
    }

    // Make sure we are looking at the correct topic.
    if (message.topic === this.topic) {
      const viewMessage = this.createViewMessage(message);

      this.dataSource.data.push(viewMessage);

      this.dataSource.data = this.dataSource.data;

      this.messagesChanged.emit(true);
    }
  }

  /**
   * Fired when a message has been deleted as a result of max messages
   * being reached for a topic.
   * 
   * @param message The message that was deleted.
   */
  private deleteMessage(message: NchsMessage) {
    if (!this.playingEvents) {
      return;
    }
    
    if (this.topic === message.topic) {
      const index = this.dataSource.data.findIndex(m => m.message.id === message.id);
      if (index >= 0) {
        this.dataSource.data.splice(index, 1);

        this.dataSource.data = this.dataSource.data;

        this.messagesChanged.emit(false);
      }
    }
  }

  /**
   * Creates and returns a new view message from the supplied message.
   * 
   * @param message The message to create a view message from.
   * @returns Returns the view message.
   */
  private createViewMessage(message: NchsMessage): NchsViewMessage {
    const viewMessage = new NchsViewMessage();
    viewMessage.messageType = getMessageTypeDisplayString(message.envelope.msg_type);
    viewMessage.timestamp = message.envelope.timestamp;
    viewMessage.deviceId = message.envelope.device_id;
    viewMessage.deviceIdAsMac = message.deviceIdAsMac;
    viewMessage.message = message;

    return viewMessage;
  }

  /**
   * Show an info dialog.
   *
   * @param title title of dialog.
   * @param message Message body of dialog.
   * @returns Returns an Observable after the dialog has been closed.
   */
  private info(title: string, message: string) {
    return this.dialog
      .open(InfoDialogComponent, {
        data: { title, message },
        disableClose: true,
      })
      .afterClosed();
  }
}
