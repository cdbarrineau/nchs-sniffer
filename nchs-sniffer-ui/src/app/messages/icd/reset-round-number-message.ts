import { DeviceMessage } from "./device-message";

/**
 * This class is a Control System internal message (it does not come
 * from a device) that the round number on a device (that is also internal)
 * has been reset.
 */
export class ResetRoundNumberMessage extends DeviceMessage {
}