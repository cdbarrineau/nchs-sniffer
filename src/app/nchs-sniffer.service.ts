import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as Mqtt from 'paho-mqtt';

import { NchsMessage } from './messages/nchs-message';
import { UUIDFactory } from './util/uuid-factory';
import { AppConfig } from './util/app-config';
import { Decrypt } from './util/decrypt';
import { Envelope } from './messages/icd/envelope';
import { DeviceIdFormatter } from './util/device-id-formatter';
import { DiagnosticRequest } from './messages/diagnostic/diagnostic-request';
import { DiagnosticMessageType } from './messages/diagnostic/diagnostic-message-type';
import { DiagnosticResponse } from './messages/diagnostic/diagnostic-response';

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

  /** Name of the queue to subscribe for diagnostic messages. */
  private static readonly PUBLISH_QUEUE_NANE = 'queue/nchs-diagnostic-request';

  /** Name of the queue to publish diagnostic messages. */
  private static readonly SUBSCRIBE_QUEUE_NAME = 'queue/nchs-diagnostic-response';

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
  }

  /**
   * Gets all messages in cache for the specified topic.
   * 
   * @param topic The topic to get the messages for.
   * @returns Returns the messages or falsy if there are no messages.
   */
  public getMessages(topic: string): NchsMessage[] {

    this.requestMessagesFromQueue(topic);

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
   * Deleted a topic.
   * 
   * @param topic The topic to delete.
   */
  public deleteTopic(topic: string) {
    this.topics.delete(topic)
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
      this.client.subscribe('#');
    }

    this.clearInterval();

    this.requestRegisteredQueues();

    this.onConnected.next();
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

    // Since we subscribe for everything, make sure we didn't get our own message.
    if (message.destinationName === NchsSnifferService.PUBLISH_QUEUE_NANE) {
      return;
    }

    console.debug('Got message', message);

    if (message.destinationName === NchsSnifferService.SUBSCRIBE_QUEUE_NAME) {
      this.handleDiagnosticResponse(message);
    }
    else {
      this.handleMqttMessage(message);
    }
  }

  /**
   * Handles a diagnostic response message.
   * 
   * @param message The message to handle.
   */
  private handleDiagnosticResponse(message: Mqtt.Message) {
    const response = JSON.parse(message.payloadString) as DiagnosticResponse;
    if (response.diagnosticMessageType === DiagnosticMessageType.QUEUES) {
      const topics = JSON.parse(response.payload) as string[];
      for (const topic of topics) {
        this.addTopic(topic);
      }
    }
    else if (response.diagnosticMessageType === DiagnosticMessageType.MESSAGES) {
      const messages = JSON.parse(response.payload) as string[];

      for (const envelopeText of messages) {
        const envelope = JSON.parse(envelopeText) as Envelope;
        if (envelope.msg_type) {
          this.handleEnvelope(envelope, response.queueName);
        }
        else {
          console.info('Got unknown message payload (not an Envelope)', message);
        }
      }

      // console.info('Messages:', messages);
    }
    else {
      console.warn('Unknown diagnostic message recevied: ', message);
    }
  }

  /**
   * Adds a new topic if is does not exist already.
   * 
   * @param topic The topic to add.
   */
  private addTopic(topic: string) {
    // See if we need to add the topic.
    if (!this.topics.has(topic)) {
      this.topics.add(topic);

      this.onNewTopic.next(topic);
    }
  }

  /**
   * Handles a MQTT message from a non-diagnostic queue.
   * 
   * @param message the message to handle.
   */
  private handleMqttMessage(message: Mqtt.Message) {

    this.addTopic(message.destinationName);

    // Now for the payload.  Should be an envelope.
    const envelope = JSON.parse(message.payloadString) as Envelope;
    if (envelope.msg_type) {
      this.handleEnvelope(envelope, message.destinationName);
    }
    else {
      console.info('Got unknown message payload (not an Envelope)', message);
    }
  }

  /**
   * Handles a new envelope of data.
   * 
   * @param envelope The envelope of data to handle.
   * @param destinationName The destination name the message came in on.
   */
  private handleEnvelope(envelope: Envelope, destinationName: string) {
    let topicMessages = this.messages.get(destinationName);
      if (topicMessages) {
        if (topicMessages.length === this.appConfig.maxMessages) {
          const message = topicMessages[0];
          
          topicMessages.splice(0, 1);

          this.messageDeleted.next(message);
        }
      }
      else {
        topicMessages = [];

        this.messages.set(destinationName, topicMessages);
      }

      const nchsMessage = new NchsMessage();
      nchsMessage.deviceIdAsMac = DeviceIdFormatter.formatDeviceId(envelope.device_id);
      nchsMessage.envelope = envelope;
      nchsMessage.id = ++this.currentMessageId;
      nchsMessage.topic = destinationName;

      topicMessages.push(nchsMessage);

      console.debug('Got new envelope message:', nchsMessage);

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

  /**
   * Sends a request to get all registered queue names.
   * 
   */
  private requestRegisteredQueues() {
    const diagnosticRequest = new DiagnosticRequest();
    diagnosticRequest.diagnosticMessageType = DiagnosticMessageType.QUEUES;

    this.client.send(NchsSnifferService.PUBLISH_QUEUE_NANE, JSON.stringify(diagnosticRequest));
  }

  /**
   * Sends a request to get all messages on a specified topic's routing key (queue).
   * 
   * @param queueName The name of the queue (topic's routing key).
   */
  private requestMessagesFromQueue(queueName: string) {
    const diagnosticRequest = new DiagnosticRequest();
    diagnosticRequest.diagnosticMessageType = DiagnosticMessageType.MESSAGES;
    diagnosticRequest.queueName = queueName;

    this.client.send(NchsSnifferService.PUBLISH_QUEUE_NANE, JSON.stringify(diagnosticRequest));
  }
}
