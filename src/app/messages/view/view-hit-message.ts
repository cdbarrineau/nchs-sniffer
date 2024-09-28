import { getAmmoTypeDisplayString } from "../icd/ammo-type";
import { HitMessage } from "../icd/hit-message";
import { NchsMessage } from "../nchs-message";
import { ViewDeviceMessage } from "./view-device-message";

/**
 * View message for a device hit.
 * 
 */
export class ViewHitMessage extends ViewDeviceMessage {
  /** The shot number. */
  public shotNumber: number;
  
  /** X coordinate in millimeters. */
  public x = 0;

  /** Y coordinate in millimeters. */
  public y = 0;

  /** Elevation of the shot in degrees. */
  public elevation = 0;

  /** Azimuth of the shot in degrees. */
  public azimuth = 0;

  /** Terminal velocity in meters per second. */
  public terminalVelocity = 0;

  /** Flag if there is an error or not. */
  public error: boolean;

  /** Any error message, will be null for none. */
  public errorMessage: string;
  
  /** When true, indicates that this hit is a cross shot from a different lane. */
  public crossfire: boolean;

  /** The lane that fired the cross shot. */
  public crossfireLane: number;

  /** The type of ammo the shooters are firing. */
  public ammo = '';

  /**
   * The lane number assigned to the device in the Configuration Message that
   * detected the hit.  If no lanes have been assigned to the device via the
   * Configuration Message, the device will report 0 (zero) for the lane number
   */
  public lane: number;

  /** The laser code for laser sensors. */
  public laserCode: number;

  /**
   * Converts this message.
   * 
   * @param message The message to convert.
   */
  public convert(message: NchsMessage): void {
    const hitDetecton = JSON.parse(message.envelope.payload) as HitMessage;

    super.setDeviceMessageData(message);

    this.shotNumber = hitDetecton.shot_num;
    this.x = hitDetecton.x_mm;
    this.y = hitDetecton.y_mm;
    this.elevation = hitDetecton.el_deg;
    this.azimuth = hitDetecton.az_deg;
    this.terminalVelocity = hitDetecton.term_vel_mps;
    this.error = hitDetecton.error;
    this.errorMessage = hitDetecton.error_msg;
    this.crossfire = hitDetecton.crossfire;
    this.crossfireLane = hitDetecton.crossfire_lane;
    this.ammo = getAmmoTypeDisplayString(hitDetecton.ammo);
    this.lane = hitDetecton.lane;
    this.laserCode = hitDetecton.laser_code;
  }
}