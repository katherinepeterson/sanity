'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reinitializePluginConfigs;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pathExists = require('path-exists');

var _pathExists2 = _interopRequireDefault(_pathExists);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _resolver = require('@sanity/resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var _normalizePluginName = require('../../util/normalizePluginName');

var _normalizePluginName2 = _interopRequireDefault(_normalizePluginName);

var _generateConfigChecksum = require('../../util/generateConfigChecksum');

var _generateConfigChecksum2 = _interopRequireDefault(_generateConfigChecksum);

var _pluginChecksumManifest = require('../../util/pluginChecksumManifest');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reinitializePluginConfigs(options) {
  const workDir = options.workDir,
        output = options.output;

  const localChecksums = {};

  return (0, _pluginChecksumManifest.getChecksums)(workDir).then(checksums => Object.assign(localChecksums, checksums)).then(() => (0, _resolver2.default)({ basePath: workDir })).then(plugins => Promise.all(plugins.map(pluginHasDistConfig))).then(plugins => plugins.filter(Boolean)).then(plugins => Promise.all(plugins.map(getPluginConfigChecksum))).then(plugins => Promise.all(plugins.map(hasLocalConfig))).then(plugins => Promise.all(plugins.map(createMissingConfig))).then(plugins => plugins.map(warnOnDifferingChecksum)).then(saveNewChecksums);

  function hasLocalConfig(plugin) {
    return (0, _pluginChecksumManifest.localConfigExists)(workDir, plugin.name).then(configDeployed => Object.assign({}, plugin, { configDeployed: configDeployed }));
  }

  function createMissingConfig(plugin) {
    if (plugin.configDeployed) {
      return plugin;
    }

    const srcPath = _path2.default.join(plugin.path, 'config.dist.json');
    const dstPath = _path2.default.join(workDir, 'config', `${ (0, _normalizePluginName2.default)(plugin.name) }.json`);
    const prtPath = _path2.default.relative(workDir, dstPath);

    output.print(`Plugin "${ plugin.name }" is missing local configuration file, creating ${ prtPath }`);
    return _fsPromise2.default.copy(srcPath, dstPath).then(() => plugin);
  }

  function warnOnDifferingChecksum(plugin) {
    const local = localChecksums[plugin.name];
    if (typeof local !== 'undefined' && local !== plugin.configChecksum) {
      const name = (0, _normalizePluginName2.default)(plugin.name);
      output.print(`[WARN] Default configuration file for plugin "${ name }" has changed since local copy was created`);
    }

    return plugin;
  }

  function saveNewChecksums(plugins) {
    const sums = Object.assign({}, localChecksums);
    plugins.forEach(plugin => {
      if (!sums[plugin.name]) {
        sums[plugin.name] = plugin.configChecksum;
      }
    });

    return (0, _pluginChecksumManifest.setChecksums)(workDir, sums);
  }
}

function getPluginConfigPath(plugin) {
  return _path2.default.join(plugin.path, 'config.dist.json');
}

function pluginHasDistConfig(plugin) {
  const configPath = getPluginConfigPath(plugin);
  return (0, _pathExists2.default)(configPath).then(exists => exists && plugin);
}

function getPluginConfigChecksum(plugin) {
  return (0, _generateConfigChecksum2.default)(getPluginConfigPath(plugin)).then(configChecksum => Object.assign({}, plugin, { configChecksum: configChecksum }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL2NvbmZpZy9yZWluaXRpYWxpemVQbHVnaW5Db25maWdzLmpzIl0sIm5hbWVzIjpbInJlaW5pdGlhbGl6ZVBsdWdpbkNvbmZpZ3MiLCJvcHRpb25zIiwid29ya0RpciIsIm91dHB1dCIsImxvY2FsQ2hlY2tzdW1zIiwidGhlbiIsImNoZWNrc3VtcyIsIk9iamVjdCIsImFzc2lnbiIsImJhc2VQYXRoIiwicGx1Z2lucyIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJwbHVnaW5IYXNEaXN0Q29uZmlnIiwiZmlsdGVyIiwiQm9vbGVhbiIsImdldFBsdWdpbkNvbmZpZ0NoZWNrc3VtIiwiaGFzTG9jYWxDb25maWciLCJjcmVhdGVNaXNzaW5nQ29uZmlnIiwid2Fybk9uRGlmZmVyaW5nQ2hlY2tzdW0iLCJzYXZlTmV3Q2hlY2tzdW1zIiwicGx1Z2luIiwibmFtZSIsImNvbmZpZ0RlcGxveWVkIiwic3JjUGF0aCIsImpvaW4iLCJwYXRoIiwiZHN0UGF0aCIsInBydFBhdGgiLCJyZWxhdGl2ZSIsInByaW50IiwiY29weSIsImxvY2FsIiwiY29uZmlnQ2hlY2tzdW0iLCJzdW1zIiwiZm9yRWFjaCIsImdldFBsdWdpbkNvbmZpZ1BhdGgiLCJjb25maWdQYXRoIiwiZXhpc3RzIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFRd0JBLHlCOztBQVJ4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVlLFNBQVNBLHlCQUFULENBQW1DQyxPQUFuQyxFQUE0QztBQUFBLFFBQ2xEQyxPQURrRCxHQUMvQkQsT0FEK0IsQ0FDbERDLE9BRGtEO0FBQUEsUUFDekNDLE1BRHlDLEdBQy9CRixPQUQrQixDQUN6Q0UsTUFEeUM7O0FBRXpELFFBQU1DLGlCQUFpQixFQUF2Qjs7QUFFQSxTQUFPLDBDQUFhRixPQUFiLEVBQ0pHLElBREksQ0FDQ0MsYUFBYUMsT0FBT0MsTUFBUCxDQUFjSixjQUFkLEVBQThCRSxT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QixFQUFxQztBQUNuQyxRQUFNZ0IsYUFBYUQsb0JBQW9CZixNQUFwQixDQUFuQjtBQUNBLFNBQU8sMEJBQVdnQixVQUFYLEVBQXVCakMsSUFBdkIsQ0FBNEJrQyxVQUFVQSxVQUFVakIsTUFBaEQsQ0FBUDtBQUNEOztBQUVELFNBQVNMLHVCQUFULENBQWlDSyxNQUFqQyxFQUF5QztBQUN2QyxTQUFPLHNDQUF1QmUsb0JBQW9CZixNQUFwQixDQUF2QixFQUNKakIsSUFESSxDQUNDNkIsa0JBQWtCM0IsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JjLE1BQWxCLEVBQTBCLEVBQUNZLDhCQUFELEVBQTFCLENBRG5CLENBQVA7QUFFRCIsImZpbGUiOiJyZWluaXRpYWxpemVQbHVnaW5Db25maWdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBwYXRoRXhpc3RzIGZyb20gJ3BhdGgtZXhpc3RzJ1xuaW1wb3J0IGZzcCBmcm9tICdmcy1wcm9taXNlJ1xuaW1wb3J0IHJlc29sdmVUcmVlIGZyb20gJ0BzYW5pdHkvcmVzb2x2ZXInXG5pbXBvcnQgbm9ybWFsaXplUGx1Z2luTmFtZSBmcm9tICcuLi8uLi91dGlsL25vcm1hbGl6ZVBsdWdpbk5hbWUnXG5pbXBvcnQgZ2VuZXJhdGVDb25maWdDaGVja3N1bSBmcm9tICcuLi8uLi91dGlsL2dlbmVyYXRlQ29uZmlnQ2hlY2tzdW0nXG5pbXBvcnQge2dldENoZWNrc3Vtcywgc2V0Q2hlY2tzdW1zLCBsb2NhbENvbmZpZ0V4aXN0c30gZnJvbSAnLi4vLi4vdXRpbC9wbHVnaW5DaGVja3N1bU1hbmlmZXN0J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWluaXRpYWxpemVQbHVnaW5Db25maWdzKG9wdGlvbnMpIHtcbiAgY29uc3Qge3dvcmtEaXIsIG91dHB1dH0gPSBvcHRpb25zXG4gIGNvbnN0IGxvY2FsQ2hlY2tzdW1zID0ge31cblxuICByZXR1cm4gZ2V0Q2hlY2tzdW1zKHdvcmtEaXIpXG4gICAgLnRoZW4oY2hlY2tzdW1zID0+IE9iamVjdC5hc3NpZ24obG9jYWxDaGVja3N1bXMsIGNoZWNrc3VtcykpXG4gICAgLnRoZW4oKCkgPT4gcmVzb2x2ZVRyZWUoe2Jhc2VQYXRoOiB3b3JrRGlyfSkpXG4gICAgLnRoZW4ocGx1Z2lucyA9PiBQcm9taXNlLmFsbChwbHVnaW5zLm1hcChwbHVnaW5IYXNEaXN0Q29uZmlnKSkpXG4gICAgLnRoZW4ocGx1Z2lucyA9PiBwbHVnaW5zLmZpbHRlcihCb29sZWFuKSlcbiAgICAudGhlbihwbHVnaW5zID0+IFByb21pc2UuYWxsKHBsdWdpbnMubWFwKGdldFBsdWdpbkNvbmZpZ0NoZWNrc3VtKSkpXG4gICAgLnRoZW4ocGx1Z2lucyA9PiBQcm9taXNlLmFsbChwbHVnaW5zLm1hcChoYXNMb2NhbENvbmZpZykpKVxuICAgIC50aGVuKHBsdWdpbnMgPT4gUHJvbWlzZS5hbGwocGx1Z2lucy5tYXAoY3JlYXRlTWlzc2luZ0NvbmZpZykpKVxuICAgIC50aGVuKHBsdWdpbnMgPT4gcGx1Z2lucy5tYXAod2Fybk9uRGlmZmVyaW5nQ2hlY2tzdW0pKVxuICAgIC50aGVuKHNhdmVOZXdDaGVja3N1bXMpXG5cbiAgZnVuY3Rpb24gaGFzTG9jYWxDb25maWcocGx1Z2luKSB7XG4gICAgcmV0dXJuIGxvY2FsQ29uZmlnRXhpc3RzKHdvcmtEaXIsIHBsdWdpbi5uYW1lKVxuICAgICAgLnRoZW4oY29uZmlnRGVwbG95ZWQgPT4gT2JqZWN0LmFzc2lnbih7fSwgcGx1Z2luLCB7Y29uZmlnRGVwbG95ZWR9KSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU1pc3NpbmdDb25maWcocGx1Z2luKSB7XG4gICAgaWYgKHBsdWdpbi5jb25maWdEZXBsb3llZCkge1xuICAgICAgcmV0dXJuIHBsdWdpblxuICAgIH1cblxuICAgIGNvbnN0IHNyY1BhdGggPSBwYXRoLmpvaW4ocGx1Z2luLnBhdGgsICdjb25maWcuZGlzdC5qc29uJylcbiAgICBjb25zdCBkc3RQYXRoID0gcGF0aC5qb2luKHdvcmtEaXIsICdjb25maWcnLCBgJHtub3JtYWxpemVQbHVnaW5OYW1lKHBsdWdpbi5uYW1lKX0uanNvbmApXG4gICAgY29uc3QgcHJ0UGF0aCA9IHBhdGgucmVsYXRpdmUod29ya0RpciwgZHN0UGF0aClcblxuICAgIG91dHB1dC5wcmludChgUGx1Z2luIFwiJHtwbHVnaW4ubmFtZX1cIiBpcyBtaXNzaW5nIGxvY2FsIGNvbmZpZ3VyYXRpb24gZmlsZSwgY3JlYXRpbmcgJHtwcnRQYXRofWApXG4gICAgcmV0dXJuIGZzcC5jb3B5KHNyY1BhdGgsIGRzdFBhdGgpLnRoZW4oKCkgPT4gcGx1Z2luKVxuICB9XG5cbiAgZnVuY3Rpb24gd2Fybk9uRGlmZmVyaW5nQ2hlY2tzdW0ocGx1Z2luKSB7XG4gICAgY29uc3QgbG9jYWwgPSBsb2NhbENoZWNrc3Vtc1twbHVnaW4ubmFtZV1cbiAgICBpZiAodHlwZW9mIGxvY2FsICE9PSAndW5kZWZpbmVkJyAmJiBsb2NhbCAhPT0gcGx1Z2luLmNvbmZpZ0NoZWNrc3VtKSB7XG4gICAgICBjb25zdCBuYW1lID0gbm9ybWFsaXplUGx1Z2luTmFtZShwbHVnaW4ubmFtZSlcbiAgICAgIG91dHB1dC5wcmludChgW1dBUk5dIERlZmF1bHQgY29uZmlndXJhdGlvbiBmaWxlIGZvciBwbHVnaW4gXCIke25hbWV9XCIgaGFzIGNoYW5nZWQgc2luY2UgbG9jYWwgY29weSB3YXMgY3JlYXRlZGApXG4gICAgfVxuXG4gICAgcmV0dXJuIHBsdWdpblxuICB9XG5cbiAgZnVuY3Rpb24gc2F2ZU5ld0NoZWNrc3VtcyhwbHVnaW5zKSB7XG4gICAgY29uc3Qgc3VtcyA9IE9iamVjdC5hc3NpZ24oe30sIGxvY2FsQ2hlY2tzdW1zKVxuICAgIHBsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4ge1xuICAgICAgaWYgKCFzdW1zW3BsdWdpbi5uYW1lXSkge1xuICAgICAgICBzdW1zW3BsdWdpbi5uYW1lXSA9IHBsdWdpbi5jb25maWdDaGVja3N1bVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gc2V0Q2hlY2tzdW1zKHdvcmtEaXIsIHN1bXMpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UGx1Z2luQ29uZmlnUGF0aChwbHVnaW4pIHtcbiAgcmV0dXJuIHBhdGguam9pbihwbHVnaW4ucGF0aCwgJ2NvbmZpZy5kaXN0Lmpzb24nKVxufVxuXG5mdW5jdGlvbiBwbHVnaW5IYXNEaXN0Q29uZmlnKHBsdWdpbikge1xuICBjb25zdCBjb25maWdQYXRoID0gZ2V0UGx1Z2luQ29uZmlnUGF0aChwbHVnaW4pXG4gIHJldHVybiBwYXRoRXhpc3RzKGNvbmZpZ1BhdGgpLnRoZW4oZXhpc3RzID0+IGV4aXN0cyAmJiBwbHVnaW4pXG59XG5cbmZ1bmN0aW9uIGdldFBsdWdpbkNvbmZpZ0NoZWNrc3VtKHBsdWdpbikge1xuICByZXR1cm4gZ2VuZXJhdGVDb25maWdDaGVja3N1bShnZXRQbHVnaW5Db25maWdQYXRoKHBsdWdpbikpXG4gICAgLnRoZW4oY29uZmlnQ2hlY2tzdW0gPT4gT2JqZWN0LmFzc2lnbih7fSwgcGx1Z2luLCB7Y29uZmlnQ2hlY2tzdW19KSlcbn1cbiJdfQ==