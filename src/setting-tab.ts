/*
 * Copyright (c) 2024-2025 Sun Booshi
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { App, PluginSettingTab, Setting, sanitizeHTMLToDom } from 'obsidian';
import NoteToMpPlugin from './main';
import { NMPSettings } from './settings';

export class NoteToMpSettingTab extends PluginSettingTab {
	plugin: NoteToMpPlugin;
	settings: NMPSettings;

	constructor(app: App, plugin: NoteToMpPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = NMPSettings.getInstance();
	}

	display() {
		const {containerEl} = this;

		containerEl.empty();

		const helpEl = containerEl.createEl('div');
		helpEl.style.cssText = 'display: flex;flex-direction: row;align-items: center;';
		helpEl.createEl('h2', {text: '帮助文档'}).style.cssText = 'margin-right: 10px;';
		helpEl.createEl('a', {text: 'https://sunboshi.tech/doc', attr: {href: 'https://sunboshi.tech/doc'}});

		containerEl.createEl('h2', {text: '插件设置'});

		new Setting(containerEl)
			.setName('默认样式')
			.addDropdown(dropdown => {
                const styles = this.plugin.assetsManager.themes;
                for (let s of styles) {
				    dropdown.addOption(s.className, s.name);
                }
				dropdown.setValue(this.settings.defaultStyle);
                dropdown.onChange(async (value) => {
					this.settings.defaultStyle = value;
					await this.plugin.saveSettings();
                });
			});

		new Setting(containerEl)
			.setName('代码高亮')
			.addDropdown(dropdown => {
                const styles = this.plugin.assetsManager.highlights;
                for (let s of styles) {
				    dropdown.addOption(s.name, s.name);
                }
				dropdown.setValue(this.settings.defaultHighlight);
                dropdown.onChange(async (value) => {
					this.settings.defaultHighlight = value;
					await this.plugin.saveSettings();
                });
			});

		new Setting(containerEl)
			.setName('在工具栏展示样式选择')
			.setDesc('建议在移动端关闭，可以增大文章预览区域')
			.addToggle(toggle => {
			    toggle.setValue(this.settings.showStyleUI);
				toggle.onChange(async (value) => {
				    this.settings.showStyleUI = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('链接展示样式')
			.addDropdown(dropdown => {
				dropdown.addOption('inline', '内嵌');
			    dropdown.addOption('footnote', '脚注');
				dropdown.setValue(this.settings.linkStyle);
				dropdown.onChange(async (value) => {
				    this.settings.linkStyle = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('文件嵌入展示样式')
			.addDropdown(dropdown => {
				dropdown.addOption('quote', '引用');
			    dropdown.addOption('content', '正文');
				dropdown.setValue(this.settings.embedStyle);
				dropdown.onChange(async (value) => {
				    this.settings.embedStyle = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('显示代码行号')
			.addToggle(toggle => {
			    toggle.setValue(this.settings.lineNumber);
				toggle.onChange(async (value) => {
				    this.settings.lineNumber = value;
					await this.plugin.saveSettings();
				});
			})

		new Setting(containerEl)
			.setName('启用空行渲染')
			.addToggle(toggle => {
			    toggle.setValue(this.settings.enableEmptyLine);
				toggle.onChange(async (value) => {
				    this.settings.enableEmptyLine = value;
					await this.plugin.saveSettings();
				});
			})

		new Setting(containerEl)
			.setName('渲染图片标题')
			.addToggle(toggle => {
				toggle.setValue(this.settings.useFigcaption);
				toggle.onChange(async (value) => {
					this.settings.useFigcaption = value;
					await this.plugin.saveSettings();
				});
			})

		new Setting(containerEl)
			.setName('Excalidraw 渲染为 PNG 图片')
			.addToggle(toggle => {
				toggle.setValue(this.settings.excalidrawToPNG);
				toggle.onChange(async (value) => {
					this.settings.excalidrawToPNG = value;
					await this.plugin.saveSettings();
				});
			})

		new Setting(containerEl)
			.setName('水印图片')
			.addText(text => {
			    text.setPlaceholder('请输入图片名称')
					.setValue(this.settings.watermark)
					.onChange(async (value) => {
					  this.settings.watermark = value.trim();
						await this.plugin.saveSettings();
					})
					.inputEl.setAttr('style', 'width: 320px;')
			})

		new Setting(containerEl)
			.setName('获取更多主题')
			.addButton(button => {
			    button.setButtonText('下载');
				button.onClick(async () => {
					button.setButtonText('下载中...');
					await this.plugin.assetsManager.downloadThemes();
					button.setButtonText('下载完成');
				});
			})
			.addButton(button => {
				button.setIcon('folder-open');
				button.onClick(async () => {
					await this.plugin.assetsManager.openAssets();
				});
			});

		new Setting(containerEl)
			.setName('清空主题')
			.addButton(button => {
			    button.setButtonText('清空');
				button.onClick(async () => {
					await this.plugin.assetsManager.removeThemes();
					this.settings.resetStyelAndHighlight();
					await this.plugin.saveSettings();
				});
			})

		new Setting(containerEl)
			.setName('全局CSS属性')
			.setDesc('只能填写CSS属性，不能写选择器')
			.addTextArea(text => {
			    text.setPlaceholder('请输入CSS属性，如：background: #fff;padding: 10px;')
				    .setValue(this.settings.baseCSS)
					.onChange(async (value) => {
					    this.settings.baseCSS = value;
						await this.plugin.saveSettings();
					})
				    .inputEl.setAttr('style', 'width: 520px; height: 60px;');
		})

		const customCSSDoc = '使用指南：<a href="https://sunboshi.tech/customcss">https://sunboshi.tech/customcss</a>';
		new Setting(containerEl)
			.setName('自定义CSS笔记')
			.setDesc(sanitizeHTMLToDom(customCSSDoc))
			.addText(text => {
				text.setPlaceholder('请输入自定义CSS笔记标题')
				.setValue(this.settings.customCSSNote)
				.onChange(async (value) => {
					this.settings.customCSSNote = value.trim();
					await this.plugin.saveSettings();
					await this.plugin.assetsManager.loadCustomCSS();
				})
				.inputEl.setAttr('style', 'width: 320px;')
		});

		const expertDoc = '使用指南：<a href="https://sunboshi.tech/expert">https://sunboshi.tech/expert</a>';
		new Setting(containerEl)
			.setName('专家设置笔记')
			.setDesc(sanitizeHTMLToDom(expertDoc))
			.addText(text => {
				text.setPlaceholder('请输入专家设置笔记标题')
				.setValue(this.settings.expertSettingsNote)
				.onChange(async (value) => {
					this.settings.expertSettingsNote = value.trim();
					await this.plugin.saveSettings();
					await this.plugin.assetsManager.loadExpertSettings();
				})
				.inputEl.setAttr('style', 'width: 320px;')
		});
	}
}