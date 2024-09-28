import { getAirCleaningTypeDisplayString } from "../icd/air-cleaning-type";
import { getAmmoTypeDisplayString } from "../icd/ammo-type";
import { HealthResponseMessage } from "../icd/health-response-message";
import { NchsMessage } from "../nchs-message";
import { ViewDeviceMessage } from "./view-device-message";

/**
 * View health response message.
 * 
 */
export class ViewHealthResponseMessage extends ViewDeviceMessage {

  /** The current battery levels.  The maximum value is 100 as a percentage.  The minimum value is 0 as a percentage. */
  public battery: number;

  /** The operational status of the cameras. */
  public camerasOperational: boolean;

  /** The operational status of the radars. */
  public radarsOperational: boolean;

  /** The operational status of the solar blocks. */
  public solarBlocksOperational: boolean;

  /** True if there are messages that are dropped or unsent. */
  public commStatus: boolean;

  /** The operational status of the air clearing. */
  public airOperational: boolean;

  /** True if the device is in sleep mode. */
  public sleepOn: boolean;

  /** True if the device's air is on. */
  public airType = '';

  /** The selected ammo for the device. */
  public ammo = '';

  /** The distance the shooter is firing at to the targets in meters. */
  public distance: number;

  /** The separation of the shooters between lanes in meters. */
  public shooterSeparation: number;

  /** The current temperature in degrees Fahrenheit. */
  public temperature: number;

  /** The current shot number for Hit Messages the device has stored. */
  public shotNumber: number;

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

  /**
   * Converts this message.
   * 
   * @param message The message to convert.
   */
  public convert(message: NchsMessage): void {
    super.setDeviceMessageData(message);

    const healthResponseMessage = JSON.parse(message.envelope.payload) as HealthResponseMessage;
    this.battery = healthResponseMessage.battery;
    this.camerasOperational = healthResponseMessage.cameras_ops;
    this.radarsOperational = healthResponseMessage.radars_ops;
    this.solarBlocksOperational = healthResponseMessage.solar_blocks_ops;
    this.commStatus = healthResponseMessage.comms_status;
    this.airOperational = healthResponseMessage.air_ops;
    this.sleepOn = healthResponseMessage.sleep_on;
    this.airType = getAirCleaningTypeDisplayString(healthResponseMessage.air_type);
    this.ammo = getAmmoTypeDisplayString(healthResponseMessage.ammo);
    this.distance = healthResponseMessage.distance_m;
    this.shooterSeparation = healthResponseMessage.shooter_sep_m;
    this.temperature = healthResponseMessage.temperature;
    this.shotNumber = healthResponseMessage.shot_number;
    this.lanes = healthResponseMessage.lanes;
    this.latitude = healthResponseMessage.latitude;
    this.longitude = healthResponseMessage.longitude;
    this.orientation = healthResponseMessage.orientation;
  }
}