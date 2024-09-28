import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NchsMessage } from '../messages/nchs-message';
import { NchsViewMessage } from '../messages/view/nchs-view-message';
import { MessageTableComponent } from './message-table/message-table.component';

/**
 * Main view for displaying NCHS messages.
 * 
 */
@Component({
  selector: 'message-view',
  templateUrl: './message-view.component.html',
  styleUrls: ['./message-view.component.scss']
})
export class MessageViewComponent {

  /** Reference to the table to clear messages. */
  @ViewChild(MessageTableComponent)
  public messageTableComponent: MessageTableComponent;

  /** The topic to display messages for. */
  @Input()
  public topic: string;

  /** True for playing events, false for paused. */
  @Input()
  public playingEvents = true;

  /** Fired when messages have been added or removed from the table. */
  @Output()
  public messagesChanged = new EventEmitter<boolean>();

  /** Selected message in the table. */
  public selectedMessage: NchsViewMessage;


  /**
   * Constructor.
   * 
   */
  constructor() {
  }

  /**
   * Fired when the selected message in the table changes.
   * 
   * @param message The message that was selected.
   */
  public selectedMessageChanged(message: NchsViewMessage) {
    this.selectedMessage = message;
  }

  /**
   * Clears the table data.
   * 
   */
  public clear() {
    this.messageTableComponent.clear();
  }

  /**
   * True if there are events in the table, false for no events.
   * 
   */
  public hasEvents() {
    return this.messageTableComponent.hasEvents();
  }
}
