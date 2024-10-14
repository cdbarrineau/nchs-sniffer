import { DiagnosticMessageType } from "./diagnostic-message-type";

/**
 * This class is not an ICD message.  It is used to respond to a diagnostic
 * request.
 */
export class DiagnosticResponse {
  /** The type of diagnostic request this is. */
  public diagnosticMessageType: DiagnosticMessageType;

  /** The name of the queue that the message was published or received on. */
  public queueName: string;

  /** The payload of the response. */
  public payload: string;
}