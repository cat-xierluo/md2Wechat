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

// 默认 XCode 风格
export const HighlightXCode = `
pre code.hljs {
  display: block;
}
.hljs {
  background: #fff;
  color: black
}
.xml .hljs-meta {
  color: #c0c0c0
}
.hljs-comment,
.hljs-quote {
  color: #007400
}
.hljs-tag,
.hljs-attribute,
.hljs-keyword,
.hljs-selector-tag,
.hljs-literal,
.hljs-name {
  color: #aa0d91
}
.hljs-variable,
.hljs-template-variable {
  color: #3F6E74
}
.hljs-code,
.hljs-string,
.hljs-meta .hljs-string {
  color: #c41a16
}
.hljs-regexp,
.hljs-link {
  color: #0E0EFF
}
.hljs-title,
.hljs-symbol,
.hljs-bullet,
.hljs-number {
  color: #1c00cf
}
.hljs-section,
.hljs-meta {
  color: #643820
}
.hljs-title.class_,
.hljs-class .hljs-title,
.hljs-type,
.hljs-built_in,
.hljs-params {
  color: #5c2699
}
.hljs-attr {
  color: #836C28
}
.hljs-subst {
  color: #000
}
.hljs-formula {
  background-color: #eee;
  font-style: italic
}
.hljs-addition {
  background-color: #baeeba
}
.hljs-deletion {
  background-color: #ffc8bd
}
.hljs-selector-id,
.hljs-selector-class {
  color: #9b703f
}
.hljs-doctag,
.hljs-strong {
  font-weight: bold
}
.hljs-emphasis {
  font-style: italic
}
`;

// Monokai 风格
export const HighlightMonokai = `
.hljs {
  background: #272822;
  color: #f8f8f2;
}
.hljs-tag,
.hljs-literal,
.hljs-name {
  color: #f92672;
}
.hljs-attribute,
.hljs-symbol,
.hljs-params {
  color: #fd971f;
}
.hljs-keyword,
.hljs-selector-tag,
.hljs-string {
  color: #a6e22e;
}
.hljs-title,
.hljs-section {
  color: #a6e22e;
  font-weight: bold;
}
.hljs-comment,
.hljs-quote {
  color: #75715e;
}
.hljs-number,
.hljs-regexp,
.hljs-type,
.hljs-built_in {
  color: #ae81ff;
}
.hljs-variable,
.hljs-template-variable {
  color: #f8f8f2;
}
.hljs-meta {
  color: #66d9ef;
}
.hljs-deletion {
  background: #493a3a;
}
.hljs-addition {
  background: #3d3a33;
}
.hljs-emphasis {
  font-style: italic;
}
.hljs-strong {
  font-weight: bold;
}
`;

// GitHub 风格
export const HighlightGitHub = `
.hljs {
  background: #f6f8fa;
  color: #24292e;
}
.hljs-comment,
.hljs-quote {
  color: #6a737d;
}
.hljs-keyword,
.hljs-selector-tag {
  color: #d73a49;
}
.hljs-string,
.hljs-doctag {
  color: #032f62;
}
.hljs-number,
.hljs-regexp,
.hljs-literal {
  color: #005cc5;
}
.hljs-variable,
.hljs-template-variable {
  color: #e36209;
}
.hljs-tag .hljs-attr {
  color: #22863a;
}
.hljs-title,
.hljs-section {
  color: #6f42c1;
  font-weight: bold;
}
.hljs-type,
.hljs-class .hljs-title {
  color: #005cc5;
}
.hljs-tag,
.hljs-name {
  color: #22863a;
}
.hljs-attribute {
  color: #6f42c1;
}
.hljs-meta {
  color: #6a737d;
}
.hljs-deletion {
  background: #ffeef0;
}
.hljs-addition {
  background: #f0fff4;
}
.hljs-emphasis {
  font-style: italic;
}
.hljs-strong {
  font-weight: bold;
}
`;

// Dracula 风格
export const HighlightDracula = `
.hljs {
  background: #282a36;
  color: #f8f8f2;
}
.hljs-comment,
.hljs-quote {
  color: #6272a4;
}
.hljs-variable,
.hljs-template-variable,
.hljs-tag,
.hljs-name {
  color: #ff79c6;
}
.hljs-keyword,
.hljs-symbol,
.hljs-type {
  color: #8be9fd;
}
.hljs-number,
.hljs-literal {
  color: #bd93f9;
}
.hljs-title,
.hljs-section {
  color: #50fa7b;
}
.hljs-doctag,
.hljs-string {
  color: #f1fa8c;
}
.hljs-meta {
  color: #ff79c6;
}
.hljs-deletion {
  background: #6272a4;
}
.hljs-addition {
  background: #44475a;
}
.hljs-emphasis {
  font-style: italic;
}
.hljs-strong {
  font-weight: bold;
}
`;

// One Dark 风格
export const HighlightOneDark = `
.hljs {
  background: #282c34;
  color: #abb2bf;
}
.hljs-comment,
.hljs-quote {
  color: #5c6370;
  font-style: italic;
}
.hljs-keyword,
.hljs-selector-tag {
  color: #c678dd;
}
.hljs-string,
.hljs-doctag {
  color: #98c379;
}
.hljs-number,
.hljs-literal {
  color: #d19a66;
}
.hljs-variable,
.hljs-template-variable {
  color: #e06c75;
}
.hljs-tag .hljs-attr {
  color: #d19a66;
}
.hljs-title,
.hljs-section {
  color: #e06c75;
  font-weight: bold;
}
.hljs-type,
.hljs-class {
  color: #e5c07b;
}
.hljs-tag,
.hljs-name {
  color: #e06c75;
}
.hljs-attribute {
  color: #d19a66;
}
.hljs-meta {
  color: #61afef;
}
.hljs-deletion {
  background: #3e4451;
}
.hljs-addition {
  background: #3e4451;
}
.hljs-emphasis {
  font-style: italic;
}
.hljs-strong {
  font-weight: bold;
}
`;

export const BuiltInHighlights = [
  { name: '默认', css: HighlightXCode },
  { name: 'Monokai', css: HighlightMonokai },
  { name: 'GitHub', css: HighlightGitHub },
  { name: 'Dracula', css: HighlightDracula },
  { name: 'OneDark', css: HighlightOneDark },
];
