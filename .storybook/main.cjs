const { dirname, join } = require("path");

module.exports = {
    stories: ["../**/src/**/*.stories.tsx"],
    addons: [getAbsolutePath("@storybook/addon-docs")],

    typescript: {
        reactDocgen: false,
    },

    async viteFinal(config) {
        const { mergeConfig } = await import("vite");
        const { resolve } = require("path");
        const wyw = await import("@wyw-in-js/vite");
        return mergeConfig(config, {
            plugins: [wyw.default()],
            resolve: {
                alias: {
                    "@glideapps/glide-data-grid": resolve(__dirname, "../packages/core/src/index.ts"),
                },
            },
            optimizeDeps: {
                include: ["@glideapps/glide-data-grid"],
                exclude: ["@wyw-in-js/vite"],
                esbuildOptions: {
                    logOverride: { "this-is-undefined-in-esm": "silent" },
                },
            },
            server: {
                fs: {
                    allow: [".."],
                },
            },
        });
    },

    framework: {
        name: getAbsolutePath("@storybook/react-vite"),
        options: {},
    },
};

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, "package.json")));
}
