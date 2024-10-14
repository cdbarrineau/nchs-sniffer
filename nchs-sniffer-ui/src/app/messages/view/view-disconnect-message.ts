import { DisconnectMessage } from "../icd/disconnect-message";
import { NchsMessage } from "../nchs-message";
import { ViewDeviceMessage } from "./view-device-message";

/**
 * View disconnect message.
 * 
 */
export class ViewDisconnectMessage extends ViewDeviceMessage {

  /** Any message associated with the disconnect. */
  public message: string;

  /**
   * Converts this message.
   * 
   * @param message The message to convert.
   */
  public convert(message: NchsMessage): void {
    const disconnectMessage = JSON.parse(message.envelope.payload) as DisconnectMessage;

    super.setDeviceMessageData(message);

    this.message = disconnectMessage.message;
  }
}