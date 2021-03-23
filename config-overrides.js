const { override, fixBabelImports, addLessLoader, addDecoratorsLegacy } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({             // 自定义antd主题颜色,用到 less 变量覆盖功能
    javascriptEnabled: true,
    modifyVars: { "@primary-color": "#1DA57A" },
  }),
  addDecoratorsLegacy()
);
