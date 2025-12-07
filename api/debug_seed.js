require('dotenv').config();
console.log('Debug Script Running');
console.log('Current Directory:', process.cwd());
if (process.env.DB_URL) {
    console.log('DB_URL found (length):', process.env.DB_URL.length);
} else {
    console.log('DB_URL is MISSING');
}
console.log('Done');
