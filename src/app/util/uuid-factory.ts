/**
 * Class for dealing with UUIDs.
 *
 */
export class UUIDFactory {
	/** To specify 'no id' when clearing an UniqueId value in the database. Same as CTIA UniqueId.NULL_ID_STRING */
	public static NULL_ID_STRING = '00000000-0000-0000-0000-000000000000';

	/** Method to easily assess if a UUID is null as a function */
	public static isNull(id: string): boolean {
		return id === UUIDFactory.NULL_ID_STRING;
	}

	/**
	 * Creates a new UUID.
	 *
	 * @method newUUID
	 * @memberOf uuidFactory
	 * @returns Returns a new RFC4122 version 4 compliant UUID in for format of:
	 *    XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	 */
	public static newUUID(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			// Add the following comment line so that tslint does not not mark the bit-wise operators
			// as warnings.  In JS you hardly ever use bit-wise operators and typically it's
			// an indication that it should be || or && but that's not the case here.

			/* tslint:disable:no-bitwise */
			const r = (Math.random() * 16) | 0;
			const v = c === 'x' ? r : (r & 0x3) | 0x8;
			/* tslint:enable:no-bitwise */

			return v.toString(16);
		});
	}
}