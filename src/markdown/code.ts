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

import { MarkedExtension, Tokens } from "marked";
import hljs from "highlight.js";
import { Extension } from "./extension";

export class CardDataManager {
	private cardData: Map<string, string>;
	private static instance: CardDataManager;

	private constructor() {
		this.cardData = new Map<string, string>();
	}

	// 静态方法，用于获取实例
	public static getInstance(): CardDataManager {
		if (!CardDataManager.instance) {
			CardDataManager.instance = new CardDataManager();
		}
		return CardDataManager.instance;
	}

	public setCardData(id: string, cardData: string) {
		this.cardData.set(id, cardData);
	}

	public cleanup() {
		this.cardData.clear();
	}

	public restoreCard(html: string) {
		for (const [key, value] of this.cardData.entries()) {
			const exp = `<section[^>]*\\sdata-id="${key}"[^>]*>(.*?)<\\/section>`;
			const regex = new RegExp(exp, 'gs');
			if (!regex.test(html)) {
				console.warn('没有公众号信息：', key);
				continue;
			}
			html = html.replace(regex, value);
		}
		return html;
	}
}

const MermaidSectionClassName = 'note-mermaid';

export class CodeRenderer extends Extension {
	showLineNumber: boolean;
	mermaidIndex: number;

	async prepare() {
		this.mermaidIndex = 0;
	}

	replaceSpaces(text: string) {
		let result = '';
		let inTag = false;
		for (let char of text) {
			if (char === '<') {
				inTag = true;
				result += char;
				continue;
			} else if (char === '>') {
				inTag = false;
				result += char;
				continue;
			}
			if (inTag) {
				result += char;
			} else {
				if (char === ' ') {
					result += '&nbsp;';
				} else if (char === '\t') {
					result += '&nbsp;&nbsp;&nbsp;&nbsp;';
				} else {
					result += char;
				}
			}
		}
		return result;
	}

	async codeRenderer(code: string, infostring: string | undefined) {
		const lang = (infostring || '').match(/^\S*/)?.[0];
		code = code.replace(/\n$/, '');

		try {
			if (lang && hljs.getLanguage(lang)) {
				code = hljs.highlight(code, { language: lang }).value;
			}
			else {
				code = hljs.highlightAuto(code).value;
			}
		} catch (err) {
			console.error(err);
		}

		code = this.replaceSpaces(code);
		const lines = code.split('\n');
		let body = '';
		let liItems = '';
		for (let line in lines) {
			let text = lines[line];
			if (text.length === 0) {
				text = '<br>'
			}
			body = body + '<code>' + text + '</code>';
			liItems = liItems + `<li>${parseInt(line)+1}</li>`;
		}

		let codeSection = '<section class="code-section code-snippet__fix hljs">';
		if (this.settings.lineNumber) {
			codeSection = codeSection + '<ul>'
				+ liItems
				+ '</ul>';
		}

		let html = '';
		if (lang) {
		html = codeSection + '<pre style="max-width:1000% !important;" class="hljs language-'
			+ lang
			+ '">'
			+ body
			+ '</pre></section>';
		}
		else {
			html = codeSection + '<pre>'
				+ body
				+ '</pre></section>';
		}

		return html;
	}

	parseCard(htmlString: string) {
		const id = /data-id="([^"]+)"/;
		const headimgRegex = /data-headimg="([^"]+)"/;
		const nicknameRegex = /data-nickname="([^"]+)"/;
		const signatureRegex = /data-signature="([^"]+)"/;

		const idMatch = htmlString.match(id);
		const headimgMatch = htmlString.match(headimgRegex);
		const nicknameMatch = htmlString.match(nicknameRegex);
		const signatureMatch = htmlString.match(signatureRegex);

		return {
			id: idMatch ? idMatch[1] : '',
			headimg: headimgMatch ? headimgMatch[1] : '',
			nickname: nicknameMatch ? nicknameMatch[1] : '公众号名称',
			signature: signatureMatch ? signatureMatch[1] : '公众号介绍'
		};
	}

	renderCard(token: Tokens.Code) {
		const { id, headimg, nickname, signature } = this.parseCard(token.text);
		if (id === '') {
			return '<span>公众号卡片数据错误，没有id</span>';
		}
		CardDataManager.getInstance().setCardData(id, token.text);
		return `<section data-id="${id}" class="note-mpcard-wrapper"><div class="note-mpcard-content"><img class="note-mpcard-headimg" width="54" height="54" src="${headimg}"></img><div class="note-mpcard-info"><div class="note-mpcard-nickname">${nickname}</div><div class="note-mpcard-signature">${signature}</div></div></div><div class="note-mpcard-foot">公众号</div></section>`;
	}

	renderMermaid(token: Tokens.Code) {
		try {
			const meraidIndex = this.mermaidIndex;
			const containerId = `mermaid-${meraidIndex}`;
			this.callback.cacheElement('mermaid', containerId, token.raw);
			this.mermaidIndex += 1;
			return `<section id="${containerId}" class="${MermaidSectionClassName}"></section>`;
		} catch (error) {
			console.error(error.message);
			return '<span>mermaid渲染失败</span>';
		}
	}

	markedExtension(): MarkedExtension {
		return {
			async: true,
			walkTokens: async (token: Tokens.Generic) => {
				if (token.type !== 'code') return;
				if (token.lang && token.lang.trim().toLocaleLowerCase() == 'mermaid') {
					token.html = this.renderMermaid(token as Tokens.Code);
					return;
				}
				if (token.lang && token.lang.trim().toLocaleLowerCase() == 'mpcard') {
					token.html = this.renderCard(token as Tokens.Code);
					return;
				}
				token.html = await this.codeRenderer(token.text, token.lang);
			},
			extensions: [{
				name: 'code',
				level: 'block',
				renderer: (token: Tokens.Generic) => {
					return token.html;
				},
			}]
		}
	}
}