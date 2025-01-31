Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWFkMDIyOC0zZjQyLTRlMzUtYjQ4YS0xNjBhMDgwNTE4YTAiLCJpZCI6NzY5MDcsImlhdCI6MTY0NTI2NDUzMH0.N9v17oLP08jFvYtSns4GXGAXNf6pPqdKI_FpQx8QADA";
const container = document.createElement("div");
container.className = "container";
document.body.appendChild(container);
const viewer = new Cesium.Viewer(container);
const rectangle = Cesium.Rectangle.fromDegrees(
  113.751453,
  22.396344,
  114.628466,
  22.861748
);
{
  // 默认home的位置
  viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (
    event
  ) {
    event.cancel = true;
    //你要飞的位置
    viewer.camera.flyTo({
      destination: rectangle,
      duration: 0.5,
    });
  });
  // ————————————————
  // 版权声明：本文为CSDN博主「easyCesium」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
  // 原文链接：https://blog.csdn.net/caozl1132/article/details/89446311
}
function setGlobeToRectangle(viewer) {
  // 只显示一定区域的地球
  const scene = viewer.scene;
  const globe = scene.globe;
  globe.cartographicLimitRectangle = rectangle;
  globe.showSkirts = false;
  globe.backFaceCulling = false;
  globe.undergroundColor = undefined;
  scene.skyAtmosphere.show = false;
}
{
  // 添加地形
  viewer.scene.terrainProvider = Cesium.createWorldTerrain();
}
{
  // 添加地图
  // https://www.cnblogs.com/fuckgiser/p/5647429.html
  viewer.imageryLayers.removeAll();
  viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      minimumLevel: 3,
      maximumLevel: 18,
    })
  );
}
{
  // 飞到指定范围 https://www.cnblogs.com/xym0710/p/14949107.html
  // 某地的行政区域 https://www.zhoulujun.cn/html/GIS/WebGIS/8155.html
  viewer.camera.setView({
    destination: rectangle,
  });
}
{
  // https://zhuanlan.zhihu.com/p/344395928
  // https://github.com/TangSY/echarts-map-demo
  // https://hxkj.vip/demo/echartsMap/
  // https://sandcastle.cesium.com/index.html?src=GeoJSON%20and%20TopoJSON.html
  // 加载JSON文件并显示属性 https://blog.csdn.net/qq_41553157/article/details/91040920
  Cesium.GeoJsonDataSource.load("../public/440300.geoJson", {
    fill: new Cesium.Color(0, 0, 0, 0),
  }).then(function (dataSource) {
    console.log("dataSource", dataSource);
    viewer.dataSources.add(dataSource);
    const labels = viewer.scene.primitives.add(new Cesium.LabelCollection());
    dataSource.entities.values.forEach(function (entity) {
      labels.add({
        position: Cesium.Cartesian3.fromDegrees.apply(
          null,
          entity.properties.centroid._value
        ),
        text: entity.name,
        scaleByDistance: new Cesium.NearFarScalar(50000, 1, 1000000, 0),
      });
    });
  });
}
{
  //   // 1.影像图
  // https://webst01.is.autonavi.com/appmaptile?x=54658&y=26799&z=16&style=6
  // // 2.道路纯图
  // https://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x=54658&y=26799&z=16&scl=1&ltype=2
  // // 3.道路简图
  // http://webrd01.is.autonavi.com/appmaptile?x=54658&y=26799&z=16&size=1&scale=1&style=7
  // // 4.道路详图
  // http://webrd01.is.autonavi.com/appmaptile?x=54658&y=26799&z=16&lang=zh_cn&size=1&scale=1&style=8
  // // 5.纯道路图
  // http://wprd01.is.autonavi.com/appmaptile?x=54658&y=26799&z=16&lang=zh_cn&size=1&scl=1&style=8&ltype=11
  // // 6.纯地标图
  // https://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x=54658&y=26799&z=16&scl=1&ltype=4
  // // 7.路网注记图
  // http://webst01.is.autonavi.com/appmaptile?x=54658&y=26799&z=16&lang=zh_cn&size=1&scale=1&style=8

  // ————————————————
  // 版权声明：本文为CSDN博主「右弦」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
  // 原文链接：https://blog.csdn.net/weixin_45782925/article/details/122984175
  // 定义一些常量
  const PI = 3.1415926535897932384626;
  const RADIUS = 6378245.0;
  const EE = 0.00669342162296594323;
  class CoordTransform {
    /**
     * WGS-84(世界大地坐标系) To GCJ-02(火星坐标系)
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static WGS84ToGCJ02(lng, lat) {
      lat = +lat;
      lng = +lng;
      if (this.out_of_china(lng, lat)) {
        return [lng, lat];
      } else {
        let d = this.delta(lng, lat);
        return [lng + d[0], lat + d[1]];
      }
    }
    /**
     * GCJ-02(火星坐标系) To WGS-84(世界大地坐标系)
     * @param lng
     * @param lat
     * @returns {number[]}
     * @constructor
     */
    static GCJ02ToWGS84(lng, lat) {
      lat = +lat;
      lng = +lng;
      if (this.out_of_china(lng, lat)) {
        return [lng, lat];
      } else {
        let d = this.delta(lng, lat);
        let mgLng = lng + d[0];
        let mgLat = lat + d[1];
        return [lng * 2 - mgLng, lat * 2 - mgLat];
      }
    }
    /**
     *
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static delta(lng, lat) {
      let dLng = this.transformLng(lng - 105, lat - 35);
      let dLat = this.transformLat(lng - 105, lat - 35);
      const radLat = (lat / 180) * PI;
      let magic = Math.sin(radLat);
      magic = 1 - EE * magic * magic;
      const sqrtMagic = Math.sqrt(magic);
      dLng = (dLng * 180) / ((RADIUS / sqrtMagic) * Math.cos(radLat) * PI);
      dLat = (dLat * 180) / (((RADIUS * (1 - EE)) / (magic * sqrtMagic)) * PI);
      return [dLng, dLat];
    }
    /**
     *
     * @param lng
     * @param lat
     * @returns {number}
     */
    static transformLng(lng, lat) {
      lat = +lat;
      lng = +lng;
      let ret =
        300.0 +
        lng +
        2.0 * lat +
        0.1 * lng * lng +
        0.1 * lng * lat +
        0.1 * Math.sqrt(Math.abs(lng));
      ret +=
        ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) *
          2.0) /
        3.0;
      ret +=
        ((150.0 * Math.sin((lng / 12.0) * PI) +
          300.0 * Math.sin((lng / 30.0) * PI)) *
          2.0) /
        3.0;
      return ret;
    }
    /**
     *
     * @param lng
     * @param lat
     * @returns {number}
     */
    static transformLat(lng, lat) {
      lat = +lat;
      lng = +lng;
      let ret =
        -100.0 +
        2.0 * lng +
        3.0 * lat +
        0.2 * lat * lat +
        0.1 * lng * lat +
        0.2 * Math.sqrt(Math.abs(lng));
      ret +=
        ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) *
          2.0) /
        3.0;
      ret +=
        ((160.0 * Math.sin((lat / 12.0) * PI) +
          320 * Math.sin((lat * PI) / 30.0)) *
          2.0) /
        3.0;
      return ret;
    }
    /**
     * 判断是否在国内。不在国内不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    static out_of_china(lng, lat) {
      lat = +lat;
      lng = +lng;
      return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
    }
  }
  {
    const {
      WebMercatorProjection,
      WebMercatorTilingScheme,
      Cartographic,
      Cartesian2,
    } = Cesium;
    const CesiumMath = Cesium.Math;
    class AmapMercatorTilingScheme extends WebMercatorTilingScheme {
      constructor() {
        super();
        this._projection = {};
        let projection = new WebMercatorProjection();
        this._projection.project = function (cartographic, result) {
          result = CoordTransform.WGS84ToGCJ02(
            CesiumMath.toDegrees(cartographic.longitude),
            CesiumMath.toDegrees(cartographic.latitude)
          );
          result = projection.project(
            new Cartographic(
              CesiumMath.toRadians(result[0]),
              CesiumMath.toRadians(result[1])
            )
          );
          return new Cartesian2(result.x, result.y);
        };
        this._projection.unproject = function (cartesian, result) {
          let cartographic = projection.unproject(cartesian);
          result = CoordTransform.GCJ02ToWGS84(
            CesiumMath.toDegrees(cartographic.longitude),
            CesiumMath.toDegrees(cartographic.latitude)
          );
          return new Cartographic(
            CesiumMath.toRadians(result[0]),
            CesiumMath.toRadians(result[1])
          );
        };
      }
    }
    // 作者：山河木马
    // 链接：https://juejin.cn/post/7049681493685174286
    // 来源：稀土掘金
    // 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
    // 设置图层透明度 https://www.jianshu.com/p/98d4c0b2c618
    const imageryLayer = viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: "http://webst01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
        minimumLevel: 3,
        maximumLevel: 18,
        rectangle: rectangle,
        tilingScheme: new AmapMercatorTilingScheme(),
      })
    );
    console.log("imageryLayer", imageryLayer);
    imageryLayer.alpha = 0.5;
  }
}
{
  // 左键点击获取经纬度 https://www.jianshu.com/p/f6fc8ed7eefc
  new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas).setInputAction(
    function (event) {
      const { longitude, latitude } = Cesium.Cartographic.fromCartesian(
        viewer.camera.pickEllipsoid(
          event.position,
          viewer.scene.globe.ellipsoid
        )
      );
      console.log(
        JSON.stringify(
          [longitude, latitude].map(function (item) {
            return Cesium.Math.toDegrees(item);
          })
        )
      );
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  );
}
{
  const positions = {
    铁路公园: [113.88505822363172, 22.50586341859473],
    车公庙: [114.02082413481095, 22.53899868556823],
    农林: [114.01305395943092, 22.54322075899385],
    西丽: [113.94947657111055, 22.583676913934585],
    南山: [113.91874213381998, 22.52699829284238],
  };
  const labels = viewer.scene.primitives.add(new Cesium.LabelCollection());
  Object.keys(positions).forEach(function (key) {
    const value = positions[key];
    labels.add({
      position: Cesium.Cartesian3.fromDegrees.apply(null, value),
      text: key,
      scaleByDistance: new Cesium.NearFarScalar(50000, 1, 1000000, 0),
      font: "16px",
      showBackground: true,
      backgroundColor: Cesium.Color.fromCssColorString("#5bbc7e"),
    });
  });
}
function snapshot() {
  // Cesium场景导出为图片功能 https://blog.csdn.net/xietao20/article/details/109401838
  function canvasToFile(canvas) {
    let image = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let link = document.createElement("a");
    let blob = dataURLtoBlob(image);
    let objurl = URL.createObjectURL(blob);
    link.download = "scene.png";
    link.href = objurl;
    link.click();
  }
  function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  viewer.render();
  canvasToFile(viewer.scene.canvas);
}
