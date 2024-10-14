import { getAirCleaningTypeDisplayString } from "../icd/air-cleaning-type";
import { getAmmoTypeDisplayString } from "../icd/ammo-type";
import { ConfigurationMessage } from "../icd/configuration-message";
import { NchsMessage } from "../nchs-message";
import { ViewDeviceMessage } from "./view-device-message";

/**
 * View message for configuration message.
 * 
 */
export class ViewConfigurationMessage extends ViewDeviceMessage {

  /** The current temperature in degrees Fahrenheit. */
  public temperature: number;

  /** The type of ammo the shooters are firing. */
  public ammo = '';

  /** The distance the shooter is firing at to the targets in meters. */
  public distance: number;

  /** The separation of the shooters between lanes in meters. */
  public shooterSeparation: number;

  /** When set to true, turn on device sleep, false wakes the device up. */
  public sleepOn: boolean;

  /** The type of air cleaning to perform.  Corresponds to AirCleaningType. */
  public airType = '';

  /** True to reset the shot number. */
  public resetShotNumber: boolean;

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

  /**
   * Converts this message.
   * 
   * @param message The message to convert.
   */
  public convert(message: NchsMessage): void {
    const configurationMessage = JSON.parse(message.envelope.payload) as ConfigurationMessage;

    super.setDeviceMessageData(message);

    this.temperature = configurationMessage.temperature;
    this.ammo = getAmmoTypeDisplayString(configurationMessage.ammo);
    this.distance = configurationMessage.distance_m;
    this.shooterSeparation = configurationMessage.shooter_sep_m;
    this.sleepOn = configurationMessage.sleep_on;
    this.airType = getAirCleaningTypeDisplayString(configurationMessage.air_type);
    this.resetShotNumber = configurationMessage.reset_shot_num;
    this.lanes = configurationMessage.lanes;
    this.latitude = configurationMessage.latitude;
    this.longitude = configurationMessage.longitude;
    this.orientation = configurationMessage.orientation;
  }
}