const db = require('../utils/db');

const table_name = 'image';
module.exports = {
    add(image) {
        return db(table_name).insert(image);
    }
}