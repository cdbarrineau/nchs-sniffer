/**
 * Utility class that formats a number into a MAC address string.
 * 
 */
export class DeviceIdFormatter {

  private static readonly DEFAULT_MAC = '00:00:00:00:00:00';

  /**
   * Formats the specified device ID into a MAC address string.
   * 
   * @param deviceId The device ID to format.
   */
  public static formatDeviceId(deviceId: number) {
    if (!deviceId) {
      return DeviceIdFormatter.DEFAULT_MAC;
    }

    // Convert the number into uppercase hex.
    const hexValue = deviceId.toString(16).toUpperCase();

    // Now format the string as a MAC address.
    let numPad = 0;
    let hexLen = hexValue.length;

    // Figure out how many leading zeros we need to add. It really should
    // only be a six byte value, but we'll check for something larger just
    // in case.
    // Is this bigger than 6 bytes? If so, we need a 16 char hex string
    if (hexLen > 12) {
      numPad = 16 - hexLen;
    }
    // Otherwise, this is a standard MAC address so create a 12 byte hex string
    else {
      numPad = 12 - hexLen;
    }

    let pad = '';

    // Create a string of leading zeros.
    for (let i = 0; i < numPad; i++) {
      pad += '0';
    }

    // Put the padding first, then the hex value.
    const buf = pad + hexValue;

    hexLen = buf.length;

    // This is the final string.
    let devId = '';

    // Now copy the characters into a new string buffer, putting a colon ':'
    // between every two hex characters (e.g. 01:02:03:04:05:06)
    for (let i = 0; i < hexLen; i++) {
      if (i != 0 && (i % 2) == 0) {
          devId += ':';
      }
      devId += buf[i];
    }

    return devId;
  }

  /**
   * Formats a device MAC address into the base-10 numeric value of
   * the MAC address.
   * 
   * @param deviceMac The MAC address to format.
   * @returns Returns falsy if the input is falsy or could not be converted.
   */
  public static fromDeviceMac(deviceMac: string): number {

    if (!deviceMac) {
      return undefined;
    }

    // Strip any colons and spaces.
    const str = deviceMac.replaceAll(':', '').replaceAll(' ', '');

    return Number.parseInt(str, 16)
  }
}