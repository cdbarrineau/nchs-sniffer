/**
 * Supported air cleaning types.
 * 
 */
export enum AirCleaningType {
  ON = 0,
  OFF,
  PULSE
}

export const AirCleaningTypeDisplayStringOn = 'On';
export const AirCleaningTypeDisplayStringOff = 'Off';
export const AirCleaningTypeDisplayStringPulse = 'Pulse';

export const AirCleaningTypeDisplayListTypes = [
  AirCleaningTypeDisplayStringOn,
  AirCleaningTypeDisplayStringOff,
  AirCleaningTypeDisplayStringPulse
];

/**
 * Gets the display string from the enumerated value.
 * 
 * @param airType The air cleaning type to get the display string for.
 * @returns Returns the display string.
 */
export function getAirCleaningTypeDisplayString(airType: AirCleaningType): string {
  switch (airType) {
    case AirCleaningType.ON:
      return AirCleaningTypeDisplayStringOn;
    case AirCleaningType.PULSE:
      return AirCleaningTypeDisplayStringPulse;
    case AirCleaningType.OFF:
      return AirCleaningTypeDisplayStringOff;
    default:
      console.error('Unknown air type passed to getAirCleaningTypeDisplayString, returning air type of OFF');
      return AirCleaningTypeDisplayStringOff;
  }
}

/**
 * Gets the enumeratede value from the display string..
 * 
 * @param displayString The display string to convert.
 * @returns Returns the ammo type or None if it could not be found.
 */
export function fromAirCleaningTypeDisplayString(displayString: string): AirCleaningType {
  switch (displayString) {
    case AirCleaningTypeDisplayStringOn:
      return AirCleaningType.ON;
    case AirCleaningTypeDisplayStringPulse:
      return AirCleaningType.PULSE;
    case AirCleaningTypeDisplayStringOff:
      return AirCleaningType.OFF;
    default:
      console.error('Unknown air cleaning display string passed to fromAirCleaningTypeDisplayString: ', displayString);
      return AirCleaningType.OFF;
  }
}