/**
 * This class enumerates the different requests for a diagnostic message request.
 * 
 */
export enum DiagnosticMessageType {
  /** Request to get all queues in cache. */
  QUEUES = 'QUEUES',
  /** Get messages on a queue. */
  MESSAGES = 'MESSAGES'
}