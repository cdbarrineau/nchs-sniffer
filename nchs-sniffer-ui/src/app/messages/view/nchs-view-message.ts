import { NchsMessage } from "../nchs-message";

/**
 * View message that is a flat data for filtering in the table.
 * 
 */
export class NchsViewMessage {

  /** The message type. */
  public messageType: string;

  /** Timestamp of the message. */
  public timestamp: string;

  /** ID of the device that sent the message. */
  public deviceId: number;

  /** MAC represenation of the deviceId. */
  public deviceIdAsMac: string;

  /** The original message. */
  public message: NchsMessage;
}