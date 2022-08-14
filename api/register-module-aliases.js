const moduleAlias = require('module-alias');

moduleAlias.addAlias('@middleware', __dirname + '/middleware');
moduleAlias.addAlias('@models', __dirname + '/models');
moduleAlias.addAlias('@config', __dirname + '/config');
moduleAlias.addAlias('@utils', __dirname + '/utils');
