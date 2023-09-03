var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var btn = document.getElementById('btn');
var input = document.getElementById('input');
var output = document.getElementById('output');
var download = document.getElementById('download');
var h1 = document.createElement('h1');
var p = document.createElement('p');
h1.id = 'name';
var templateMedia = function (media) {
    var oembed = media === null || media === void 0 ? void 0 : media.oembed;
    var author = oembed === null || oembed === void 0 ? void 0 : oembed.author_name;
    var videoUrl = oembed === null || oembed === void 0 ? void 0 : oembed.author_url;
    var videoTitle = oembed === null || oembed === void 0 ? void 0 : oembed.title;
    var thumbnail = oembed === null || oembed === void 0 ? void 0 : oembed.thumbnail_url;
    var template = "\n![".concat(author, "](").concat(thumbnail, ")\n\n[").concat(author, " - ").concat(videoTitle, "](").concat(videoUrl, ")\n");
    if (media === null || media === void 0 ? void 0 : media.oembed) {
        return template;
    }
    return '';
};
var templatePhoto = function (_a) {
    var thumbnail = _a.thumbnail, title = _a.title;
    var template = "\n![".concat(title, "](").concat(thumbnail, ")\n");
    if (thumbnail && title) {
        return template;
    }
    return '';
};
var metadata = {
    reddit: 'https://www.reddit.com',
    type: 'text/markdown'
};
var method = {
    replace: /\/([^\/]*)$/,
    deleteHashTag: function (_a) {
        var text = _a.text;
        var newText = (text === null || text === void 0 ? void 0 : text.startsWith('#')) ? text === null || text === void 0 ? void 0 : text.slice(2) : text;
        return newText;
    },
};
var getRedditPost = function (_a) {
    var url = _a.url;
    return __awaiter(_this, void 0, void 0, function () {
        var res, json, data, title, selftext, author, media, subreddit_name_prefixed, thumbnail, arriba;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    res = _b.sent();
                    if (!res.ok) {
                        console.log({
                            error: res.status
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, res.json()];
                case 2:
                    json = _b.sent();
                    data = json[0].data.children[0].data;
                    console.log(data);
                    title = data.title, selftext = data.selftext, author = data.author, media = data.media, subreddit_name_prefixed = data.subreddit_name_prefixed, thumbnail = data.url;
                    arriba = "\n---\ntag: reddit\nauthor: ".concat(author, "\nsubreddit: ").concat(subreddit_name_prefixed, "\n---\n\n").concat(templateMedia(media), "\n").concat(templatePhoto({ thumbnail: thumbnail, title: title }), "\n\n[").concat(subreddit_name_prefixed, "](").concat(input.value, ")\n\n");
                    output.innerText = arriba;
                    h1.innerText = "# ".concat(title);
                    p.innerText = selftext;
                    output.appendChild(h1);
                    output.appendChild(p);
                    return [2 /*return*/];
            }
        });
    });
};
btn.addEventListener('click', function () {
    var values = input.value;
    if (!values.startsWith(metadata.reddit)) {
        output.innerText = "La URL tiene que comenzar con ".concat(metadata.reddit);
        return;
    }
    var reg = method.replace;
    var url = values.replace(reg, '.json');
    getRedditPost({ url: url });
});
var downloadReddit = function () {
    var _a;
    var text = output.innerText;
    var textContent = (_a = document.querySelector('h1')) === null || _a === void 0 ? void 0 : _a.outerText;
    var newText = method.deleteHashTag({ text: textContent });
    var name = "".concat(newText, ".md");
    var file = new Blob([text], { type: metadata.type });
    download.href = URL.createObjectURL(file);
    download.download = name;
};
download.addEventListener('click', downloadReddit);
