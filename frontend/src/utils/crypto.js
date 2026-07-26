export const generateOrderHash = (orderId) => {
  // Use a simple hash-like transformation:
  // Map the orderId characters into a numeric/hex signature.
  // This guarantees that if orderId changes, the end of the hash changes.
  let hash = 0;
  for (let i = 0; i < orderId.length; i++) {
    hash = (hash << 5) - hash + orderId.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  // Convert to a positive hex string and pad/slice to get a unique signature
  const hexHash = Math.abs(hash).toString(16).padStart(8, "0");

  return `0x${hexHash}ZENVY${orderId.replace("ORD-", "")}`;
};
