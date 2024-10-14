import { AirCleaningType } from "./air-cleaning-type";
import { DeviceMessage } from "./device-message";

/**
 * This class is a message from the Control System to NCHS devices
 * commanding them to turn on.
 * 
 */
export class AirCleanLensMessage extends DeviceMessage {

  /** The type of air cleaning to perform.  Corresponds to AirCleaningType. */
  public air_type: AirCleaningType;
}