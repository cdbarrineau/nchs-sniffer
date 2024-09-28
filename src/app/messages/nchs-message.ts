import { Envelope } from "./icd/envelope";

/**
 * Event that comes in from the back-end when a message has been sniffed.
 * 
 */
export class NchsMessage {
  /** Used to uniquely identify a message. */
  public id: number;

  /** The queue the message was received on. */
  public topic: string;

  /** Device ID that sent the message as a MAC address. */
  public deviceIdAsMac: string;

  /** The envelope of data. */
  public envelope: Envelope;
}