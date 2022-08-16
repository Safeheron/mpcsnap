export interface MPCKeystoreJSONObject{
  address: string;
  id: string;
  version: number;
  Crypto: {
    cipher: 'aes-128-ctr',
    cipherparams: { iv: string };
    ciphertext: string;
    kdf: 'scrypt',
    kdfparams: {
      salt: string;
      n: number;
      dklen: 32;
      p: number;
      r: number;
    }
    mac: string
  }
}
