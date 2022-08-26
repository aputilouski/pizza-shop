const encodeCursor = cursor => Buffer.from(`cursor-${cursor}`).toString('base64');
const decodeCursor = str => Buffer.from(str, 'base64').toString('ascii').replace('cursor-', '');

const useCursor = edges => (edges.length === 0 ? [null, null] : [edges[0].cursor, edges[edges.length - 1].cursor]);

module.exports = { encodeCursor, decodeCursor, useCursor };
