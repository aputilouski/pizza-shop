const { createWriteStream, unlink } = require('fs');
const { env } = require('@config');
const path = require('path');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 24);

const upload = async promise => {
  const { createReadStream, filename } = await promise;
  const stream = createReadStream();
  const storedFileName = nanoid() + path.extname(filename);
  const storedFileUrl = env.media_path + '/' + storedFileName;

  // Store the file in the filesystem.
  await new Promise((resolve, reject) => {
    const writeStream = createWriteStream(storedFileUrl);
    writeStream.on('finish', resolve);

    writeStream.on('error', error => {
      unlink(storedFileUrl, () => {
        reject(error);
      });
    });

    stream.on('error', error => writeStream.destroy(error));

    stream.pipe(writeStream);
  });

  return {
    name: storedFileName,
    link: '/media/' + storedFileName,
  };
};

module.exports = { upload };
