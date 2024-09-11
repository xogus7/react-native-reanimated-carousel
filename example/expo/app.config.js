export default () => {
  return {
    name: "exampleExpo",
    slug: "exampleExpo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: [
      "**/*",
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.rnrc.exampleExpo",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      enablePretty: process.env.PRETTY === "true",
    },
  };
};
