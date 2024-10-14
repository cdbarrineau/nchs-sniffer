import { AmmoType } from "./ammo-type";
import { DeviceMessage } from "./device-message";

/**
 * This class is a NCHS message for a hit (shot) that the NCHS device sends to the Control System.
 * 
 */
export class HitMessage extends DeviceMessage {
  /** The shot number. */
  public shot_num: number;
  
  /** X coordinate in millimeters. */
  public x_mm = 0;

  /** Y coordinate in millimeters. */
  public y_mm = 0;

  /** Elevation of the shot in degrees. */
  public el_deg = 0;

  /** Azimuth of the shot in degrees. */
  public az_deg = 0;

  /** Terminal velocity in meters per second. */
  public term_vel_mps = 0;

  /** Flag if there is an error or not. */
  public error: boolean;

  /** Any error message, will be null for none. */
  public error_msg: string;
  
  /** When true, indicates that this hit is a cross shot from a different lane. */
  public crossfire: boolean;

  /** The lane that fired the cross shot. */
  public crossfire_lane: number;

  /** The type of ammo the shooters are firing. */
  public ammo: AmmoType;

  /**
   * The lane number assigned to the device in the Configuration Message that
   * detected the hit.  If no lanes have been assigned to the device via the
   * Configuration Message, the device will report 0 (zero) for the lane number
   */
  public lane: number;

  /** The laser code for laser sensors. */
  public laser_code: number;
}