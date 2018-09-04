import {
  Transaction,
  TransactionHeader,
  Batch,
  BatchHeader,
  BatchList
} from 'sawtooth-sdk/protobuf';
import { createHash } from 'crypto';
import { getPublicKey, sign } from './signing.js';
import { encode } from './encoding.js';



const FAMILY_NAME = 'cryptomoji';
const FAMILY_VERSION = '0.1';
const NAMESPACE = '5f4d76';
const getNonce = () => (Math.random() * 10 ** 18).toString(36);

/**
 * A function that takes a private key and a payload and returns a new
 * signed Transaction instance.
 *
 * Hint:
 *   Remember ProtobufJS has two different APIs for encoding protobufs
 *   (which you'll use for the TransactionHeader) and for creating
 *   protobuf instances (which you'll use for the Transaction itself):
 *     - TransactionHeader.encode({ ... }).finish()
 *     - Transaction.create({ ... })
 *
 *   Also, don't forget to encode your payload!
 */
export const createTransaction = (privateKey, payload) => {
  // Enter your solution here
   const encodedPayload = encode(payload);
   console.log("Encodepayload" , encodedPayload);

const pk=getPublicKey(privateKey);
console.log("public key from private" , pk);
  const transactionPayload={
    familyName: 'cryptomoji',
    familyVersion: '0.1',
    inputs: ['5f4d76'],
    outputs: ['5f4d76'],
    signerPublicKey: pk,
    // In this example, we're signing the batch with the same private key,
    // but the batch can be signed by another party, in which case, the
    // public key will need to be associated with that key.
    batcherPublicKey: pk,
    // In this example, there are no dependencies.  This list should include
    // an previous transaction header signatures that must be applied for
    // this transaction to successfully commit.
    // For example,
    // dependencies: ['540a6803971d1880ec73a96cb97815a95d374cbad5d865925e5aa0432fcf1931539afe10310c122c5eaae15df61236079abbf4f258889359c4d175516934484a'],
    dependencies: [],
    nonce:getNonce(),
    payloadSha512: createHash('sha512').update(encodedPayload).digest('hex')
}
 
  console.log("Transctionpayload" , transactionPayload);
  const header = TransactionHeader.encode(transactionPayload).finish();


  console.log("TransctionpayHeader" , header);
  return Transaction.create({
    header,
    headerSignature: sign(privateKey, header),
    payload: encodedPayload
  });
};

/**
 * A function that takes a private key and one or more Transaction instances
 * and returns a signed Batch instance.
 *
 * Should accept both multiple transactions in an array, or just one
 * transaction with no array.
 */
export const createBatch = (privateKey, transactions) => {
  // Your code here
  const signerPublicKey=getPublicKey(privateKey);
  if (!Array.isArray (transactions)) {
       transactions=[transactions]
  }
     
     const transactionIds=transactions.map(t=>t.headerSignature);

     const batchHeader={
      signerPublicKey,
      transactionIds
     }

const header=BatchHeader.encode(batchHeader).finish();

const headerSignature=sign(privateKey,header);

return Batch.create({
header:header,
headerSignature:headerSignature,
transactions:transactions

});
};

/**
 * A fairly simple function that takes a one or more Batch instances and
 * returns an encoded BatchList.
 *
 * Although there isn't much to it, axios has a bug when POSTing the generated
 * Buffer. We've implemented it for you, transforming the Buffer so axios
 * can handle it.
 */
export const encodeBatches = batches => {
  if (!Array.isArray(batches)) {
    batches = [ batches ];
  }
  const batchList = BatchList.encode({ batches }).finish();

  // Axios will mishandle a Uint8Array constructed with a large ArrayBuffer.
  // The easiest workaround is to take a slice of the array.
  return batchList.slice();
};

/**
 * A convenince function that takes a private key and one or more payloads and
 * returns an encoded BatchList for submission. Each payload should be wrapped
 * in a Transaction, which will be wrapped together in a Batch, and then
 * finally wrapped in a BatchList.
 *
 * As with the other methods, it should handle both a single payload, or
 * multiple payloads in an array.
 */
export const encodeAll = (privateKey, payloads) => {
  // Your code here

if (!Array.isArray(payloads)) {
   payloads=[payloads];
}

const transactions=payloads.map(p=>createTransaction(privateKey,p));
const batch=createBatch(privateKey,transactions);

return encodeBatches(batch);
};
