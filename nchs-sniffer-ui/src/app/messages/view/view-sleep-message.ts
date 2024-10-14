import { SleepMessage } from "../icd/sleep-message";
import { NchsMessage } from "../nchs-message";
import { ViewDeviceMessage } from "./view-device-message";

export class ViewSleepMessage extends ViewDeviceMessage {

  /** When set to true, turn on device sleep, false wakes the device up. */
  public sleepOn: boolean;

  /**
   * Converts this message.
   * 
   * @param message The message to convert.
   */
  public convert(message: NchsMessage): void {
    super.setDeviceMessageData(message);

    const sleepMessage = JSON.parse(message.envelope.payload) as SleepMessage;

    this.sleepOn = sleepMessage.sleep_on;
  }
}