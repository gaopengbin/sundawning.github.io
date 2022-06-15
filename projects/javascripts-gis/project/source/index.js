/**
 * 添加样式
 * @param {HTMLElement} container
 * @param {string} text
 */
function appendStyleText(container, text) {
  const style = document.createElement("style");
  style.innerText = text;
  container.appendChild(style);
}
/**
 * 添加样式
 * @param {HTMLElement} container
 * @param {Response} response
 */
async function appendStyleResponse(container, response) {
  const text = await response.text();
  appendStyleText(container, text);
}
/**
 * 添加样式
 * @param {HTMLElement} container
 * @param {string} url
 */
async function appendStyleCSS(container, url) {
  const response = await fetch(url);
  appendStyleResponse(container, response);
}
/**
 * 添加元素
 * @param {HTMLElement} container
 * @param {HTMLElement} child
 */
function appendChild(container, child) {
  container.appendChild(child);
}
/**
 * 添加元素到document.body
 * @param {HTMLElement} child
 */
function appendChildToBody(child) {
  const body = document.body;
  appendChild(body, child);
}
/**
 * 使用Cesium创建Viewer
 * @param {HTMLElement} container
 * @param {object} Cesium
 * @returns Cesium.Viewer
 */
function getCesiumViewerCreate(container, Cesium) {
  return new Cesium.Viewer(container);
}
/**
 * 使用Cesium的JavaScript异步创建Viewer
 * @param {HTMLElement} container
 * @param {string} url
 * @returns Cesium.Viewer
 */
async function getCesiumViewerCreateAsync(container, url) {
  await import(url);
  return getCesiumViewerCreate(container, Cesium);
}
/**
 * 创建一个Cesium.Viewer
 * @param {HTMLElement} root 根元素
 * @param {url} CESIUM_BASE_URL
 * @returns
 */
async function getACesiumViewer(root, CESIUM_BASE_URL) {
  const container = document.createElement("div");
  container.attachShadow({ mode: "open" });
  appendStyleCSS(
    container.shadowRoot,
    `${CESIUM_BASE_URL}/Widgets/widgets.css`
  );
  const viewer = await getCesiumViewerCreateAsync(
    container.shadowRoot,
    `${CESIUM_BASE_URL}/Cesium.js`
  );
  appendChild(root, container);
  return viewer;
}
async function index() {
  const root = document.body;
  {
    window.CESIUM_BASE_URL =
      "https://cdnjs.cloudflare.com/ajax/libs/cesium/1.94.3";
    await getACesiumViewer(root, CESIUM_BASE_URL);
  }
}
index();
