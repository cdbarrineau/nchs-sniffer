import { DeviceMessage } from "./device-message";

/**
 * This class is a command message sent from the Control System
 * to the NCHS devices to command them to turn on or off
 * sleep mode.
 * 
 */
export class SleepMessage extends DeviceMessage {

  /** When set to true, turn on device sleep, false wakes the device up. */
  public sleep_on: boolean;
}