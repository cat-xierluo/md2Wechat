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

import { EventRef, ItemView, Workspace, WorkspaceLeaf, Notice, Platform, TFile, Plugin } from 'obsidian';
import { uevent, waitForLayoutReady } from './utils';
import { NMPSettings } from './settings';
import AssetsManager from './assets';
import { ArticleRender } from './article-render';


export const VIEW_TYPE_NOTE_PREVIEW = 'note-preview';

export class NotePreview extends ItemView {
    workspace: Workspace;
    plugin: Plugin;
    mainDiv: HTMLDivElement;
    toolbar: HTMLDivElement;
    renderDiv: HTMLDivElement;
    articleDiv: HTMLDivElement;
    styleEl: HTMLElement;
    themeSelect: HTMLSelectElement;
    highlightSelect: HTMLSelectElement;
    listeners?: EventRef[];
    container: Element;
    settings: NMPSettings;
    assetsManager: AssetsManager;
    title: string;
    currentFile?: TFile;
    currentTheme: string;
    currentHighlight: string;
    _articleRender: ArticleRender | null = null;

    constructor(leaf: WorkspaceLeaf, plugin: Plugin) {
        super(leaf);
        this.workspace = this.app.workspace;
        this.plugin = plugin;
        this.settings = NMPSettings.getInstance();
        this.assetsManager = AssetsManager.getInstance();
        this.currentTheme = this.settings.defaultStyle;
        this.currentHighlight = this.settings.defaultHighlight;
    }

    getViewType() {
        return VIEW_TYPE_NOTE_PREVIEW;
    }

    getIcon() {
        return 'clipboard-paste';
    }

    getDisplayText() {
        return '笔记预览';
    }

    get render() {
        if (!this._articleRender) {
            this._articleRender = new ArticleRender(this.app, this, this.styleEl, this.articleDiv);
            this._articleRender.currentTheme = this.currentTheme;
            this._articleRender.currentHighlight = this.currentHighlight;
        }
        return this._articleRender;
    }

    async onOpen() {
        this.viewLoading();
        this.setup();
        uevent('open');
    }

    async setup() {
        await waitForLayoutReady(this.app);

        if (!this.settings.isLoaded) {
            const data = await this.plugin.loadData();
            NMPSettings.loadSettings(data);
        }
        if (!this.assetsManager.isLoaded) {
            await this.assetsManager.loadAssets();
        }

        this.buildUI();
        this.listeners = [
            this.workspace.on('file-open', () => {
                this.update();
            }),
            this.app.vault.on("modify", (file) => {
                if (this.currentFile?.path == file.path) {
                    this.renderMarkdown();
                }
            })
        ];

        this.renderMarkdown();
    }

    async onClose() {
        this.listeners?.forEach(listener => this.workspace.offref(listener));
        uevent('close');
    }

    async update() {
        this.renderMarkdown();
    }

    buildToolbar(parent: HTMLDivElement) {
        this.toolbar = parent.createDiv({ cls: 'preview-toolbar' });
        let lineDiv;

        // 复制、刷新
        lineDiv = this.toolbar.createDiv({ cls: 'toolbar-line' });

        const refreshBtn = lineDiv.createEl('button', { cls: 'refresh-button' }, async (button) => {
            button.setText('刷新');
        })

        refreshBtn.onclick = async () => {
            await this.assetsManager.loadCustomCSS();
            await this.assetsManager.loadExpertSettings();
            this.render.reloadStyle();
            await this.renderMarkdown();
            uevent('refresh');
        }

        if (Platform.isDesktop) {
            const copyBtn = lineDiv.createEl('button', { cls: 'copy-button' }, async (button) => {
                button.setText('复制');
            })

            copyBtn.onclick = async() => {
                try {
                    await this.render.copyArticle();
                    new Notice('复制成功，请到公众号编辑器粘贴。');
                    uevent('copy');
                } catch (error) {
                    console.error(error);
                    new Notice('复制失败: ' + error);
                }
            }

            const htmlBtn = lineDiv.createEl('button', { cls: 'copy-button' }, async (button) => {
                button.setText('导出HTML');
            })

            htmlBtn.onclick = async() => {
                await this.exportHTML();
                uevent('export-html');
            }
        }

        // 样式
        if (this.settings.showStyleUI) {
            lineDiv = this.toolbar.createDiv({ cls: 'toolbar-line' });
            const cssStyle = lineDiv.createDiv({ cls: 'style-label' });
            cssStyle.innerText = '样式:';

            const selectBtn = lineDiv.createEl('select', { cls: 'style-select' }, async (sel) => {

            })

            selectBtn.onchange = async () => {
                this.currentTheme = selectBtn.value;
                this.render.updateStyle(selectBtn.value);
            }

            for (let s of this.assetsManager.themes) {
                const op = selectBtn.createEl('option');
                op.value = s.className;
                op.text = s.name;
                op.selected = s.className == this.settings.defaultStyle;
            }

            this.themeSelect = selectBtn;

            const highlightStyle = lineDiv.createDiv({ cls: 'style-label' });
            highlightStyle.innerText = '代码高亮:';

            const highlightStyleBtn = lineDiv.createEl('select', { cls: 'style-select' }, async (sel) => {

            })

            highlightStyleBtn.onchange = async () => {
                this.currentHighlight = highlightStyleBtn.value;
                this.render.updateHighLight(highlightStyleBtn.value);
            }

            for (let s of this.assetsManager.highlights) {
                const op = highlightStyleBtn.createEl('option');
                op.value = s.name;
                op.text = s.name;
                op.selected = s.name == this.settings.defaultHighlight;
            }

            this.highlightSelect = highlightStyleBtn;
        }
    }

    async buildUI() {
        this.container = this.containerEl.children[1];
        this.container.empty();

        this.mainDiv = this.container.createDiv({ cls: 'note-preview' });

        this.buildToolbar(this.mainDiv);

        this.renderDiv = this.mainDiv.createDiv({cls: 'render-div'});
        this.renderDiv.id = 'render-div';
        this.renderDiv.setAttribute('style', '-webkit-user-select: text; user-select: text;');
        this.styleEl = this.renderDiv.createEl('style');
        this.styleEl.setAttr('title', 'note-to-mp-style');
        this.articleDiv = this.renderDiv.createEl('div');
    }

    async viewLoading() {
        const container = this.containerEl.children[1]
        container.empty();
        const loading = container.createDiv({cls: 'loading-wrapper'})
        loading.createDiv({cls: 'loading-spinner'})
    }

    async renderMarkdown(af: TFile | null = null) {
        if (!af) {
            af = this.app.workspace.getActiveFile();
        }
        if (!af || af.extension.toLocaleLowerCase() !== 'md') {
            return;
        }
        this.currentFile = af;
        await this.render.renderMarkdown(af);
        const metadata = this.render.getMetadata();

        if (metadata.theme) {
            this.assetsManager.themes.forEach(theme => {
                if (theme.name === metadata.theme) {
                    this.themeSelect.value = theme.className;
                }
            });
        }
        else {
            this.themeSelect.value = this.currentTheme;
        }

        if (metadata.highlight) {
            this.highlightSelect.value = this.render.currentHighlight;
        }
        else {
            this.highlightSelect.value = this.currentHighlight;
        }
    }

    async exportHTML() {
        try {
            await this.render.exportHTML();
            new Notice('HTML导出成功');
        } catch (error) {
            console.error(error);
            new Notice('HTML导出失败: ' + error);
        }
    }
}