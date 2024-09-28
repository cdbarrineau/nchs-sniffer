/**
 * All supported ICD types of ammo.
 * 
 */
export enum AmmoType {
  NONE = 0,
  SMALL,
  MEDIUM,
  LARGE,
  NINE_MM,
  FIVE_FIVE_SIX,
  SEVEN_SIX_TWO,
  THREE_HUNDRED_WIN_MAG,
  THREE_THREE_EIGHT,
  FIFTY_CAL,
  TWENTY_FIVE_MM,
  THIRTY_MM,
  FORTY_MM,
  SIXTY_MM,
  NINETY_MM,
  ONE_HUNDRED_TWENTY_MM ,
  ONE_HUNDRED_TWENTY_MM_SABOT,
  ONE_HUNDRED_TWENTY_MM_HEAT,
  FLECHETTE
}

export const NoneDisplayString = 'None';
export const SmallDisplayString = 'Small';
export const MediumDisplayString = 'Medium';
export const LargeDisplayString = 'Large';
export const NineMMDisplayString = '9mm';
export const FiveFiveSixDisplayString = '5.56';
export const SevenSixTwoDisplayString = '7.62';
export const ThreeHundredWinMagDisplayString = '.300 WinMag';
export const ThreeThreeEightDisplayString = '.338';
export const FiftyCalDisplayString = '.50cal';
export const TwentyFiveMMDisplayString = '25mm';
export const ThirtyMMDisplayString = '30mm';
export const FourtyMMDisplayString = '40mm';
export const SixtyMMDisplayString = '60mm';
export const NinetyMMDisplayString = '90mm';
export const OneHundredTwentyMMDisplayString = '120mm';
export const OneHundredTwentyMMSabotDisplayString = '120mm Sabot';
export const OneHundredTwentyMMHeatDisplayString = '120mm HEAT';
export const FlechetteDisplayString = 'Flechette';

/** List of all ammo display strings. */
export const AmmoDisplayListTypes = [
  NoneDisplayString,
  SmallDisplayString,
  MediumDisplayString,
  LargeDisplayString,
  NineMMDisplayString,
  FiveFiveSixDisplayString,
  SevenSixTwoDisplayString,
  ThreeHundredWinMagDisplayString,
  ThreeThreeEightDisplayString,
  FiftyCalDisplayString,
  TwentyFiveMMDisplayString,
  ThirtyMMDisplayString,
  FourtyMMDisplayString,
  SixtyMMDisplayString,
  NinetyMMDisplayString,
  OneHundredTwentyMMDisplayString,
  OneHundredTwentyMMSabotDisplayString,
  OneHundredTwentyMMHeatDisplayString,
  FlechetteDisplayString
];

/**
 * Gets the string representation of a ammo type.
 * 
 * @param ammoType The ammo type to get the string for.
 * @returns Returns the string representation.
 */
export function getAmmoTypeDisplayString(ammoType: AmmoType): string {
  switch (ammoType) {
    case AmmoType.SMALL:
      return SmallDisplayString;
    case AmmoType.MEDIUM:
      return MediumDisplayString;
    case AmmoType.LARGE:
      return LargeDisplayString;
    case AmmoType.NINE_MM:
      return NineMMDisplayString;
    case AmmoType.FIVE_FIVE_SIX:
      return FiveFiveSixDisplayString;
    case AmmoType.SEVEN_SIX_TWO:
      return SevenSixTwoDisplayString;
    case AmmoType.THREE_HUNDRED_WIN_MAG:
      return ThreeHundredWinMagDisplayString;
    case AmmoType.THREE_THREE_EIGHT:
      return ThreeThreeEightDisplayString;
    case AmmoType.FIFTY_CAL:
      return FiftyCalDisplayString;
    case AmmoType.TWENTY_FIVE_MM:
      return TwentyFiveMMDisplayString;
    case AmmoType.THIRTY_MM:
      return ThirtyMMDisplayString;
    case AmmoType.FORTY_MM:
      return FourtyMMDisplayString;
    case AmmoType.SIXTY_MM:
      return SixtyMMDisplayString;
    case AmmoType.NINETY_MM:
      return NinetyMMDisplayString;
    case AmmoType.ONE_HUNDRED_TWENTY_MM:
      return OneHundredTwentyMMDisplayString;
    case AmmoType.ONE_HUNDRED_TWENTY_MM_SABOT:
      return OneHundredTwentyMMSabotDisplayString;
    case AmmoType.ONE_HUNDRED_TWENTY_MM_HEAT:
      return OneHundredTwentyMMHeatDisplayString;
    case AmmoType.FLECHETTE:
      return FlechetteDisplayString;
    default:
      return NoneDisplayString;
  }
}

/**
 * Gets the ammo type from its display string value.
 * 
 * @param displayString The display string to convert.
 * @returns Returns the ammo type or None if it could not be found.
 */
export function fromAmmoTypeDisplayString(displayString: string): AmmoType {
  switch (displayString) {
    case SmallDisplayString:
      return AmmoType.SMALL;
    case MediumDisplayString:
      return AmmoType.MEDIUM;
    case LargeDisplayString:
      return AmmoType.LARGE;
    case NineMMDisplayString:
      return AmmoType.NINE_MM;
    case FiveFiveSixDisplayString:
      return AmmoType.FIVE_FIVE_SIX;
    case SevenSixTwoDisplayString:
      return AmmoType.SEVEN_SIX_TWO;
    case ThreeHundredWinMagDisplayString:
      return AmmoType.THREE_HUNDRED_WIN_MAG;
    case ThreeThreeEightDisplayString:
      return AmmoType.THREE_THREE_EIGHT;
    case FiftyCalDisplayString:
      return AmmoType.FIFTY_CAL;
    case TwentyFiveMMDisplayString:
      return AmmoType.TWENTY_FIVE_MM;
    case ThirtyMMDisplayString:
      return AmmoType.THIRTY_MM;
    case FourtyMMDisplayString:
      return AmmoType.FORTY_MM;
    case SixtyMMDisplayString:
      return AmmoType.SIXTY_MM;
    case NinetyMMDisplayString:
      return AmmoType.NINETY_MM;
    case OneHundredTwentyMMDisplayString:
      return AmmoType.ONE_HUNDRED_TWENTY_MM;
    case OneHundredTwentyMMSabotDisplayString:
      return AmmoType.ONE_HUNDRED_TWENTY_MM_SABOT;
    case OneHundredTwentyMMHeatDisplayString:
      return AmmoType.ONE_HUNDRED_TWENTY_MM_HEAT;
    case FlechetteDisplayString:
      return AmmoType.FLECHETTE;
    default:
      return AmmoType.NONE;
  }
}