/**
 * General configuration data for the application.
 * 
 */
export class AppConfig {
	/** The version of the application. */
	public version: string;

	/** Hostname or IP of where the KDAS server is running. */
	public serverAddress: string;

	/** The port of the KDAS server. */
	public serverPort: number;

	/** The encrypted password to RabbitMQ. */
	public rabbitPassword: string;

	/** The username to connect to Rabbit with. */
	public rabbitUserName: string;

	/**
	 * The version to use of MQTT.  Use 3 for existing TRACR version that
	 * run Rabbit MQ 3.8.2.  For anything later, use 4 as this value.
	 */
	public mqttVersion: number;

	/** Maximum number of message for each topic to keep in cache. */
	public maxMessages: number;
}