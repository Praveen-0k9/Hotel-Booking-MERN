try {
    require('streamifier');
    console.log('MODULE_FOUND');
} catch (e) {
    console.error(e);
}
