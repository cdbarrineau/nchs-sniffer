import { DeviceMessage } from "./device-message";

/**
 * This message is a Last Will and Testament message that a
 * device configures as part of the MQTT connection.  When
 * a device unexpectedly disconnects, RabbitMQ will publish
 * this message to itself, and we will receive it. 
 */
export class DisconnectMessage extends DeviceMessage {

  /** Any message associated with the disconnect. */
  public message: string;
}