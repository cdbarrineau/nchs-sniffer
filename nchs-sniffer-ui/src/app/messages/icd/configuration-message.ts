import { AirCleaningType } from "./air-cleaning-type";
import { AmmoType } from "./ammo-type";
import { DeviceMessage } from "./device-message";

/**
 * This class is sent from the Control System to the NCHS devices to inform the
 * devices about current configuration conditions.
 * 
 */
export class ConfigurationMessage extends DeviceMessage {

  /** The current temperature in degrees Fahrenheit. */
  public temperature: number;

  /** The type of ammo the shooters are firing. */
  public ammo: AmmoType;

  /** The distance the shooter is firing at to the targets in meters. */
  public distance_m: number;

  /** The separation of the shooters between lanes in meters. */
  public shooter_sep_m: number;

  /** When set to true, turn on device sleep, false wakes the device up. */
  public sleep_on: boolean;

  /** The type of air cleaning to perform.  Corresponds to AirCleaningType. */
  public air_type: AirCleaningType;

  /** True to reset the shot number. */
  public reset_shot_num: boolean;

  /**
   * List of lanes from which the Device will be engaged.  This is a contiguous list
   * from 0..n integer values where each value is the lane number.
   */
  public lanes: number[];

  /**
   * The latitude of the sensor in degrees, decimal degrees (e.g. 27.9987) from -90 to 90 where a negative value is
   * the southern hemisphere and positive is the northern hemisphere. <br>
   * <strong>This attribute is for use with laser sensors.</strong>
   */
  public latitude: number;

  /**
   * The longitude of the sensor in degrees, decimal degrees (e.g. 137.9987) from -180 to 180. <br>
   * <strong>This attribute is for use with laser sensors.</strong>
   */
  public longitude: number;

  /**
   * The orientation of the device relative to true north from 0-359. <br>
   * <strong>This attribute is for use with laser sensors.</strong>
   */
  public orientation: number;
}