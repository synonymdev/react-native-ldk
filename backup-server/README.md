# react-native-ldk backup server

This a server allows apps using the react-native-ldk to persist all node state remotely and can be restored only using the seed.

## Running the server
``` bash
npm i

cp .env.template .env

npm run create-keypair

#Paste new key pair in .env

npm start
```
** Remember to update wallet env with new backup server pub key

## Clients
[Swift](https://github.com/synonymdev/react-native-ldk/blob/master/lib/ios/Classes/BackupClient.swift)
[Kotlin](https://github.com/synonymdev/react-native-ldk/blob/master/lib/android/src/main/java/com/reactnativeldk/classes/BackupClient.kt)
[NodeJS](https://github.com/synonymdev/react-native-ldk/blob/master/backup-server/src/test.js)

## Persiting
All message signing/verifying is done using [LDK's node signing](https://docs.rs/lightning/latest/lightning/util/message_signing/fn.sign.html) on the client and [ln-verifymessagejs](https://github.com/SeverinAlexB/ln-verifymessagejs) on the server.

1. Payload is encrypted using using standard AES/GCM encryption with the encryption key being the node secret.
2. Client creates a hash of encrypted backup and signs it.
3. Client creates unique challenge in this format: `sha256_hash(pubkey+timestamp)`
4. Client uploads encrypted bytes along with node pubkey, signed hash and challenge in request header.
5. Server hashes received payload and validates client's signed hash was actually signed by provided pubkey.
6. Server stores encrypted bytes to disk.
7. Server signs client's challenge and returns signature in response.
8. Client validate that the bytes were stored by the correct server by checking the signature in the response was signed by the server pubkey hard coded in the client.

## Retrieving
Retieving or querying a backup requires a bearer token first done by a fairly standard challenge/response using the same node signing.

1. Client fetches challenge from server by posting timestamp (nonce) and signed (signed timestamp) in body with pubkey in the header.
2. Server validates signature and returns challenge (32 bytes hex string).
3. Client signs challenge.
4. Client posts signed challenge with pubkey in the header.
5. Server validates signature.
6. On success server returns bearer token with 5min expiry. A long expiry isn't needed as token is only used briefly to perform a restore.
7. Client uses bearer token to pull list of backed up files.
8. Client iterates through list and downloads each file and persists to disk.
