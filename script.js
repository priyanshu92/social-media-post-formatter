(() => {
    'use strict';

    // =========================================================
    //  OS Detection
    // =========================================================

    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const MOD_KEY = isMac ? '⌘' : 'Ctrl';

    // =========================================================
    //  Unicode Character Maps
    // =========================================================

    function buildCharMap(upperStart, lowerStart, digitStart) {
        const map = {};
        for (let i = 0; i < 26; i++) {
            map[String.fromCharCode(65 + i)] = String.fromCodePoint(upperStart + i);
            map[String.fromCharCode(97 + i)] = String.fromCodePoint(lowerStart + i);
        }
        if (digitStart != null) {
            for (let i = 0; i < 10; i++) {
                map[String.fromCharCode(48 + i)] = String.fromCodePoint(digitStart + i);
            }
        }
        return map;
    }

    const CHAR_MAPS = {
        bold: buildCharMap(0x1D5D4, 0x1D5EE, 0x1D7EC),
        italic: buildCharMap(0x1D608, 0x1D622, null),
        'bold-italic': buildCharMap(0x1D63C, 0x1D656, 0x1D7EC),
        monospace: buildCharMap(0x1D670, 0x1D68A, 0x1D7F6),
        'small-caps': {
            a: '\u1D00', b: '\u0299', c: '\u1D04', d: '\u1D05', e: '\u1D07',
            f: '\uA730', g: '\u0262', h: '\u029C', i: '\u026A', j: '\u1D0A',
            k: '\u1D0B', l: '\u029F', m: '\u1D0D', n: '\u0274', o: '\u1D0F',
            p: '\u1D18', q: '\u01EB', r: '\u0280', s: '\uA731', t: '\u1D1B',
            u: '\u1D1C', v: '\u1D20', w: '\u1D21', x: 'x', y: '\u028F', z: '\u1D22',
        },
        superscript: {
            a: '\u1D43', b: '\u1D47', c: '\u1D9C', d: '\u1D48', e: '\u1D49',
            f: '\u1DA0', g: '\u1D4D', h: '\u02B0', i: '\u2071', j: '\u02B2',
            k: '\u1D4F', l: '\u02E1', m: '\u1D50', n: '\u207F', o: '\u1D52',
            p: '\u1D56', r: '\u02B3', s: '\u02E2', t: '\u1D57', u: '\u1D58',
            v: '\u1D5B', w: '\u02B7', x: '\u02E3', y: '\u02B8', z: '\u1DBB',
            A: '\u1D2C', B: '\u1D2E', D: '\u1D30', E: '\u1D31', G: '\u1D33',
            H: '\u1D34', I: '\u1D35', J: '\u1D36', K: '\u1D37', L: '\u1D38',
            M: '\u1D39', N: '\u1D3A', O: '\u1D3C', P: '\u1D3E', R: '\u1D3F',
            T: '\u1D40', U: '\u1D41', V: '\u2C7D', W: '\u1D42',
            '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3',
            '4': '\u2074', '5': '\u2075', '6': '\u2076', '7': '\u2077',
            '8': '\u2078', '9': '\u2079',
            '+': '\u207A', '-': '\u207B', '=': '\u207C', '(': '\u207D', ')': '\u207E',
        },
    };

    const LEGACY_CHAR_MAPS = {
        bold: buildCharMap(0x1D400, 0x1D41A, 0x1D7CE),
        italic: (() => {
            const m = buildCharMap(0x1D434, 0x1D44E, null);
            m['h'] = '\u210E';
            return m;
        })(),
        'bold-italic': buildCharMap(0x1D468, 0x1D482, null),
    };

    const REVERSE_MAP = {};
    for (const mapSet of [CHAR_MAPS, LEGACY_CHAR_MAPS]) {
        for (const [, map] of Object.entries(mapSet)) {
            for (const [plain, styled] of Object.entries(map)) {
                REVERSE_MAP[styled] = plain;
            }
        }
    }

    // =========================================================
    //  Special Characters Palette
    // =========================================================

    const SPECIAL_CHARS = {
        'Arrows': ['→', '←', '↑', '↓', '↗', '↘', '⟶', '⟵', '➜', '➤', '▸', '▹'],
        'Stars & Shapes': ['★', '☆', '✦', '✧', '◆', '◇', '●', '○', '■', '□', '▲', '△', '♦', '♥'],
        'Checks & Marks': ['✓', '✔', '✗', '✘', '☑', '☐'],
        'Bullets': ['•', '◦', '▪', '▫', '‣', '⁃', '⦿', '⊙'],
        'Dividers': ['━━━━━━━━━', '───────────', '═══════════', '┄┄┄┄┄┄┄┄┄┄┄', '• • • • • • •', '~ ~ ~ ~ ~ ~ ~'],
        'Brackets': ['【', '】', '「', '」', '『', '』', '〈', '〉', '《', '》'],
        'Misc': ['∞', '≈', '≠', '±', '÷', '×', '©', '®', '™', '°', '¶', '§', '…', '⟨', '⟩'],
    };

    // =========================================================
    //  Platform Configuration
    // =========================================================

    const PLATFORMS = {
        linkedin: {
            name: 'LinkedIn',
            maxChars: 3000,
            accent: '#0A66C2',
            previewClass: 'linkedin-preview',
            tips: [
                'Use 𝗯𝗼𝗹𝗱 headings to make long posts scannable.',
                'Keep paragraphs to 1–3 lines for mobile readability.',
                'Bullet points (•) work well for listing achievements or tips.',
                'Unicode formatting is preserved in posts, comments, and articles.',
                'Hashtags at the end increase discoverability without cluttering the text.',
            ],
        },
        instagram: {
            name: 'Instagram',
            maxChars: 2200,
            accent: '#E1306C',
            previewClass: 'instagram-preview',
            tips: [
                'Blank lines auto-preserved with invisible spacers when you copy.',
                'Use bullets and emojis to break up long captions.',
                'Unicode bold/italic works in captions and bios.',
                'Up to 30 hashtags allowed — place them in a comment or after line breaks.',
                'Monospace text can give a unique aesthetic to quotes or code snippets.',
            ],
        },
        twitter: {
            name: 'Twitter / X',
            maxChars: 280,
            accent: '#1DA1F2',
            previewClass: 'twitter-preview',
            tips: [
                'Unicode chars may count as 2 toward the 280 limit — check weighted count.',
                'Bold and italic text grabs attention in a fast-scrolling feed.',
                'Keep formatted text short — use it for emphasis, not entire tweets.',
                'Dividers auto-shorten to fit the character limit.',
                'Premium users get up to 25,000 characters per post.',
            ],
        },
    };

    const STORAGE_KEYS = {
        currentPost: 'postcraft.currentPost',
        drafts: 'postcraft.drafts',
    };
    const DEFAULT_DRAFT_NAME = 'Untitled draft';
    const DRAFT_SNIPPET_LENGTH = 120;

    const INLINE_FORMAT_ACTIONS = new Set([
        'bold',
        'italic',
        'bold-italic',
        'underline',
        'strikethrough',
        'monospace',
        'small-caps',
        'superscript',
    ]);

    const VARIANT_FORMAT_ACTIONS = new Set(['monospace', 'small-caps', 'superscript']);
    const LIST_FORMAT_ACTIONS = new Set(['bullet-list', 'number-list']);

    // =========================================================
    //  Formatting Engine
    // =========================================================

    function stripToPlain(text) {
        let result = '';
        for (const char of text) {
            if (char === '\u0332' || char === '\u0336') continue;
            result += REVERSE_MAP[char] || char;
        }
        return result;
    }

    function applyCharMap(text, mapName) {
        const plain = stripToPlain(text);
        const map = CHAR_MAPS[mapName];
        let result = '';
        for (const char of plain) {
            result += map[char] || char;
        }
        return result;
    }

    function applyCombining(text, combiner) {
        let result = '';
        for (const char of text) {
            if (char === combiner) continue;
            if (char === '\u0332' || char === '\u0336') {
                result += char;
                continue;
            }
            result += char;
            if (char.trim() && char !== '\n') {
                result += combiner;
            }
        }
        return result;
    }

    function removeCombining(text, combiner) {
        let result = '';
        for (const char of text) {
            if (char === combiner) continue;
            result += char;
        }
        return result;
    }

    function hasCombining(text, combiner) {
        return text.includes(combiner);
    }

    function applyBulletList(text) {
        return text.split('\n').map(line => {
            const trimmed = line.replace(/^[\s]*[•◦▪▸‣⁃⦿⊙]\s*/, '').replace(/^\d+\.\s*/, '');
            return trimmed ? `• ${trimmed}` : line;
        }).join('\n');
    }

    function applyNumberedList(text) {
        let num = 1;
        return text.split('\n').map(line => {
            const trimmed = line.replace(/^[\s]*[•◦▪▸‣⁃⦿⊙]\s*/, '').replace(/^\d+\.\s*/, '');
            if (trimmed) return `${num++}. ${trimmed}`;
            return line;
        }).join('\n');
    }

    function getLineStart(text, pos) {
        return text.lastIndexOf('\n', pos - 1) + 1;
    }

    function getNumberedMarkerForLine(line) {
        const match = line.match(/^\s*(\d+)\.\s/);
        if (!match) return null;
        return Number(match[1]);
    }

    function normalizeLinkHref(rawHref) {
        const trimmed = rawHref.trim();
        if (!trimmed) return null;

        const href = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
        try {
            const url = new URL(href);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
            return url.href;
        } catch {
            return null;
        }
    }

    function looksLikeLink(text) {
        return Boolean(normalizeLinkHref(text));
    }

    function linkedPlainText(label, href) {
        const cleanLabel = label.trim();
        const plainLabel = stripToPlain(cleanLabel);
        return !plainLabel || plainLabel === href ? href : `${cleanLabel} (${href})`;
    }

    function serializeEditableNode(node, exportLinks = false) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.nodeValue || '';
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return '';

        const element = node;
        const tag = element.tagName.toLowerCase();
        if (tag === 'br') return '\n';
        if (tag === 'a') {
            const label = [...element.childNodes].map(child => serializeEditableNode(child, false)).join('');
            if (!exportLinks) return label;

            const href = normalizeLinkHref(element.getAttribute('href') || element.dataset.href || '');
            return href ? linkedPlainText(label, href) : label;
        }

        const text = [...element.childNodes].map(child => serializeEditableNode(child, exportLinks)).join('');
        return tag === 'div' || tag === 'p' ? `${text}\n` : text;
    }

    function serializeEditableContent(root, exportLinks = false) {
        return [...root.childNodes]
            .map(node => serializeEditableNode(node, exportLinks))
            .join('')
            .replace(/\n$/, '');
    }

    const INDENT_TEXT = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
    const HORIZONTAL_RULE_TEXT = '────────';
    const BLOCK_ELEMENTS = new Set([
        'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset',
        'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4',
        'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'pre',
        'section', 'table', 'ul',
    ]);

    function formatRichText(text, formats) {
        let result = text;
        if (formats.variant) {
            result = applyCharMap(result, formats.variant);
        } else if (formats.bold && formats.italic) {
            result = applyCharMap(result, 'bold-italic');
        } else if (formats.bold) {
            result = applyCharMap(result, 'bold');
        } else if (formats.italic) {
            result = applyCharMap(result, 'italic');
        }

        if (formats.underline) result = applyCombining(result, '\u0332');
        if (formats.strikethrough) result = applyCombining(result, '\u0336');
        return result;
    }

    function formatsForElement(element, formats) {
        const tag = element.tagName.toLowerCase();
        const next = { ...formats };
        const style = element.getAttribute('style') || '';
        const weightMatch = style.match(/font-weight\s*:\s*([^;]+)/i);
        const textDecoration = style.match(/text-decoration(?:-line)?\s*:\s*([^;]+)/i)?.[1] || '';

        if (tag === 'strong' || tag === 'b' || /^h[1-6]$/.test(tag)) next.bold = true;
        if (tag === 'em' || tag === 'i') next.italic = true;
        if (tag === 'u' || /underline/i.test(textDecoration)) next.underline = true;
        if (tag === 's' || tag === 'strike' || tag === 'del' || /line-through/i.test(textDecoration)) next.strikethrough = true;
        if (tag === 'code' || tag === 'pre' || /monospace/i.test(style)) next.variant = 'monospace';

        if (weightMatch) {
            const weight = weightMatch[1].trim().toLowerCase();
            if (weight === 'bold' || Number.parseInt(weight, 10) >= 600) next.bold = true;
        }
        if (/font-style\s*:\s*italic/i.test(style)) next.italic = true;

        return next;
    }

    function normalizeHtmlText(text) {
        return text.replace(/[ \t\r\n\f]+/g, ' ');
    }

    function cleanBlockText(text) {
        return text
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n[ \t]+/g, '\n')
            .replace(/^[ \t\r\n\f\v]+|[ \t\r\n\f\v]+$/g, '');
    }

    function hasBlockChild(element) {
        return [...element.children].some(child => BLOCK_ELEMENTS.has(child.tagName.toLowerCase()));
    }

    function renderRichInlineChildren(element, formats) {
        return [...element.childNodes].map(node => renderRichInlineNode(node, formats)).join('');
    }

    function renderRichInlineNode(node, formats) {
        if (node.nodeType === Node.TEXT_NODE) {
            return formatRichText(normalizeHtmlText(node.nodeValue || ''), formats);
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return '';

        const element = node;
        const tag = element.tagName.toLowerCase();
        if (tag === 'br') return '\n';
        if (tag === 'img') return element.getAttribute('alt') || '';

        if (BLOCK_ELEMENTS.has(tag)) {
            return renderRichBlock(element, formats);
        }

        const nextFormats = formatsForElement(element, formats);
        let text = renderRichInlineChildren(element, nextFormats);

        if (tag === 'a') {
            const href = (element.getAttribute('href') || '').trim();
            const plainText = stripToPlain(text).trim();
            if (href && plainText && plainText !== href) {
                text += ` (${href})`;
            }
        }

        return text;
    }

    function renderRichBlocksFromChildren(element, formats) {
        const blocks = [];
        let inlineBuffer = '';

        for (const node of element.childNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && BLOCK_ELEMENTS.has(node.tagName.toLowerCase())) {
                const inlineText = cleanBlockText(inlineBuffer);
                if (inlineText) blocks.push(inlineText);
                inlineBuffer = '';

                const blockText = cleanBlockText(renderRichBlock(node, formats));
                if (blockText) blocks.push(blockText);
            } else {
                inlineBuffer += renderRichInlineNode(node, formats);
            }
        }

        const inlineText = cleanBlockText(inlineBuffer);
        if (inlineText) blocks.push(inlineText);
        return blocks;
    }

    function renderRichBlock(element, formats) {
        const tag = element.tagName.toLowerCase();
        const nextFormats = formatsForElement(element, formats);

        if (tag === 'hr') return HORIZONTAL_RULE_TEXT;
        if (tag === 'br') return '\n';
        if (tag === 'ul' || tag === 'ol') return renderRichList(element, nextFormats, 0);
        if (tag === 'li') return renderRichListItemLines(element, nextFormats, 0).join('\n');
        if (tag === 'blockquote') {
            return renderRichBlocksFromChildren(element, nextFormats)
                .join('\n\n')
                .split('\n')
                .map(line => (line.trim() ? `${INDENT_TEXT}${line}` : ''))
                .join('\n');
        }
        if (tag === 'pre') {
            return formatRichText(element.textContent || '', { ...nextFormats, variant: 'monospace' }).trimEnd();
        }

        if (hasBlockChild(element)) {
            return renderRichBlocksFromChildren(element, nextFormats).join('\n\n');
        }

        return cleanBlockText(renderRichInlineChildren(element, nextFormats));
    }

    function renderRichList(listElement, formats, depth) {
        const ordered = listElement.tagName.toLowerCase() === 'ol';
        let index = Number.parseInt(listElement.getAttribute('start') || '1', 10);
        if (!Number.isFinite(index)) index = 1;

        const lines = [];
        for (const child of listElement.children) {
            if (child.tagName.toLowerCase() !== 'li') continue;

            const itemLines = renderRichListItemLines(child, formats, depth);
            const firstLine = itemLines.shift() || '';
            const indent = INDENT_TEXT.repeat(depth);
            const marker = ordered ? `${index}. ` : '• ';
            lines.push(`${indent}${marker}${firstLine}`.trimEnd());
            lines.push(...itemLines);
            index += 1;
        }
        return lines.join('\n');
    }

    function renderRichListItemLines(itemElement, formats, depth) {
        const lines = [];
        let inlineBuffer = '';

        for (const node of itemElement.childNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
                if (tag === 'ul' || tag === 'ol') {
                    const inlineText = cleanBlockText(inlineBuffer);
                    if (inlineText) lines.push(inlineText);
                    inlineBuffer = '';
                    lines.push(...renderRichList(node, formats, depth + 1).split('\n').filter(Boolean));
                    continue;
                }
                if (BLOCK_ELEMENTS.has(tag)) {
                    const inlineText = cleanBlockText(inlineBuffer);
                    if (inlineText) lines.push(inlineText);
                    inlineBuffer = '';
                    const blockText = cleanBlockText(renderRichBlock(node, formats));
                    if (blockText) lines.push(...blockText.split('\n'));
                    continue;
                }
            }

            inlineBuffer += renderRichInlineNode(node, formats);
        }

        const inlineText = cleanBlockText(inlineBuffer);
        if (inlineText) lines.push(inlineText);
        return lines.length ? lines : [''];
    }

    function richHtmlToFormattedText(html) {
        if (!html || !/<[a-z][\s\S]*>/i.test(html)) return '';

        const parsed = new DOMParser().parseFromString(html, 'text/html');
        parsed.body.querySelectorAll('script, style, noscript, meta, link, svg').forEach(node => node.remove());

        return renderRichBlocksFromChildren(parsed.body, {
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
            variant: null,
        })
            .join('\n\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    // =========================================================
    //  Platform-Specific Processing
    // =========================================================

    // Twitter: weighted character count (BMP = 1, non-BMP = 2)
    function twitterWeightedLength(text) {
        let count = 0;
        for (const char of text) {
            count += char.codePointAt(0) > 0xFFFF ? 2 : 1;
        }
        return count;
    }

    // Twitter: shorten long dividers to save characters
    function twitterShortenDivider(divider) {
        const char = [...divider.trim()][0];
        if (!char) return divider;
        const isSpaced = divider.includes(' ');
        if (isSpaced) return Array(5).fill(char).join(' ');
        return char.repeat(8);
    }

    // Instagram: insert zero-width space on blank lines to preserve line breaks
    function instagramPreserveLineBreaks(text) {
        return text.split('\n').map(line => {
            return line.trim() === '' ? '\u200B' : line;
        }).join('\n');
    }

    // LinkedIn: ensure hashtags at the end have a blank line separator
    function linkedinFormatHashtags(text) {
        const hashtagLine = /^(#\w+[\s]*)+$/;
        const lines = text.split('\n');
        const result = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (hashtagLine.test(line.trim()) && i > 0 && lines[i - 1].trim() !== '') {
                result.push('');
            }
            result.push(line);
        }
        return result.join('\n');
    }

    // Apply platform-specific post-processing for copy
    function platformProcess(text, platform) {
        switch (platform) {
            case 'instagram':
                return instagramPreserveLineBreaks(text);
            case 'linkedin':
                return linkedinFormatHashtags(text);
            default:
                return text;
        }
    }

    // Generate platform-specific warnings
    function platformWarnings(text, platform) {
        const warnings = [];
        const codePoints = [...text];
        const len = codePoints.length;

        if (platform === 'twitter') {
            const weighted = twitterWeightedLength(text);
            if (weighted !== len && weighted > 0) {
                warnings.push(`Weighted count is ${weighted} (Unicode chars counted as 2). Twitter uses weighted length.`);
            }
            if (weighted > 280) {
                warnings.push(`Over the 280 character limit by ${weighted - 280} characters.`);
            }
            const longDividers = text.match(/[━─═┄]{10,}|([•~] ){6,}/g);
            if (longDividers) {
                warnings.push('Long dividers waste characters. Consider shorter ones.');
            }
        }

        if (platform === 'instagram') {
            const emptyLines = text.split('\n').filter(l => l.trim() === '').length;
            if (emptyLines > 0) {
                warnings.push(`${emptyLines} blank line(s) detected. They'll be preserved with invisible spacers on copy.`);
            }
            const hashtags = (text.match(/#\w+/g) || []).length;
            if (hashtags > 30) {
                warnings.push(`${hashtags} hashtags detected. Instagram allows max 30.`);
            }
        }

        if (platform === 'linkedin') {
            if (len > 210 && !text.includes('\n')) {
                warnings.push('Long single paragraph. Add line breaks for mobile readability.');
            }
        }

        return warnings;
    }

    // =========================================================
    //  Browser Storage Helpers
    // =========================================================

    function createDraftId() {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return window.crypto.randomUUID();
        }
        return `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    function formatDraftTimestamp(timestamp) {
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) return 'Unknown time';
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    }

    function sanitizeEditorHtml(html) {
        const template = document.createElement('template');
        template.innerHTML = html || '';

        const fragment = document.createDocumentFragment();
        const appendCleanNode = (node, parent) => {
            if (node.nodeType === Node.TEXT_NODE) {
                parent.appendChild(document.createTextNode(node.nodeValue || ''));
                return;
            }

            if (node.nodeType !== Node.ELEMENT_NODE) return;

            const element = node;
            const tag = element.tagName.toLowerCase();
            if (tag === 'br') {
                parent.appendChild(document.createElement('br'));
                return;
            }

            if (tag === 'a') {
                const href = normalizeLinkHref(element.getAttribute('href') || element.dataset.href || '');
                if (!href) {
                    parent.appendChild(document.createTextNode(element.textContent || ''));
                    return;
                }

                const link = document.createElement('a');
                link.href = href;
                link.dataset.href = href;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                for (const child of element.childNodes) appendCleanNode(child, link);
                parent.appendChild(link);
                return;
            }

            for (const child of element.childNodes) appendCleanNode(child, parent);
        };

        for (const child of template.content.childNodes) appendCleanNode(child, fragment);

        const wrapper = document.createElement('div');
        wrapper.appendChild(fragment);
        return wrapper.innerHTML;
    }

    function draftPreviewText(draft) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = sanitizeEditorHtml(draft.html);
        const text = serializeEditableContent(wrapper, true).replace(/\s+/g, ' ').trim();
        if (!text) return 'Empty draft';
        return text.length > DRAFT_SNIPPET_LENGTH
            ? `${text.slice(0, DRAFT_SNIPPET_LENGTH - 1)}…`
            : text;
    }

    // =========================================================
    //  App Controller
    // =========================================================

    const app = {
        currentPlatform: 'linkedin',
        currentPreviewMode: 'desktop',
        activeFormats: {
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
            variant: null,
            list: null,
        },
        editor: null,
        toastTimer: null,
        undoStack: [],
        redoStack: [],
        maxUndo: 50,
        drafts: [],
        storageErrorShown: false,

        init() {
            this.editor = document.getElementById('editor');
            this.loadCurrentPost();
            this.loadDrafts();
            this.bindToolbar();
            this.bindPlatformTabs();
            this.bindPreviewModeControls();
            this.bindStatusBar();
            this.bindDraftControls();
            this.bindKeyboardShortcuts();
            this.bindLinkClicks();
            this.buildSpecialCharsPanel();
            this.buildTooltips();
            this.syncActiveToolButtons();
            this.updatePlatform(this.currentPlatform);
            this.updateCharCount();
            this.updatePreview();
            this.renderDrafts();
        },

        // ---- Event Binding ----

        bindToolbar() {
            document.querySelector('.toolbar').addEventListener('click', (e) => {
                const btn = e.target.closest('.tool-btn');
                if (!btn) return;
                const action = btn.dataset.action;
                if (action) this.handleFormat(action);
            });
        },

        bindPlatformTabs() {
            document.querySelector('.platform-tabs').addEventListener('click', (e) => {
                const tab = e.target.closest('.tab');
                if (!tab) return;
                this.updatePlatform(tab.dataset.platform);
            });
        },

        bindPreviewModeControls() {
            document.querySelector('.preview-mode-toggle').addEventListener('click', (e) => {
                const btn = e.target.closest('.preview-mode-btn');
                if (!btn) return;
                this.updatePreviewMode(btn.dataset.previewMode);
            });
        },

        bindLinkClicks() {
            const openLink = (e) => {
                const link = e.target.closest('a[href]');
                if (!link) return;

                e.preventDefault();
                const href = normalizeLinkHref(link.getAttribute('href') || link.dataset.href || '');
                if (!href) return;

                const newWindow = window.open(href, '_blank', 'noopener,noreferrer');
                if (newWindow) {
                    newWindow.opener = null;
                }
            };

            this.editor.addEventListener('click', openLink);
            document.getElementById('previewContent').addEventListener('click', openLink);
        },

        bindStatusBar() {
            this.editor.addEventListener('beforeinput', (e) => this.handleActiveFormattingInput(e));
            this.editor.addEventListener('paste', (e) => this.handlePaste(e));
            this.editor.addEventListener('input', () => {
                if (this.redoStack.length > 0) {
                    this.redoStack = [];
                    this.updateHistoryBtns();
                }
                this.updateCharCount();
                this.updatePreview();
            });
            document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
            document.getElementById('clearBtn').addEventListener('click', () => {
                this.pushUndo();
                this.setEditorPlainText('');
                this.updateCharCount();
                this.updatePreview();
                this.editor.focus();
                this.showToast('Cleared');
            });
        },

        bindDraftControls() {
            const draftName = document.getElementById('draftName');
            document.getElementById('saveDraftBtn').addEventListener('click', () => this.saveDraft());
            draftName.addEventListener('keydown', (e) => {
                if (e.key !== 'Enter') return;
                e.preventDefault();
                this.saveDraft();
            });

            document.getElementById('draftsList').addEventListener('click', (e) => {
                const btn = e.target.closest('[data-draft-action]');
                if (!btn) return;

                const { draftId, draftAction } = btn.dataset;
                if (draftAction === 'open') {
                    this.openDraft(draftId);
                    return;
                }
                if (draftAction === 'delete') {
                    this.deleteDraft(draftId);
                }
            });
        },

        bindKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                const mod = e.ctrlKey || e.metaKey;
                if (!mod) return;

                if (e.shiftKey) {
                    const shiftShortcuts = {
                        's': 'strikethrough',
                        'x': 'clear',
                        'm': 'monospace',
                        'c': '_copy',
                        'l': 'bullet-list',
                        'o': 'number-list',
                        'p': 'superscript',
                        'd': 'divider',
                        'z': '_redo',
                    };
                    if (e.key === '8' || e.key === '*') {
                        e.preventDefault();
                        this.handleFormat('bullet-list');
                        return;
                    }
                    if (e.key === '7' || e.key === '&') {
                        e.preventDefault();
                        this.handleFormat('number-list');
                        return;
                    }
                    const action = shiftShortcuts[e.key.toLowerCase()];
                    if (action === '_copy') {
                        e.preventDefault();
                        this.copyToClipboard();
                        return;
                    }
                    if (action === '_redo') {
                        e.preventDefault();
                        this.handleFormat('redo');
                        return;
                    }
                    if (action) {
                        e.preventDefault();
                        this.handleFormat(action);
                        return;
                    }
                }

                const shortcuts = { 'b': 'bold', 'i': 'italic', 'u': 'underline', 'k': 'link' };
                const action = shortcuts[e.key.toLowerCase()];
                // Let browser handle native Ctrl+Z when our undo stack is empty
                if (e.key.toLowerCase() === 'z') {
                    if (this.undoStack.length > 0) {
                        e.preventDefault();
                        this.handleFormat('undo');
                    }
                    return;
                }
                if (e.key.toLowerCase() === 'y') {
                    e.preventDefault();
                    this.handleFormat('redo');
                    return;
                }
                if (action) {
                    e.preventDefault();
                    this.handleFormat(action);
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === '?' && document.activeElement !== this.editor) {
                    this.toggleShortcutHelp();
                }
            });
        },

        // ---- Draft Storage ----

        readStorage(key, fallback) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : fallback;
            } catch (error) {
                console.warn(`Unable to read ${key} from localStorage`, error);
                return fallback;
            }
        },

        writeStorage(key, value, notifyOnError = false) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn(`Unable to write ${key} to localStorage`, error);
                if (notifyOnError && !this.storageErrorShown) {
                    this.storageErrorShown = true;
                    this.showToast('Could not save in this browser');
                }
                return false;
            }
        },

        loadCurrentPost() {
            const saved = this.readStorage(STORAGE_KEYS.currentPost, null);
            if (!saved || typeof saved !== 'object') return;

            if (typeof saved.platform === 'string' && PLATFORMS[saved.platform]) {
                this.currentPlatform = saved.platform;
            }
            if (typeof saved.html === 'string') {
                this.editor.innerHTML = sanitizeEditorHtml(saved.html);
            } else if (typeof saved.text === 'string') {
                this.setEditorPlainText(saved.text);
            }
        },

        saveCurrentPost() {
            if (!this.editor) return;
            this.writeStorage(STORAGE_KEYS.currentPost, {
                html: this.editor.innerHTML,
                platform: this.currentPlatform,
                updatedAt: new Date().toISOString(),
            }, true);
        },

        loadDrafts() {
            const storedDrafts = this.readStorage(STORAGE_KEYS.drafts, []);
            this.drafts = Array.isArray(storedDrafts)
                ? storedDrafts.filter(draft => {
                    return draft
                        && typeof draft.id === 'string'
                        && typeof draft.name === 'string'
                        && typeof draft.createdAt === 'string'
                        && typeof draft.html === 'string';
                })
                : [];
        },

        persistDrafts() {
            return this.writeStorage(STORAGE_KEYS.drafts, this.drafts, true);
        },

        saveDraft() {
            const text = this.getEditorExportText().trim();
            if (!text) {
                this.showToast('Nothing to save');
                return;
            }

            const nameInput = document.getElementById('draftName');
            const createdAt = new Date().toISOString();
            const draft = {
                id: createDraftId(),
                name: nameInput.value.trim() || DEFAULT_DRAFT_NAME,
                createdAt,
                html: this.editor.innerHTML,
                platform: this.currentPlatform,
            };

            this.drafts = [draft, ...this.drafts];
            if (!this.persistDrafts()) return;

            nameInput.value = '';
            this.renderDrafts();
            this.showToast('Draft saved');
        },

        openDraft(draftId) {
            const draft = this.drafts.find(item => item.id === draftId);
            if (!draft) {
                this.showToast('Draft not found');
                return;
            }

            this.pushUndo();
            this.clearActiveFormatting();
            this.editor.innerHTML = sanitizeEditorHtml(draft.html);
            if (PLATFORMS[draft.platform]) {
                this.updatePlatform(draft.platform);
            } else {
                this.updateCharCount();
                this.updatePreview();
            }
            const end = this.getEditorDisplayText().length;
            this.setSelectionOffsets(end);
            this.showToast('Draft opened');
        },

        deleteDraft(draftId) {
            const draft = this.drafts.find(item => item.id === draftId);
            if (!draft) {
                this.showToast('Draft not found');
                return;
            }
            if (!window.confirm(`Delete "${draft.name}"?`)) return;

            this.drafts = this.drafts.filter(item => item.id !== draftId);
            if (!this.persistDrafts()) return;

            this.renderDrafts();
            this.showToast('Draft deleted');
        },

        renderDrafts() {
            const list = document.getElementById('draftsList');
            list.textContent = '';

            if (this.drafts.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'draft-empty';
                empty.textContent = 'No drafts yet. Name your post and save it here.';
                list.appendChild(empty);
                return;
            }

            for (const draft of this.drafts) {
                const card = document.createElement('article');
                card.className = 'draft-card';

                const body = document.createElement('div');
                body.className = 'draft-body';

                const titleRow = document.createElement('div');
                titleRow.className = 'draft-title-row';

                const title = document.createElement('h3');
                title.className = 'draft-title';
                title.textContent = draft.name;

                const platform = document.createElement('span');
                platform.className = 'draft-platform';
                platform.textContent = PLATFORMS[draft.platform]?.name || 'Post';

                titleRow.append(title, platform);

                const time = document.createElement('time');
                time.className = 'draft-time';
                time.dateTime = draft.createdAt;
                time.textContent = formatDraftTimestamp(draft.createdAt);

                const snippet = document.createElement('p');
                snippet.className = 'draft-snippet';
                snippet.textContent = draftPreviewText(draft);

                body.append(titleRow, time, snippet);

                const actions = document.createElement('div');
                actions.className = 'draft-actions';

                const openBtn = document.createElement('button');
                openBtn.className = 'draft-action-btn';
                openBtn.type = 'button';
                openBtn.dataset.draftAction = 'open';
                openBtn.dataset.draftId = draft.id;
                openBtn.textContent = 'Open';

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'draft-action-btn draft-action-btn-danger';
                deleteBtn.type = 'button';
                deleteBtn.dataset.draftAction = 'delete';
                deleteBtn.dataset.draftId = draft.id;
                deleteBtn.textContent = 'Delete';

                actions.append(openBtn, deleteBtn);
                card.append(body, actions);
                list.appendChild(card);
            }
        },

        // ---- Platform Switching ----

        updatePlatform(platform) {
            this.currentPlatform = platform;
            const config = PLATFORMS[platform];

            document.querySelectorAll('.tab').forEach(t => {
                const active = t.dataset.platform === platform;
                t.classList.toggle('active', active);
                t.setAttribute('aria-selected', active);
            });

            document.documentElement.style.setProperty('--platform-accent', config.accent);

            document.getElementById('charLimit').textContent = config.maxChars.toLocaleString();
            document.getElementById('tipsPlatform').textContent = config.name;
            document.getElementById('previewBadge').textContent = config.name;

            document.getElementById('tipsList').innerHTML = config.tips.map(tip => `<li>${tip}</li>`).join('');
            this.syncPreviewBodyClass();

            // Toggle twitter weighted counter
            const twitterCount = document.getElementById('twitterWeightedCount');
            twitterCount.hidden = platform !== 'twitter';

            this.updateCharCount();
            this.updatePreview();
        },

        updatePreviewMode(mode) {
            if (!['desktop', 'mobile'].includes(mode)) return;

            this.currentPreviewMode = mode;
            document.querySelectorAll('.preview-mode-btn').forEach(btn => {
                const isActive = btn.dataset.previewMode === mode;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', String(isActive));
            });
            this.syncPreviewBodyClass();
        },

        syncPreviewBodyClass() {
            const config = PLATFORMS[this.currentPlatform];
            const previewBody = document.getElementById('previewBody');
            previewBody.className = `preview-body ${config.previewClass} preview-mode-${this.currentPreviewMode}`;
        },

        // ---- Formatting Actions ----

        handleFormat(action) {
            if (action === 'toggle-chars') { this.toggleSpecialChars(); return; }
            if (action === 'shortcut-help') { this.toggleShortcutHelp(); return; }
            if (action === 'undo') { this.undo(); return; }
            if (action === 'redo') { this.redo(); return; }

            if (action === 'divider') {
                this.pushUndo();
                let divider = '━━━━━━━━━━━━━━━';
                if (this.currentPlatform === 'twitter') {
                    divider = twitterShortenDivider(divider);
                }
                this.insertAtCursor('\n' + divider + '\n');
                this.updatePreview();
                return;
            }

            const { start, end, selected } = this.getSelection();

            if (action === 'link') {
                this.addLink(start, end, selected);
                return;
            }

            if (action === 'clear') {
                this.pushUndo();
                this.clearActiveFormatting();
                if (!selected) {
                    this.setEditorPlainText(stripToPlain(this.getEditorDisplayText()));
                    this.updateCharCount();
                    this.updatePreview();
                    this.showToast('Formatting cleared');
                    return;
                }
                this.replaceSelection(start, end, stripToPlain(selected));
                this.showToast('Formatting cleared');
                this.updatePreview();
                return;
            }

            if (!selected && (INLINE_FORMAT_ACTIONS.has(action) || LIST_FORMAT_ACTIONS.has(action))) {
                this.toggleActiveFormat(action);
                return;
            }

            if (!selected) {
                this.showToast('Select some text first');
                return;
            }

            this.pushUndo();
            let result;
            switch (action) {
                case 'bold':
                case 'italic':
                case 'bold-italic':
                case 'monospace':
                case 'small-caps':
                case 'superscript':
                    result = applyCharMap(selected, action);
                    break;
                case 'underline':
                    result = hasCombining(selected, '\u0332')
                        ? removeCombining(selected, '\u0332')
                        : applyCombining(selected, '\u0332');
                    break;
                case 'strikethrough':
                    result = hasCombining(selected, '\u0336')
                        ? removeCombining(selected, '\u0336')
                        : applyCombining(selected, '\u0336');
                    break;
                case 'bullet-list':
                    result = applyBulletList(selected);
                    break;
                case 'number-list':
                    result = applyNumberedList(selected);
                    break;
                default:
                    return;
            }

            this.replaceSelection(start, end, result);
            this.updatePreview();
        },

        addLink(start, end, selected) {
            const selectedPlainText = stripToPlain(selected).trim();
            const defaultHref = looksLikeLink(selectedPlainText) ? selectedPlainText : 'https://';
            const rawHref = window.prompt('Paste the URL for this link.', defaultHref);
            if (rawHref === null) return;

            const href = normalizeLinkHref(rawHref);
            if (!href) {
                this.showToast('Enter a valid http or https URL');
                return;
            }

            this.pushUndo();
            const link = document.createElement('a');
            link.href = href;
            link.dataset.href = href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = selected.trim() || href;
            this.replaceSelectionWithNode(start, end, link);
            this.updateCharCount();
            this.updatePreview();
            this.showToast('Link added');
        },

        toggleActiveFormat(action) {
            if (action === 'bold-italic') {
                const shouldEnable = !(this.activeFormats.bold && this.activeFormats.italic);
                this.activeFormats.bold = shouldEnable;
                this.activeFormats.italic = shouldEnable;
                if (shouldEnable) this.activeFormats.variant = null;
            } else if (action === 'bold' || action === 'italic') {
                this.activeFormats[action] = !this.activeFormats[action];
                if (this.activeFormats[action]) this.activeFormats.variant = null;
            } else if (VARIANT_FORMAT_ACTIONS.has(action)) {
                this.activeFormats.variant = this.activeFormats.variant === action ? null : action;
                if (this.activeFormats.variant) {
                    this.activeFormats.bold = false;
                    this.activeFormats.italic = false;
                }
            } else if (action === 'underline' || action === 'strikethrough') {
                this.activeFormats[action] = !this.activeFormats[action];
            } else if (LIST_FORMAT_ACTIONS.has(action)) {
                this.toggleListFormat(action);
                return;
            }

            this.syncActiveToolButtons();
            this.editor.focus();
        },

        toggleListFormat(action) {
            const isActive = this.activeFormats.list === action;
            this.activeFormats.list = isActive ? null : action;

            if (!isActive) {
                this.pushUndo();
                this.ensureCurrentLineHasListMarker(action);
                this.updatePreview();
            }

            this.syncActiveToolButtons();
            this.editor.focus();
        },

        ensureCurrentLineHasListMarker(action) {
            const { start, end } = this.getSelectionOffsets();
            const value = this.getEditorDisplayText();
            const lineStart = getLineStart(value, start);
            const linePrefix = value.substring(lineStart, start);

            if (/^\s*(?:[•◦▪▸‣⁃⦿⊙]|\d+\.)\s/.test(linePrefix)) return;

            const marker = action === 'bullet-list'
                ? '• '
                : `${this.getNextNumberForCurrentLine(lineStart)}. `;
            this.replaceSelection(lineStart, lineStart, marker);
            this.setSelectionOffsets(start + marker.length, end + marker.length);
            this.updateCharCount();
        },

        getNextNumberForCurrentLine(lineStart) {
            const before = this.getEditorDisplayText().substring(0, Math.max(0, lineStart - 1)).split('\n').reverse();
            for (const line of before) {
                const number = getNumberedMarkerForLine(line);
                if (number != null) return number + 1;
            }
            return 1;
        },

        clearActiveFormatting() {
            this.activeFormats = {
                bold: false,
                italic: false,
                underline: false,
                strikethrough: false,
                variant: null,
                list: null,
            };
            this.syncActiveToolButtons();
        },

        syncActiveToolButtons() {
            document.querySelectorAll('.tool-btn[data-action]').forEach(btn => {
                const action = btn.dataset.action;
                const isActive = this.isFormatActive(action);
                if (INLINE_FORMAT_ACTIONS.has(action) || LIST_FORMAT_ACTIONS.has(action)) {
                    btn.classList.toggle('active', isActive);
                    btn.setAttribute('aria-pressed', String(isActive));
                }
            });
        },

        isFormatActive(action) {
            switch (action) {
                case 'bold':
                    return this.activeFormats.bold;
                case 'italic':
                    return this.activeFormats.italic;
                case 'bold-italic':
                    return this.activeFormats.bold && this.activeFormats.italic;
                case 'underline':
                case 'strikethrough':
                    return this.activeFormats[action];
                case 'monospace':
                case 'small-caps':
                case 'superscript':
                    return this.activeFormats.variant === action;
                case 'bullet-list':
                case 'number-list':
                    return this.activeFormats.list === action;
                default:
                    return false;
            }
        },

        hasActiveTextFormatting() {
            return this.activeFormats.bold
                || this.activeFormats.italic
                || this.activeFormats.underline
                || this.activeFormats.strikethrough
                || this.activeFormats.variant;
        },

        formatActiveText(text) {
            let result = text;
            const { bold, italic, underline, strikethrough, variant } = this.activeFormats;
            if (variant) {
                result = applyCharMap(result, variant);
            } else if (bold && italic) {
                result = applyCharMap(result, 'bold-italic');
            } else if (bold) {
                result = applyCharMap(result, 'bold');
            } else if (italic) {
                result = applyCharMap(result, 'italic');
            }

            if (underline) result = applyCombining(result, '\u0332');
            if (strikethrough) result = applyCombining(result, '\u0336');
            return result;
        },

        handleActiveFormattingInput(e) {
            if (e.isComposing) return;

            if (e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph') {
                e.preventDefault();
                if (this.activeFormats.list) {
                    this.handleActiveListBreak();
                } else {
                    this.pushUndo();
                    this.insertAtCursor('\n');
                    this.updatePreview();
                }
                return;
            }

            if (e.inputType !== 'insertText' || !e.data || !this.hasActiveTextFormatting()) return;

            e.preventDefault();
            this.pushUndo();
            this.insertAtCursor(this.formatActiveText(e.data));
            this.updatePreview();
        },

        handlePaste(e) {
            const clipboard = e.clipboardData;
            if (!clipboard) return;

            const richText = richHtmlToFormattedText(clipboard.getData('text/html'));
            if (richText) {
                e.preventDefault();
                this.pushUndo();
                this.insertAtCursor(richText);
                this.updatePreview();
                return;
            }

            const plainText = clipboard.getData('text/plain');
            if (plainText && this.hasActiveTextFormatting()) {
                e.preventDefault();
                this.pushUndo();
                this.insertAtCursor(this.formatActiveText(plainText));
                this.updatePreview();
            }
        },

        handleActiveListBreak() {
            this.pushUndo();
            const { start, end } = this.getSelectionOffsets();
            const value = this.getEditorDisplayText();
            const lineStart = getLineStart(value, start);
            const currentLinePrefix = value.substring(lineStart, start);
            const emptyMarkerPattern = /^\s*(?:[•◦▪▸‣⁃⦿⊙]|\d+\.)\s*$/;

            if (emptyMarkerPattern.test(currentLinePrefix)) {
                this.replaceSelection(lineStart, end, '');
                this.setSelectionOffsets(lineStart);
                this.activeFormats.list = null;
                this.syncActiveToolButtons();
                this.updateCharCount();
                this.updatePreview();
                return;
            }

            const marker = this.activeFormats.list === 'bullet-list'
                ? '• '
                : `${(getNumberedMarkerForLine(currentLinePrefix) || 0) + 1}. `;
            this.insertAtCursor('\n' + marker);
            this.updatePreview();
        },

        // ---- Selection Helpers ----

        getEditorDisplayText() {
            return serializeEditableContent(this.editor, false);
        },

        getEditorExportText() {
            return serializeEditableContent(this.editor, true);
        },

        setEditorPlainText(text) {
            this.editor.textContent = text;
        },

        getSelectionOffsets() {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) {
                return { start: 0, end: 0 };
            }

            const range = selection.getRangeAt(0);
            if (!this.editor.contains(range.startContainer) || !this.editor.contains(range.endContainer)) {
                const length = this.getEditorDisplayText().length;
                return { start: length, end: length };
            }

            const beforeStart = document.createRange();
            beforeStart.selectNodeContents(this.editor);
            beforeStart.setEnd(range.startContainer, range.startOffset);

            const beforeEnd = document.createRange();
            beforeEnd.selectNodeContents(this.editor);
            beforeEnd.setEnd(range.endContainer, range.endOffset);

            const start = beforeStart.toString().length;
            const end = beforeEnd.toString().length;
            return start <= end ? { start, end } : { start: end, end: start };
        },

        getSelection() {
            const { start, end } = this.getSelectionOffsets();
            const text = this.getEditorDisplayText();
            return {
                start,
                end,
                selected: text.substring(start, end),
            };
        },

        getTextPosition(offset) {
            const walker = document.createTreeWalker(this.editor, NodeFilter.SHOW_TEXT);
            let currentOffset = 0;
            let node = walker.nextNode();

            while (node) {
                const nextOffset = currentOffset + node.nodeValue.length;
                if (offset <= nextOffset) {
                    return { node, offset: offset - currentOffset };
                }
                currentOffset = nextOffset;
                node = walker.nextNode();
            }

            const fallbackNode = document.createTextNode('');
            this.editor.appendChild(fallbackNode);
            return { node: fallbackNode, offset: 0 };
        },

        setSelectionOffsets(start, end = start) {
            this.editor.focus();
            const startPos = this.getTextPosition(start);
            const endPos = this.getTextPosition(end);
            const range = document.createRange();
            range.setStart(startPos.node, startPos.offset);
            range.setEnd(endPos.node, endPos.offset);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        },

        replaceSelection(start, end, newText) {
            this.replaceSelectionWithNode(start, end, document.createTextNode(newText));
            this.updateCharCount();
        },

        replaceSelectionWithNode(start, end, node) {
            this.setSelectionOffsets(start, end);
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(node);
            range.setStartAfter(node);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            this.editor.normalize();
            this.editor.focus();
        },

        insertAtCursor(text) {
            const { start, end } = this.getSelectionOffsets();
            this.replaceSelection(start, end, text);
        },

        // ---- Character Count ----

        updateCharCount() {
            const text = this.getEditorExportText();
            const len = [...text].length;
            const max = PLATFORMS[this.currentPlatform].maxChars;
            const counter = document.querySelector('.char-counter');
            const countEl = document.getElementById('charCount');

            countEl.textContent = len.toLocaleString();

            counter.classList.remove('over-limit', 'near-limit');
            if (len > max) {
                counter.classList.add('over-limit');
            } else if (len > max * 0.9) {
                counter.classList.add('near-limit');
            }

            // Twitter weighted count
            if (this.currentPlatform === 'twitter') {
                const weighted = twitterWeightedLength(text);
                document.getElementById('twitterWeightedVal').textContent = weighted.toLocaleString();
            }
        },

        // ---- Live Preview ----

        updatePreview() {
            const text = this.getEditorExportText();
            const content = document.getElementById('previewContent');
            const warningsEl = document.getElementById('previewWarnings');
            this.saveCurrentPost();

            if (!text) {
                content.innerHTML = '<p class="preview-placeholder">Your formatted post will appear here…</p>';
                warningsEl.classList.remove('visible');
                return;
            }

            content.textContent = '';
            content.appendChild(this.buildPreviewFragment());

            // Platform warnings
            const warnings = platformWarnings(text, this.currentPlatform);
            if (warnings.length > 0) {
                warningsEl.classList.add('visible');
                warningsEl.innerHTML = warnings.map(w =>
                    `<div class="preview-warning-item">${w}</div>`
                ).join('');
            } else {
                warningsEl.classList.remove('visible');
            }
        },

        buildPreviewFragment() {
            const fragment = document.createDocumentFragment();

            const appendNode = (sourceNode, targetParent) => {
                if (sourceNode.nodeType === Node.TEXT_NODE) {
                    targetParent.appendChild(document.createTextNode(sourceNode.nodeValue || ''));
                    return;
                }

                if (sourceNode.nodeType !== Node.ELEMENT_NODE) return;

                const sourceElement = sourceNode;
                const tag = sourceElement.tagName.toLowerCase();
                if (tag === 'br') {
                    targetParent.appendChild(document.createTextNode('\n'));
                    return;
                }

                if (tag === 'a') {
                    const href = normalizeLinkHref(sourceElement.getAttribute('href') || sourceElement.dataset.href || '');
                    const link = document.createElement('a');
                    link.href = href || '#';
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = serializeEditableNode(sourceElement, false);
                    targetParent.appendChild(link);
                    return;
                }

                for (const child of sourceElement.childNodes) {
                    appendNode(child, targetParent);
                }
            };

            for (const child of this.editor.childNodes) {
                appendNode(child, fragment);
            }

            return fragment;
        },

        // ---- Clipboard ----

        async copyToClipboard() {
            const raw = this.getEditorExportText();
            if (!raw) {
                this.showToast('Nothing to copy');
                return;
            }
            // Apply platform-specific processing before copying
            const text = platformProcess(raw, this.currentPlatform);
            try {
                await navigator.clipboard.writeText(text);
                this.showToast('Copied to clipboard ✓');
            } catch {
                const fallback = document.createElement('textarea');
                fallback.value = text;
                fallback.style.position = 'fixed';
                fallback.style.left = '-9999px';
                fallback.setAttribute('readonly', '');
                document.body.appendChild(fallback);
                fallback.select();
                document.execCommand('copy');
                fallback.remove();
                this.showToast('Copied to clipboard ✓');
            }
        },

        // ---- Special Characters Panel ----

        toggleSpecialChars() {
            const panel = document.getElementById('specialCharsPanel');
            const btn = document.querySelector('.toggle-chars-btn');
            const isHidden = panel.hidden;
            panel.hidden = !isHidden;
            btn.classList.toggle('active', isHidden);
        },

        buildSpecialCharsPanel() {
            const grid = document.getElementById('charsGrid');
            let html = '';
            for (const [category, chars] of Object.entries(SPECIAL_CHARS)) {
                const isDivider = category === 'Dividers';
                html += `<div class="chars-category">`;
                html += `<div class="chars-category-label">${category}</div>`;
                html += `<div class="chars-row">`;
                for (const ch of chars) {
                    const cls = isDivider ? 'char-btn divider-char' : 'char-btn';
                    const escaped = ch.replace(/"/g, '&quot;');
                    html += `<button class="${cls}" data-char="${escaped}" title="${escaped}">${ch}</button>`;
                }
                html += `</div></div>`;
            }
            grid.innerHTML = html;
            grid.addEventListener('click', (e) => {
                const btn = e.target.closest('.char-btn');
                if (!btn) return;
                this.pushUndo();
                this.insertAtCursor(btn.dataset.char);
                this.updatePreview();
            });
        },

        // ---- Undo Stack ----

        captureHistoryState() {
            const { start, end } = this.getSelectionOffsets();
            return {
                html: this.editor.innerHTML,
                selStart: start,
                selEnd: end,
            };
        },

        pushUndo() {
            this.undoStack.push(this.captureHistoryState());
            if (this.undoStack.length > this.maxUndo) this.undoStack.shift();
            this.redoStack = [];
            this.updateHistoryBtns();
        },

        restoreHistoryState(state) {
            this.editor.innerHTML = state.html;
            this.setSelectionOffsets(state.selStart, state.selEnd);
            this.editor.focus();
            this.updateCharCount();
            this.updatePreview();
        },

        undo() {
            if (this.undoStack.length === 0) {
                this.showToast('Nothing to undo');
                return;
            }
            this.redoStack.push(this.captureHistoryState());
            if (this.redoStack.length > this.maxUndo) this.redoStack.shift();
            const state = this.undoStack.pop();
            this.restoreHistoryState(state);
            this.updateHistoryBtns();
        },

        redo() {
            if (this.redoStack.length === 0) {
                this.showToast('Nothing to redo');
                return;
            }
            this.undoStack.push(this.captureHistoryState());
            if (this.undoStack.length > this.maxUndo) this.undoStack.shift();
            const state = this.redoStack.pop();
            this.restoreHistoryState(state);
            this.updateHistoryBtns();
        },

        updateHistoryBtns() {
            const undoBtn = document.querySelector('.tool-btn-undo');
            const redoBtn = document.querySelector('.tool-btn-redo');
            if (undoBtn) undoBtn.disabled = this.undoStack.length === 0;
            if (redoBtn) redoBtn.disabled = this.redoStack.length === 0;
        },

        // ---- Tooltips ----

        buildTooltips() {
            document.querySelectorAll('.tool-btn[data-label]').forEach(btn => {
                const label = btn.dataset.label;
                const shortcutRaw = btn.dataset.shortcut;
                let shortcutText = '';
                if (shortcutRaw) {
                    if (shortcutRaw === '?') {
                        shortcutText = '?';
                    } else if (shortcutRaw.startsWith('⇧')) {
                        const key = shortcutRaw.slice(1);
                        shortcutText = isMac ? `⌘ + ⇧ + ${key}` : `Ctrl + Shift + ${key}`;
                    } else {
                        shortcutText = isMac ? `⌘ + ${shortcutRaw}` : `Ctrl + ${shortcutRaw}`;
                    }
                }

                const tooltip = document.createElement('span');
                tooltip.className = 'btn-tooltip';
                tooltip.textContent = label;
                if (shortcutText) {
                    const hint = document.createElement('span');
                    hint.className = 'shortcut-hint';
                    hint.textContent = shortcutText;
                    tooltip.appendChild(hint);
                }
                btn.appendChild(tooltip);
                btn.removeAttribute('title');
            });
        },

        // ---- Shortcut Help Modal ----

        toggleShortcutHelp() {
            const overlay = document.getElementById('shortcutOverlay');
            const isVisible = overlay.classList.contains('visible');
            if (isVisible) { overlay.classList.remove('visible'); return; }

            overlay.classList.add('visible');
            const close = document.getElementById('shortcutClose');
            close.addEventListener('click', () => { overlay.classList.remove('visible'); }, { once: true });
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.classList.remove('visible');
            }, { once: true });
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    overlay.classList.remove('visible');
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        },

        // ---- Toast ----

        showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('visible');
            clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => { toast.classList.remove('visible'); }, 2000);
        },
    };

    document.addEventListener('DOMContentLoaded', () => app.init());
})();
