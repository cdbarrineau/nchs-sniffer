import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as Mqtt from 'paho-mqtt';

import { NchsMessage } from './messages/nchs-message';
import { UUIDFactory } from './util/uuid-factory';
import { AppConfig } from './util/app-config';
import { Decrypt } from './util/decrypt';
import { Envelope } from './messages/icd/envelope';
import { DeviceIdFormatter } from './util/device-id-formatter';

/**
 * Used to interface with the message broker.
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class NchsSnifferService {

  /** Fired when the connection status to the message broker changes. */
  public readonly onConnected = new Subject<void>();

  /** Fired when the connection to the Broker has been broken. */
  public readonly onDisconnected: Subject<string> = new Subject<string>();

  /** Fired when an event has arrived. */
  public readonly onMessage = new Subject<NchsMessage>();

  /** Fired when there is an error, usually a web socket disconnect. */
  public readonly onError = new Subject<string>();

  /** Fired when a new topic has been detected. */
  public readonly onNewTopic = new Subject<string>();

  /** Fired when a message has been deleted as a result of max messages for a topic being deleted. */
  public readonly messageDeleted = new Subject<NchsMessage>();

  /** Set of topics to subscibe to. */
  public readonly topics = new Set<string>();

  /** Unique name for this broker. */
  private static readonly UNIQUE_NAME = 'NCHS Sniffer ' + UUIDFactory.newUUID();

  /** Name of the Message Broker queue to publish broadcast device message on. */
  private static readonly BROADCAST_DEVICE_QUEUE_NAME = "queue/nchs-control-system-broadcast";

  /** Name of the queue to get all device state. */
  private static readonly DEVICE_STATE_QUEUE_NAME = "queue/nchs-device-broadcast";

  /**
   * The base name of the device-specific queue used to publish messages directly to the device. This will be used as
   * the base to append the device's ID onto to create queueName.
   */
  private static readonly DEVICE_QUEUE_BASE_NAME = "queue/nchs-device-";

  /** IP address of where the message broker is running. */
  private ipAddress: string;

  /** If true, connected or connecting to the message broker, false if not. */
	private isConnected = false;

  /** The main client used to interact with the Broker. */
  private client: Mqtt.Client;

  /** When reconnecting we go into a loop.  Once connected this is used to stop the loop. */
  private intervalRef: number;

  /** Used to get config data. */
  private appConfig: AppConfig;

  /** Maps a topic to the messages recevied on the topic. */
  private messages = new Map<string, NchsMessage[]>();

  /** The current message ID for message uniquness. */
  private currentMessageId = 0;


  /**
   * Constructor.
   * 
   */
  constructor() {
    this.topics.add(NchsSnifferService.BROADCAST_DEVICE_QUEUE_NAME);
    this.topics.add(NchsSnifferService.DEVICE_STATE_QUEUE_NAME);
  }

  /**
   * Gets all messages in cache for the specified topic.
   * 
   * @param topic The topic to get the messages for.
   * @returns Returns the messages or falsy if there are no messages.
   */
  public getMessages(topic: string): NchsMessage[] {
    return this.messages.get(topic);
  }

  /**
   * Clears all messages for the specified topic.
   * 
   * @param topic The topic to clear messages for.
   */
  public clearMessages(topic: string) {
    if (!topic) {
      return;
    }

    const messages = this.messages.get(topic);
    if (messages) {
      messages.length = 0;
    }
  }

  /**
   * Connects to the message broker.
   * 
   * @param ipAddress The address to connect to the message broker.
   */
  public connect(ipAddress: string, appConfig: AppConfig) {
    if (this.isConnected && this.ipAddress === ipAddress) {
      return;
    }
    // If connected but the IPs are different, disconnect.
    else if (this.isConnected) {
      this.disconnect();
    }

    this.ipAddress = ipAddress;
    this.appConfig = appConfig;

    this.doConnect();
  }

  /**
   * Disconnects from the message broker.
   * 
   */
  public disconnect() {
    this.isConnected = false;

    this.clearInterval();

    if (this.client && this.client.isConnected()) {
      console.debug('Disconnecting from Message Broker...');

      this.client.disconnect();
    }

    this.client = null;
  }

  /**
   * Handles the actual connection to the Broker.
   * 
   */
  private doConnect() {
    this.client = new Mqtt.Client(this.ipAddress, 15675, "/ws", NchsSnifferService.UNIQUE_NAME);

    this.client.onMessageArrived = (message: Mqtt.Message) => this.handleMessage(message);

    this.client.onConnectionLost = ((err: Mqtt.MQTTError) => {
      this.onDisconnected.next(err.errorMessage);
      if (this.isConnected) {
        console.error('Connection lost to Message Broker.');

        this.reconnect();
      }
    });

    console.debug('Connecting Message Broker at ' + this.ipAddress + '...');

    // There is a reconnect option but we'll leave that off and handle the
    // reconnect ourself so that we can show the user a connection status dialog.
    this.client.connect({
      mqttVersion: 4,
      userName: this.appConfig.rabbitUserName,
      password: Decrypt.decrypt(this.appConfig.rabbitPassword),
      keepAliveInterval: 5,
      onSuccess: () => this.onConnect(),
      onFailure: (e: Mqtt.ErrorWithInvocationContext) => this.error(e),
      invocationContext: {},
      cleanSession: true
    });

    // Uncomment to display all traffic.  
    // this.client.trace = (trace) => {
    //   console.info(trace.message);
    // };
  }

  /**
   * Fired when a connection has been established with the Broker.
   * 
   */
  private onConnect() {
    console.debug('Connected to message broker at ' + this.ipAddress + ' as ' + NchsSnifferService.UNIQUE_NAME);

    if (this.client) {
      this.subscibe();
    }

    this.clearInterval();

    this.onConnected.next();
  }

  /**
   * Subscribe to all initial topics.
   * 
   */
  private subscibe() {
    if (this.client) {
      for (const topic of this.topics) {
        this.client.subscribe(topic);
      }
    }
  }

  /**
   * Attempts to reconnect to the Broker.  If connect was never called this
   * is a no-op.
   * 
   */
  private reconnect() {
    // If we already have an interval running, bail.
    if (this.intervalRef) {
      return;
    }

    this.intervalRef = window.setInterval(() => {
      this.disconnect();
      this.doConnect();
    }, 2000);
  }

  /**
   * Fired by MQTT when there has been an error detected.
   * 
   * @param e The error
   */
  private error(e: Mqtt.ErrorWithInvocationContext) {
    console.error('Error connecting to the Message Broker Server.', e);

    if (this.client && this.client.isConnected()) {
      console.error(e);
      this.onError.next(e.errorMessage);
    }
    else {
      this.onDisconnected.next(e.errorMessage);
    }

    this.reconnect();
  }

  /**
   * Handles a new message from the message broker.
   * 
   * @param message The message to handle
   */
  private handleMessage(message: Mqtt.Message) {
    const envelope = JSON.parse(message.payloadString) as Envelope;

    // If not the global device ID, add a topic subscription.
    if (message.destinationName  !== NchsSnifferService.BROADCAST_DEVICE_QUEUE_NAME) {
      const topic = NchsSnifferService.DEVICE_QUEUE_BASE_NAME + envelope.device_id;

      if (!this.topics.has(topic)) {
        this.topics.add(topic);
        this.onNewTopic.next(topic);

        this.client.subscribe(topic);
      }
    }

    let topicMessages = this.messages.get(message.destinationName);
    if (topicMessages) {
      if (topicMessages.length === this.appConfig.maxMessages) {
        const message = topicMessages[0];
        
        topicMessages.splice(0, 1);

        this.messageDeleted.next(message);
      }
    }
    else {
      topicMessages = [];

      this.messages.set(message.destinationName, topicMessages);
    }

    const nchsMessage = new NchsMessage();
    nchsMessage.deviceIdAsMac = DeviceIdFormatter.formatDeviceId(envelope.device_id);
    nchsMessage.envelope = envelope;
    nchsMessage.id = ++this.currentMessageId;
    nchsMessage.topic = message.destinationName;

    topicMessages.push(nchsMessage);

    console.debug('Got new MQTT message:', nchsMessage, message);

    this.onMessage.next(nchsMessage);
  }

  /**
   * Clears the reconnect interval if it's running.
   * 
   */
  private clearInterval() {
    if (this.intervalRef) {
      window.clearInterval(this.intervalRef);
      this.intervalRef = 0;
    }
  }
}
