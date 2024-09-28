/**
 * This class enumerates the message types in the NCHS ICD.
 * 
 */
export enum MessageType {
  HitDetection,
  Sleep,
  HealthRequest,
  HealthResponse,
  Configuration,
  AirCleanLens,
  Disconnect,
  ResetShotNumberMessage,
  PowerOff
}

export const HitDetectionDisplayString = 'Hit Detection';
export const SleepDisplayString = 'Sleep';
export const HealthRequestDisplayString = 'Health Request';
export const HealthResponseDisplayString = 'Health Response';
export const ConfigurationDisplayString = 'Configuration';
export const AirCleanLensDisplayString = 'Air Clean Lens';
export const DisconnectDisplayString = 'Disconnected';
export const ResetShotNumberMessageDisplayString = 'Reset Shot Number';
export const PowerOffMessageDisplayString = 'Power Off';

/**
 * Gets the string representation of a message type.
 * 
 * @param messageType The message type to get the string for.
 * @returns Returns the string representation.
 */
export function getMessageTypeDisplayString(messageType: MessageType): string {
  switch (messageType) {
    case MessageType.HitDetection:
      return HitDetectionDisplayString;
    case MessageType.Sleep:
      return SleepDisplayString;
    case MessageType.HealthRequest:
      return HealthRequestDisplayString;
    case MessageType.HealthResponse:
      return HealthResponseDisplayString;
    case MessageType.Configuration:
      return ConfigurationDisplayString;
    case MessageType.AirCleanLens:
      return AirCleanLensDisplayString;
    case MessageType.Disconnect:
      return DisconnectDisplayString;
    case MessageType.ResetShotNumberMessage:
      return ResetShotNumberMessageDisplayString;
    case MessageType.PowerOff:
      return PowerOffMessageDisplayString;
    default:
      return 'Unknown';
  }
}

/**
 * Gets the message type from its display string value.
 * 
 * @param displayString The display string to convert.
 * @returns Returns the message type or null if it could not be found.
 */
export function fromMessageTypeDisplayString(displayString: string): MessageType {
  switch (displayString) {
    case HitDetectionDisplayString:
      return MessageType.HitDetection;
    case SleepDisplayString:
      return MessageType.Sleep;
    case HealthRequestDisplayString:
      return MessageType.HealthRequest;
    case HealthResponseDisplayString:
      return MessageType.HealthResponse;
    case ConfigurationDisplayString:
      return MessageType.Configuration;
    case AirCleanLensDisplayString:
      return MessageType.AirCleanLens;
    case DisconnectDisplayString:
      return MessageType.Disconnect;
    case ResetShotNumberMessageDisplayString:
      return MessageType.ResetShotNumberMessage;
    case PowerOffMessageDisplayString:
      return MessageType.PowerOff;
    default:
      console.error('Unknown message type display string passed to fromMessageTypeDisplayString: ', displayString);
      return null;
  }
}