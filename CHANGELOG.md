# [6.2.0](https://github.com/RamK-16/glide/compare/v6.1.8...v6.2.0) (2026-09-04)


### Bug Fixes

* **copy-paste:** затирание покрытых колонок блока в многострочном копировании ([68e8ffc](https://github.com/RamK-16/glide/commit/68e8ffc008522e2ecf1ed142d2e8772b6bc5f34f))
* **core:** expand hover damage region to full merged block (hairline path) ([e38e7ad](https://github.com/RamK-16/glide/commit/e38e7adc50bc96c152f24a1d04ff51579f756f88))
* **core:** keep selection ring on the true cell edge unless clipped by canvas ([ff0dc4b](https://github.com/RamK-16/glide/commit/ff0dc4bb321745083a93570a96f2b808e7f9ef2b))
* **core:** normalize covered-cell clicks to block origin ([77f7769](https://github.com/RamK-16/glide/commit/77f776928e6a09ca3617f59cc55426f0ef3e95f3))
* **core:** partial merged-block tint also for native range accents ([20058b2](https://github.com/RamK-16/glide/commit/20058b29e1d2decf688bb38e6c53a6785d005b15))
* **core:** restore selection outline and fill handle over merged block on hover ([1e73f75](https://github.com/RamK-16/glide/commit/1e73f7579915a2d9b4c5ec2de76b1b2f9e7f770e))
* **data-editor:** память полосы учитывает пропуск строк-заголовков групп ([3de43f9](https://github.com/RamK-16/glide/commit/3de43f9b6d178049705a80ecc7b6ea31cfff61f6))
* **data-editor:** расширяем выделение до нового блока при смене данных ([0e4675f](https://github.com/RamK-16/glide/commit/0e4675fd6cbe56f25253e1d6122dc469589872f0))
* **data-editor:** убираем затенение имени spanAlign ([2a4a575](https://github.com/RamK-16/glide/commit/2a4a5751cae237afa7ac520e8d02ae70080784b0))
* **data-grid:** keep merged-cell borders on hover regardless of enableLowDprHairline ([7bd38e1](https://github.com/RamK-16/glide/commit/7bd38e114201e27f3e652712f76eed22214bb4f9))
* **data-grid:** remove group-header hover flash on selection by base-then-overlay fill ([8ecfddf](https://github.com/RamK-16/glide/commit/8ecfddfcdd3861a546b923106794a6d07f10a811))
* **data-grid:** scope body-cell span normalization to the cell branch ([575e6bd](https://github.com/RamK-16/glide/commit/575e6bd41f6a6fad0c13a4751f8ba8b4a28f1106))
* **data-grid:** stop header damage clip bleeding into neighbor group row ([dee4f02](https://github.com/RamK-16/glide/commit/dee4f02dfec7dcfc274f5c3809394383e2244286))
* **data-grid:** полоса выделения в блоке через границу закрепления ([385bec6](https://github.com/RamK-16/glide/commit/385bec6b5d6fae36f9794a87bae936fc15bb242c))
* **render:** reflect origin-row selection in merged cell fill color ([4f53f73](https://github.com/RamK-16/glide/commit/4f53f73ed55a738fdf5d773d8ba17339f878ffac))
* **render:** tint merged-cell selection per row/column, not whole block ([f93a493](https://github.com/RamK-16/glide/commit/f93a493667a6e51501e93a301ce58fa408280350))


### Features

* **core:** snap fill handle drag preview to merged block boundaries ([66e8ac8](https://github.com/RamK-16/glide/commit/66e8ac868d7fcc3f1f2b3db0d0b35cb39858ddac))
* **core:** tint only the intersection of highlight regions with merged blocks ([94bb341](https://github.com/RamK-16/glide/commit/94bb341a56e825bb1535152fa58f69a73ffc06d8))
* **data-editor:** merged-cell interactions for nav, fill, copy, paste, delete ([35c6b00](https://github.com/RamK-16/glide/commit/35c6b000062867b2fadec009bcd4bd4717a7bbd0))
* **data-editor:** память строки и колонки входа при навигации сквозь блоки ([ff0df36](https://github.com/RamK-16/glide/commit/ff0df36661d3eb32bf943036459fc3e381006f22))
* **data-grid:** cell rowspan + rectangular merge with 2D align (WIP) ([f7ea578](https://github.com/RamK-16/glide/commit/f7ea57874b5d56ee5257a5fc193b0792d1349979))
* **data-grid:** cell rowspan hit-test + selection awareness + tests (WIP) ([3706c3c](https://github.com/RamK-16/glide/commit/3706c3cbad9d68954581aa6436a59cf3d7aff64a))
* **data-grid:** draw the selection focus ring around the whole merged cell (WIP) ([bb9ab2a](https://github.com/RamK-16/glide/commit/bb9ab2a4b67f6d1cc99f00d2462a1cceb1c69b92))
* **data-grid:** expandSelection widens range over rowspan blocks (WIP) ([5f2ff74](https://github.com/RamK-16/glide/commit/5f2ff744a958423f9e1bbb9936dbb5aab40f68bf))
* **overlay:** позиционируем оверлей редактора по вертикали объединения ([58ef399](https://github.com/RamK-16/glide/commit/58ef3991dee67e97b8d669918b27435a4eab5704))


### Performance Improvements

* **data-grid:** убираем лишнюю перерисовку и создание массивов ([3293751](https://github.com/RamK-16/glide/commit/329375180276c3885fa5de35e56241516fe99cdd))

## [6.1.8](https://github.com/RamK-16/glide/compare/v6.1.7...v6.1.8) (2026-08-15)


### Bug Fixes

* **header:** чинит сквош слитой группы во время drag-реордера колонок ([#45](https://github.com/RamK-16/glide/issues/45)) ([bc7f3b8](https://github.com/RamK-16/glide/commit/bc7f3b8220433f2d1ea852c95bce17420a9ee964))

## [6.1.7](https://github.com/RamK-16/glide/compare/v6.1.6...v6.1.7) (2026-08-15)


### Bug Fixes

* **header:** убрать проблеск ховера группы и ложную левую линию слитой шапки на первой позиции ([#44](https://github.com/RamK-16/glide/issues/44)) ([6ef15e4](https://github.com/RamK-16/glide/commit/6ef15e4df7414e25e874884a3b71996173414a0b))

## [6.1.6](https://github.com/RamK-16/glide/compare/v6.1.5...v6.1.6) (2026-08-13)


### Bug Fixes

* **data-grid:** draw group header background for custom drawGroupHeader ([0f1bd46](https://github.com/RamK-16/glide/commit/0f1bd469369b5d16ed506d23d02977f42e32bd22))

## [6.1.5](https://github.com/RamK-16/glide/compare/v6.1.4...v6.1.5) (2026-08-13)


### Bug Fixes

* **data-grid:** drop group header top inset at the top level ([#42](https://github.com/RamK-16/glide/issues/42)) ([34bbf10](https://github.com/RamK-16/glide/commit/34bbf104f0a9d828b7f00f39b15a0810e82e4e76))

## [6.1.4](https://github.com/RamK-16/glide/compare/v6.1.3...v6.1.4) (2026-08-13)


### Bug Fixes

* **data-grid:** keep group header top border and stop hover flicker ([#41](https://github.com/RamK-16/glide/issues/41)) ([27b5df1](https://github.com/RamK-16/glide/commit/27b5df1eec13b3181164bff98926c18c8a082181))

## [6.1.3](https://github.com/RamK-16/glide/compare/v6.1.2...v6.1.3) (2026-08-13)


### Bug Fixes

* **data-grid:** repair group header damage on column drag reorder ([a87dd58](https://github.com/RamK-16/glide/commit/a87dd58f6ca31cf7a7fef97c6b1537b7fb82ef8e))

## [6.1.2](https://github.com/RamK-16/glide/compare/v6.1.1...v6.1.2) (2026-08-12)


### Bug Fixes

* **data-grid:** group header padding and icon geometry from theme ([d4aea6a](https://github.com/RamK-16/glide/commit/d4aea6ae8e6e2e9326a41348cfbda2578108842c))

## [6.1.1](https://github.com/RamK-16/glide/compare/v6.1.0...v6.1.1) (2026-08-12)


### Bug Fixes

* **data-grid:** grid-level spanGroupHeader forwarding + mixed no-group span ([3167c2a](https://github.com/RamK-16/glide/commit/3167c2a6c8a42d6d028785b4ffa962e0f12245cd))

# [6.1.0](https://github.com/RamK-16/glide/compare/v6.0.19...v6.1.0) (2026-08-11)


### Bug Fixes

* **data-grid:** don't clip group-row of all-spanned header groups ([d64bd2d](https://github.com/RamK-16/glide/commit/d64bd2da5309134556d1b3441f0259084a16c835))
* **data-grid:** draw spanGroupHeader left border only over group band ([6297b50](https://github.com/RamK-16/glide/commit/6297b508087cbcfc59e913b59127ec3af141858a))


### Features

* **data-grid:** grid-level spanGroupHeader default for leaf columns ([fb75abc](https://github.com/RamK-16/glide/commit/fb75abc83506c12615b4cac36398e9a1292c809b))
* spanAlign — text alignment inside merged header cells (horizontal + vertical) ([11e8694](https://github.com/RamK-16/glide/commit/11e8694aee4850a92085852f84c937b595cc53ac))
* spanGroupHeader — merged (rowspan) header cells for standalone columns ([733669f](https://github.com/RamK-16/glide/commit/733669faf6e0cc9956b68e86dc7490eb2725d2d2)), closes [#13](https://github.com/RamK-16/glide/issues/13)
* spanShallowGroups — rowspan for shallow group headers ([75db49f](https://github.com/RamK-16/glide/commit/75db49f72a5206448bed57b777bb395d6cf60045))

## [6.0.19](https://github.com/RamK-16/glide/compare/v6.0.18...v6.0.19) (2026-08-11)


### Bug Fixes

* stop depending on upstream @glideapps/glide-data-grid ([89faf06](https://github.com/RamK-16/glide/commit/89faf06160510ec43a3bc840d1a9fe01b7c530c2))

## [6.0.18](https://github.com/RamK-16/glide/compare/v6.0.17...v6.0.18) (2026-08-11)


### Bug Fixes

* add clarifying comment marker for semantic-release check ([dd2fefe](https://github.com/RamK-16/glide/commit/dd2fefedec293fdd846c8c7b0adc2896baa449f6))
