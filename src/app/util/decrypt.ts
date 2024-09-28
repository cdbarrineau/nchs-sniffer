import * as CryptoJS from 'crypto-js';

/**
 * Used to decrypt passwords.
 * 
 */
export class Decrypt {

    private static readonly KEY = 'TRACRDBPasswordKey.TRACR';
    private static readonly IV = 'password';

    public static decrypt(value: string) {
        const key = CryptoJS.enc.Utf8.parse(Decrypt.KEY);
        const iv = CryptoJS.enc.Utf8.parse(Decrypt.IV);
        const decrypted = CryptoJS.AES.decrypt(value, key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}