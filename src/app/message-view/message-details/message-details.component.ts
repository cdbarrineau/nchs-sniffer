import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NchsViewMessage } from 'src/app/messages/view/nchs-view-message';
import { MessageConverter } from 'src/app/messages/message-converter';

/**
 * Displays the details of a message.
 * 
 */
@Component({
  selector: 'message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.scss']
})
export class MessageDetailsComponent implements OnChanges {

  /** Selected message in the table. */
  @Input()
  public message: NchsViewMessage;

  /** The message text. */
  public messageText = '';


  /**
   * Fired when changes to the input message changes.
   * 
   * @param changes The changes.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && this.message) {
      const deviceMessage = MessageConverter.convert(this.message.message);
      this.messageText = JSON.stringify(deviceMessage, null, 2);
    }
    else {
      this.clear();
    }
  }

  /**
   * Clears the text area.
   * 
   */
  public clear() {
    this.messageText = '';
  }
}
