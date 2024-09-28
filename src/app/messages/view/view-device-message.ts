import { getMessageTypeDisplayString } from "../icd/message-type";
import { NchsMessage } from "../nchs-message";

/**
 * Base class for all view device message.
 * 
 */
export abstract class ViewDeviceMessage {
  /** The queue the message was received on. */
  public topic: string;

  /** The message type. */
  public messageType = '';

  /** The version of the ICD we are coded against. */
  public icdVersion = 0;

  /** The sequence number of this message.  For sending messages, this gets filled in by the back-end. */
  public sequenceNumber = 0;

  /** Device ID. */
  public deviceId: number;

  /** Device ID that sent the message as a MAC address. */
  public deviceIdAsMac: string;

  /** ISO 8601 formatted timestamp (YYYY-MM-DDTHH:mm:ss.sssZ) */
  public timestamp: string;

  /**
   * Converts this message.
   * 
   * @param message The message to convert.
   */
  public abstract convert(message: NchsMessage): void;

  /**
   * Sets the device message data onto the view message.
   * 
   * @param message The message to get the data from to set onto the view message.
   */
  protected setDeviceMessageData(message: NchsMessage) {
    this.messageType = getMessageTypeDisplayString(message.envelope.msg_type);
    this.icdVersion = message.envelope.icd_version;
    this.sequenceNumber = message.envelope.seq_num;
    this.deviceId = message.envelope.device_id;
    this.deviceIdAsMac = message.deviceIdAsMac;
    this.timestamp = message.envelope.timestamp;
    this.topic = message.topic;
  }
}