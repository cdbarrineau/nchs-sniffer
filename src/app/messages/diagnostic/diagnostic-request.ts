import { DiagnosticMessageType } from "./diagnostic-message-type";

/**
 * This class is not an ICD message.  It is intended to be used with
 * the diagnostic tool to request messages for a specific queue.
 */
export class DiagnosticRequest {
  /** The type of diagnostic request this is. */
  public diagnosticMessageType: DiagnosticMessageType;

  /** The name of the queue to request messages from. */
  public queueName: string;
}