import { AirCleaningType } from "./air-cleaning-type";
import { AmmoType } from "./ammo-type";
import { DeviceMessage } from "./device-message";

/**
 * This class is a message from a NCHS for the device's health response.
 * 
 */
export class HealthResponseMessage extends DeviceMessage {

  /** The current battery levels.  The maximum value is 100 as a percentage.  The minimum value is 0 as a percentage. */
  public battery: number;

  /** The operational status of the cameras. */
  public cameras_ops: boolean;

  /** The operational status of the radars. */
  public radars_ops: boolean;

  /** The operational status of the solar blocks. */
  public solar_blocks_ops: boolean;

  /** True if there are messages that are dropped or unsent. */
  public comms_status: boolean;

  /** The operational status of the air clearing. */
  public air_ops: boolean;

  /** True if the device is in sleep mode. */
  public sleep_on: boolean;

  /** True if the device's air is on. */
  public air_type: AirCleaningType;

  /** The selected ammo for the device. */
  public ammo: AmmoType;

  /** The distance the shooter is firing at to the targets in meters. */
  public distance_m: number;

  /** The separation of the shooters between lanes in meters. */
  public shooter_sep_m: number;

  /** The current temperature in degrees Fahrenheit. */
  public temperature: number;

  /** The current shot number for Hit Messages the device has stored. */
  public shot_number: number;

  /**
   * List of lanes from which the Device will be engaged.  This is a contiguous list
   * from 0..n integer values where each value is the lane number.
   */
  public lanes: number[];

  /**
   * The latitude of the sensor in degrees, decimal degrees (e.g. 27.9987) from -90 to 90 where a negative value is
   * the southern hemisphere and positive is the northern hemisphere.
   */
  public latitude: number;

  /** The longitude of the sensor in degrees, decimal degrees (e.g. 137.9987) from -180 to 180. */
  public longitude: number;

  /** The orientation of the device relative to true north from 0-359. */
  public orientation: number;
}