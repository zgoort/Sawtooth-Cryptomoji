import * as secp256k1 from 'secp256k1';
import { randomBytes, createHash } from 'crypto';

const sha256 = msg => createHash('sha256').update(msg).digest();
const toBytes = hex => Buffer.from(hex, 'hex');

/**
 * This module is essentially identical to part-one's signing module.
 * Feel free to copy in your solution from there.
 *
 * This function generates a random Secp256k1 private key, returning it as
 * a 64 character hex string.
 */
export const createPrivateKey = () => {
  // Enter your solution here
    let privKey;
    do {
        privKey = randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privKey))

    console.log('private key toString: ' + privKey.toString('hex'));

    return privKey.toString('hex');

};

/**
 * Takes a hexadecimal private key and returns its public pair as a
 * 66 character hexadecimal string.
 */
export const getPublicKey = privateKey => {
  // Your code here
    return secp256k1.publicKeyCreate(Buffer.from(privateKey, 'hex')).toString('hex');

};

/**
 * This convenience function did not exist in part-one's signing module, but
 * should be simple to implement. It creates both private and public keys,
 * returning them in an object with two properties:
 *   - privateKey: the hex private key
 *   - publicKey: the matching hex public key
 *
 * Example:
 *   const keys = createKeys();
 *   console.log(keys);
 *   // {
 *   //   privateKey: 'e291df3eede7f0c520fddbe5e9e53434ff7ef3c0894ed9d9cbc...',
 *   //   publicKey: '0202694593ddc71061e622222ed400f5373cfa7ea607ce106cca...'
 *   // }
 */
export const createKeys = () => {
  // Your code here
    const prk =  createPrivateKey();
    const pbk  = getPublicKey(prk);
    let mkeys = {
        privateKey: prk,
        publicKey: pbk
    };

    return mkeys;

};

/**
 * Takes a hex private key and a string message, returning a
 * hexadecimal signature.
 */
export const sign = (privateKey, message) => {
  // Your code here
    console.log("WE GOT A MESSAGE: ", message);
    console.log("WE GOT A privatekey", privateKey);
    const { signature } = secp256k1.sign(sha256(message), toBytes(privateKey));
    return signature.toString('hex');
};