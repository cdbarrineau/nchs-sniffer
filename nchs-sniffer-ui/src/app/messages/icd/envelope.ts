/**
 * This class is the envelope around messages sent over a Message Broker.
 * 
 */
export class Envelope {

  /** Event code to know how to interpret the payload. */
  public msg_type: number;

  /** The version of the ICD we are coded against. */
  public icd_version: number;

  /** The sequence number of this message.  For sending messages, this gets filled in by the back-end. */
  public seq_num: number;

  /** ISO 8601 formatted timestamp (YYYY-MM-DDTHH:mm:ss.sssZ) */
  public timestamp: string;

  /** The device's ID or 0 (zero) for all devices. */
  public device_id: number;

  /** The actual event data. */
  public payload: string;
}