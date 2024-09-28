import { AirCleanLensMessage } from "./icd/air-clean-lens-message";
import { getAirCleaningTypeDisplayString } from "./icd/air-cleaning-type";
import { getAmmoTypeDisplayString } from "./icd/ammo-type";
import { ConfigurationMessage } from "./icd/configuration-message";
import { DeviceMessage } from "./icd/device-message";
import { HitMessage } from "./icd/hit-message";
import { MessageType } from "./icd/message-type";
import { NchsMessage } from "./nchs-message";
import { ViewAirCleaningMessage } from "./view/view-air-cleaning-message";
import { ViewConfigurationMessage } from "./view/view-configuration-message";
import { ViewDeviceMessage } from "./view/view-device-message";
import { ViewDisconnectMessage } from "./view/view-disconnect-message";
import { ViewHealthRequrestMessage as ViewHealthRequestMessage } from "./view/view-health-request-message";
import { ViewHealthResponseMessage } from "./view/view-health-response-message";
import { ViewHitMessage } from "./view/view-hit-message";
import { ViewPowerOffMessage } from "./view/view-power-off-message";
import { ViewResetRoundNumberMessage } from "./view/view-reset-round-number-message";
import { ViewSleepMessage } from "./view/view-sleep-message";

/**
 * Converts an envelope body into a message class.
 * 
 */
export class MessageConverter {

  /**
   * Converts the payload of the envelope in the message into a device message.
   * 
   * @param message The message to convert.
   * @returns Returns the converted message or null if it's an unknown message.
   */
  public static convert(message: NchsMessage): ViewDeviceMessage {
    
    if (message.envelope.msg_type === MessageType.HitDetection) {
      const viewHitMessage = new ViewHitMessage();
      viewHitMessage.convert(message);
      return viewHitMessage;
    }
    else if (message.envelope.msg_type === MessageType.Configuration) {
      const viewConfigurationMessage = new ViewConfigurationMessage();
      viewConfigurationMessage.convert(message);
      return viewConfigurationMessage;
    }
    else if (message.envelope.msg_type === MessageType.AirCleanLens) {
      const viewAirCleaningMessage = new ViewAirCleaningMessage();
      viewAirCleaningMessage.convert(message);
      return viewAirCleaningMessage;
    }
    else if (message.envelope.msg_type === MessageType.Disconnect) {
      const viewDisconnectMessage = new ViewDisconnectMessage();
      viewDisconnectMessage.convert(message);
      return viewDisconnectMessage;
    }
    else if (message.envelope.msg_type === MessageType.HealthRequest) {
      const viewHealthRequestMessage = new ViewHealthRequestMessage();
      viewHealthRequestMessage.convert(message);
      return viewHealthRequestMessage;
    }
    else if (message.envelope.msg_type === MessageType.HealthResponse) {
      const viewHealthResponseMessage = new ViewHealthResponseMessage();
      viewHealthResponseMessage.convert(message);
      return viewHealthResponseMessage;
    }
    else if (message.envelope.msg_type === MessageType.PowerOff) {
      const viewPowerOffMessage = new ViewPowerOffMessage();
      viewPowerOffMessage.convert(message);
      return viewPowerOffMessage;
    }
    else if (message.envelope.msg_type === MessageType.ResetShotNumberMessage) {
      const viewResetRoundNumberMessage = new ViewResetRoundNumberMessage();
      viewResetRoundNumberMessage.convert(message);
      return viewResetRoundNumberMessage;
    }
    else if (message.envelope.msg_type === MessageType.Sleep) {
      const viewSleepMessage = new ViewSleepMessage();
      viewSleepMessage.convert(message);
      return viewSleepMessage;
    }

    return null;
  }
}