"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const b = document.querySelector('b');
const btn = document.getElementById('btn');
const input = document.getElementById('input');
const output = document.getElementById('output');
const download = document.getElementById('download');
const h1 = document.createElement('h1');
const p = document.createElement('p');
const metadata = {
    reddit: 'https://www.reddit.com',
    youtubePrefixShade: 'https://youtu.be/',
    youtubePrefixUrl: 'https://www.youtube.com/',
    type: 'text/markdown',
    length: 100
};
const method = {
    replace: /\/([^\/]*)$/,
    deleteHashTag: ({ text }) => {
        const newText = (text === null || text === void 0 ? void 0 : text.startsWith('#')) ? text === null || text === void 0 ? void 0 : text.slice(2) : text;
        return newText;
    },
};
const customErrors = {
    ifNotExistSubReddit: 'No se encontro el subReddit',
    ifTheURLIsBad: 'Vea si la url la puso bien'
};
const templateMedia = (media, thumbnail) => {
    const oembed = media === null || media === void 0 ? void 0 : media.oembed;
    const author = oembed === null || oembed === void 0 ? void 0 : oembed.author_name;
    const videoUrl = oembed === null || oembed === void 0 ? void 0 : oembed.author_url;
    const videoTitle = oembed === null || oembed === void 0 ? void 0 : oembed.title;
    const template = `
   \`\`\`vid
    ${thumbnail}
  \`\`\`

[${author} - ${videoTitle}](${videoUrl})`;
    const boolean = (media === null || media === void 0 ? void 0 : media.oembed) && thumbnail.startsWith(metadata.youtubePrefixShade) || thumbnail.startsWith(metadata.youtubePrefixUrl);
    if (boolean) {
        return template;
    }
    return '';
};
const templatePhoto = ({ thumbnail, title }) => {
    const template = `
![${title}](${thumbnail})
`;
    if (thumbnail.endsWith('.jpg')) {
        return template;
    }
    return '';
};
const getRedditPost = ({ url }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(url);
        if (!res.ok) {
            output.innerText = customErrors.ifNotExistSubReddit;
            return;
        }
        const json = yield res.json();
        const data = json[0].data.children[0].data;
        const { title, selftext, author, media, subreddit_name_prefixed, url: thumbnail } = data;
        const arriba = `
---
tag: reddit
author: ${author}
subreddit: ${subreddit_name_prefixed}
---

# ${title}

${selftext}

${templateMedia(media, thumbnail)}
${templatePhoto({ thumbnail, title })}

[${subreddit_name_prefixed}](${input.value})`;
        b ? b.innerText = title : null;
        output.appendChild(h1);
        output.innerText = arriba;
    }
    catch (error) {
        output.innerText = customErrors.ifTheURLIsBad;
    }
});
btn.addEventListener('click', () => {
    const values = input.value;
    if (!values.startsWith(metadata.reddit)) {
        output.innerText = `La URL tiene que comenzar con ${metadata.reddit}`;
        return;
    }
    const reg = method.replace;
    const url = values.replace(reg, '.json');
    input.value = '';
    getRedditPost({ url });
});
const downloadReddit = () => {
    var _a;
    const text = output.innerText;
    const textContent = (_a = document.querySelector('b')) === null || _a === void 0 ? void 0 : _a.innerText;
    const newTitle = textContent === null || textContent === void 0 ? void 0 : textContent.slice(0, metadata.length);
    const name = `${newTitle}.md`;
    let file = new Blob([text], { type: metadata.type });
    download.href = URL.createObjectURL(file);
    download.download = name;
};
download.addEventListener('click', downloadReddit);
