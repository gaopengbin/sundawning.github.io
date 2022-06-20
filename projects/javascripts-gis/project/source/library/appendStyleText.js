if (globalThis.SunDawningGIS === undefined) {
  globalThis.SunDawningGIS = {};
}
/**
 * 添加样式
 * @param {HTMLElement} container
 * @param {string} text
 */
SunDawningGIS.appendStyleText = function (container, text) {
  const style = document.createElement("style");
  style.innerHTML = text;
  container.appendChild(style);
};
