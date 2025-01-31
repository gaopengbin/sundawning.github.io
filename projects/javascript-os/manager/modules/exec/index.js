const log = require("server/modules/log");
const child_process = require("child_process");
/**
 * 异步执行命令
 * @param {string} command
 * @param {object} options
 * @param {function} callback
 */
module.exports = function (command, options, callback) {
  log("执行命令", command);
  const child = child_process.exec(command, options, callback);
  ["stderr", "stdout", "stdin"].forEach(function (location) {
    child[location].pipe(process[location]);
  });
};
