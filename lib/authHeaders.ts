import CryptoJS from "crypto-js";

export function createAuthHeaders(apiKey: string, secretKey: string) {
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const signature = CryptoJS.SHA256(apiKey + timestamp + secretKey).toString();

  return {
    "Api-Key": apiKey,
    Timestamp: timestamp,
    Signature: signature,
  };
}
