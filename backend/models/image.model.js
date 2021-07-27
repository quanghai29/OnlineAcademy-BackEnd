const db = require('../utils/db');

const tableName = 'image';
module.exports = {
  async getImageById(image_id) {
    const image = await db(tableName).where('id', image_id);
    return image.length > 0 ? image[0] : null;
  },
}