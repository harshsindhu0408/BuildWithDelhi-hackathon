require("dotenv").config();
const admin = require("firebase-admin");
FIREBASE_KEY={
  "type": "service_account",
  "project_id": "intelligence-753d4",
  "private_key_id": "595d0fa3733ae18888a6f94c234adea935180c81",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCy/lL7LLqCGq6G\ns5VUOc1ArGRJ8WFKaTpcKlWutGy1Ie01FPhmbAJlzNHSIOULP/6gPGoLN50o2HYH\nifAzXsipWpXy3TlReNTvEpr3A5V12iW0RWfabcObbNRROKbeW+RJz9nAvJd+kZG3\nB19x0S4l8xwj3L1Af5IeGHTnMnjyy6DrCYicbloH+wE8UYcDSKrQuD/f1SmmUbhU\nxpCfd61NlyHC8EiBoZR3Y72DkhYcRG5RCQ5ussFD/WxvbVjA0cefqr3t1Pg6UlzL\nxBZ48PzQErFqyIqPXET2lRZpLY9xtJ8GGoMEz1l2i+DwOFTYinlI3QPCsMu1SBl9\nI63kI3CDAgMBAAECggEAFoMg3LEbeWbxscS/G1YfF+tBZytnbnxy9/SQd5Cpu35b\nieRBTwshTLxzXK0BIbvCwqnWjI1KGZZgAe1kuzvzRkQ7vSKl0Da/ppyocOOP1hVs\neJKMz/l43gDUvgJqD71u+6RGDD+sA3c7jybrkjJvo3DthnUqOFp904XamNl4QiZe\nnmmC06/kR/PIAhTvM3124Ce7qEotmNqf+K7P8a8u9jzZVnkv0oCQ3U/LBjhCD7Aw\n4eBUK7f46N0NIdpKTyNyZShDkoGp5PRkjufdMGuyiUzT7Z2dBNuDr9YD5iX5Jaai\naaygRxH47BtVJvrnsLscdcrvAjqZpw40FAqwuktzQQKBgQD0M67OrGfgo+5EnEGq\nSM22HgMHnPi6PBFP4lGrk/Hdf3hKpqgJszPMeFTqCwwuxeIfeB2FTvJ25z1rWl//\nQMUIEAmNJ3QShzutnAFCklc5jR2c5rBmI6NT1kj0AgFNoLEI/5bcEg6xIKTiKizz\n/d75eEDopjKvlv7YiDNTaiuBbwKBgQC7pCLImePF7B90oyNzcxv4Kuysn8VPmbOA\n8TXuY2xIY9NSFFX2uGLo8TTUm/OM0M50YkhbHY1LabvCgOc0mbYR3dAgnx/ULzUy\nxQhvmHkKFYIgspeFqKmFMGUHxV15hntX5mjXHj8gJ45WaMk+3g+3m7S4ZNQKV9nt\nfHjxYyVQLQKBgBOeR0/hN+MrKEwoxXm5qZUU6idla/ICO13Qj8EZ/JdP00kkBGHr\nHKEzlZbL1mm3igf/LVf1VLNKtnt2YjnuaSXRrALEBaYraRb0boF7ojhEZvmg6tD5\n0fg9QdUgiBxFaZOQfP0nEjkWp0hoHP5pCc2+5HAMUgwbNFQO9RihcedPAoGASUgq\nGYQYc8Tq6AeKod0T0FEbS7O+QH87nqEVuft0X7U047pzdD7Ayk7hniMl9Bncd5Gm\nxob9FrW9kZH8OgvKEqI5VXQv3xNsyF4xFDxNEUYjIxf8m0OqqQykeGt5PSvrYgHn\nchQq/SjVqyOTbQ0WwFN8OgOO2FdFEj3pkgRxnyUCgYB44FiQWCtl0dg2iz3xz+Wb\ntJz1sN42e7BEL28VuC0FL4QHNLDxM3jd9VlOGYXERGqFAtMuIJ9TSc1htuH3fnyv\nXRla9XGkT6hlmlp2t0/Sogac0pkLaiJAeIhx17TbybeaAsjk2viEn5Ew6uX3Ex1A\nO9VGBhF3WUSlC7+M2BAqRQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-7jqwl@intelligence-753d4.iam.gserviceaccount.com",
  "client_id": "101279706048405896982",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7jqwl%40intelligence-753d4.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

const cred = (FIREBASE_KEY);

const app = admin.initializeApp({
  credential: admin.credential.cert(cred),
});

module.exports = admin;