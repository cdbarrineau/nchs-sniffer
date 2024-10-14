import { NchsMessage } from "../nchs-message";
import { ViewDeviceMessage } from "./view-device-message";

/**
 * View message for reset round numnber.
 * 
 */
export class ViewResetRoundNumberMessage extends ViewDeviceMessage {
  /**
   * Converts this message.
   * 
   * @param message The message to convert.
   */
  public convert(message: NchsMessage): void {
    super.setDeviceMessageData(message);
  }
}