import { NchsMessage } from "../nchs-message";
import { ViewDeviceMessage } from "./view-device-message";

/**
 * View power off message.
 * 
 */
export class ViewPowerOffMessage extends ViewDeviceMessage {
  /**
   * Converts this message.
   * 
   * @param message The message to convert.
   */
  public convert(message: NchsMessage): void {
    super.setDeviceMessageData(message);
  }
}