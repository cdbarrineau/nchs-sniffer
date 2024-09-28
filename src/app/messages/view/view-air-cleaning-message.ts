import { AirCleanLensMessage } from "../icd/air-clean-lens-message";
import { getAirCleaningTypeDisplayString } from "../icd/air-cleaning-type";
import { NchsMessage } from "../nchs-message";
import { ViewDeviceMessage } from "./view-device-message";

/**
 * View air cleaning message.
 * 
 */
export class ViewAirCleaningMessage extends ViewDeviceMessage {
  /** The air cleaning type as a display string. */
  public airType = '';

  /**
   * Converts this message.
   * 
   * @param message The message to convert.
   */
  public convert(message: NchsMessage): void {
    const airCleaning = JSON.parse(message.envelope.payload) as AirCleanLensMessage;

    super.setDeviceMessageData(message);

    this.airType = getAirCleaningTypeDisplayString(airCleaning.air_type);
  }
}