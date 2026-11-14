const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = 62n;
const MAX_SPACE = 62n ** 7n;    // 3.52 trillion possible 7-char codes
const PRIME = 2479153291729n;   // Large coprime to 62^7 for 1-to-1 scrambling
const OFFSET = 916132832n;      // Ensures generated codes are at least 6 chars

function encodeBase62(id) {
  let n = ((BigInt(id) * PRIME) % MAX_SPACE) + OFFSET;
  let code = '';

  while (n > 0n) {
    code = ALPHABET[Number(n % BASE)] + code;
    n = n / BASE;
  }

  return code;
}

module.exports = { encodeBase62 };