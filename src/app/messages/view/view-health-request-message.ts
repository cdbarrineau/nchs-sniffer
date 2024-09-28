import { NchsMessage } from "../nchs-message";
import { ViewDeviceMessage } from "./view-device-message";

/**
 * View health request message.
 * 
 */
export class ViewHealthRequrestMessage extends ViewDeviceMessage {

  /**
   * Converts this message.
   * 
   * @param message The message to convert.
   */
  public convert(message: NchsMessage): void {
    super.setDeviceMessageData(message);
  }
}