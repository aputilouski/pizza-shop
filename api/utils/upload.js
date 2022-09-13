const { env } = require('@config');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: env.cloudinary_cloud_name,
  api_key: env.cloudinary_api_key,
  api_secret: env.cloudinary_api_secret,
});

const upload = async promise => {
  const { createReadStream } = await promise;

  const stream = createReadStream();

  // Store the file in the filesystem.
  const result = await new Promise(async (resolve, reject) => {
    const writeStream = cloudinary.uploader.upload_stream(result => (!result.error ? resolve(result) : reject(result.error)), { folder: 'pizza-shop' });
    stream.on('error', reject);
    stream.pipe(writeStream);
  });

  return {
    url: result.secure_url,
  };
};

module.exports = { upload };
