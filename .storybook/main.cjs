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

        // Плагин для правильного разрешения CSS импортов
        const cssAliasPlugin = () => ({
            name: "css-alias-resolver",
            enforce: "pre", // Выполняем до других плагинов, чтобы перехватить до применения алиасов
            resolveId(id, importer) {
                // Если это CSS импорт из @glideapps/glide-data-grid
                if (id && typeof id === "string") {
                    // Проверяем различные варианты CSS импортов
                    if (
                        id === "@glideapps/glide-data-grid/dist/index.css" ||
                        id === "@glideapps/glide-data-grid/index.css" ||
                        (id.startsWith("@glideapps/glide-data-grid") && id.endsWith(".css"))
                    ) {
                        // Извлекаем путь после пакета
                        let path = id.replace("@glideapps/glide-data-grid", "");
                        // Убираем начальный слэш, если есть
                        if (path.startsWith("/")) {
                            path = path.substring(1);
                        }
                        // Если путь не начинается с dist/, добавляем его
                        if (!path.startsWith("dist/")) {
                            path = "dist/" + path;
                        }
                        const resolvedPath = resolve(__dirname, "../packages/core", path);
                        return resolvedPath;
                    }
                }
                return null;
            },
        });

        // Плагин для разрешения es-toolkit/compat
        const esToolkitPlugin = () => ({
            name: "es-toolkit-resolver",
            enforce: "pre",
            resolveId(id, importer) {
                if (id === "es-toolkit/compat" || id === "es-toolkit") {
                    // Пытаемся найти es-toolkit в node_modules
                    try {
                        const esToolkitPath = require.resolve("es-toolkit/compat", {
                            paths: [
                                resolve(__dirname, "../packages/cells/node_modules"),
                                resolve(__dirname, "../node_modules"),
                            ],
                        });
                        return esToolkitPath;
                    } catch (e) {
                        // Если не найдено, возвращаем null, чтобы Vite попытался найти сам
                        return null;
                    }
                }
                return null;
            },
        });

        // Используем стандартную конфигурацию wyw-in-js
        const wywPlugin = wyw.default();

        return mergeConfig(config, {
            plugins: [cssAliasPlugin(), esToolkitPlugin(), wywPlugin], // CSS плагин должен быть первым
            resolve: {
                alias: [
                    // Алиас только для не-CSS импортов - используем regex для исключения CSS
                    {
                        find: /^@glideapps\/glide-data-grid$/,
                        replacement: resolve(__dirname, "../packages/core/src/index.ts"),
                    },
                    // Резолв Babel плагина для preset-env
                    {
                        find: "@babel/plugin-bugfix-firefox-class-in-computed-class-key",
                        replacement: resolve(
                            __dirname,
                            "../node_modules/@babel/plugin-bugfix-firefox-class-in-computed-class-key"
                        ),
                    },
                    // Резолв es-toolkit/compat для react-resize-detector
                    {
                        find: /^es-toolkit(\/compat)?$/,
                        replacement: (() => {
                            const paths = [
                                resolve(__dirname, "../packages/cells/node_modules/es-toolkit"),
                                resolve(__dirname, "../node_modules/es-toolkit"),
                            ];
                            for (const basePath of paths) {
                                try {
                                    const compatPath = resolve(basePath, "compat");
                                    require.resolve(compatPath);
                                    return compatPath;
                                } catch (e) {
                                    // Продолжаем поиск
                                }
                            }
                            // Если не найдено, возвращаем путь к node_modules
                            return resolve(__dirname, "../node_modules/es-toolkit/compat");
                        })(),
                    },
                ],
            },
            optimizeDeps: {
                include: [
                    "@glideapps/glide-data-grid",
                    "prosemirror-keymap",
                    "prosemirror-history",
                    "es-toolkit/compat",
                    "@emotion/react",
                    "@floating-ui/dom",
                    "react-select",
                    "memoize-one",
                ],
                exclude: ["@wyw-in-js/vite"],
                esbuildOptions: {
                    logOverride: { "this-is-undefined-in-esm": "silent" },
                },
            },
            build: {
                rollupOptions: {
                    external: id => {
                        // Исключаем es-toolkit из сборки, если он не может быть разрешен
                        if (id === "es-toolkit" || id === "es-toolkit/compat") {
                            return false; // Не исключаем, пусть Vite попытается найти
                        }
                        return false;
                    },
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
