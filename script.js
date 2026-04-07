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
        bold: buildCharMap(0x1D400, 0x1D41A, 0x1D7CE),
        italic: (() => {
            const m = buildCharMap(0x1D434, 0x1D44E, null);
            m['h'] = '\u210E';
            return m;
        })(),
        'bold-italic': buildCharMap(0x1D468, 0x1D482, null),
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

    const REVERSE_MAP = {};
    for (const [, map] of Object.entries(CHAR_MAPS)) {
        for (const [plain, styled] of Object.entries(map)) {
            REVERSE_MAP[styled] = plain;
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
                'Use 𝐛𝐨𝐥𝐝 headings to make long posts scannable.',
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
    //  App Controller
    // =========================================================

    const app = {
        currentPlatform: 'linkedin',
        editor: null,
        toastTimer: null,
        undoStack: [],
        maxUndo: 50,

        init() {
            this.editor = document.getElementById('editor');
            this.bindToolbar();
            this.bindPlatformTabs();
            this.bindStatusBar();
            this.bindKeyboardShortcuts();
            this.buildSpecialCharsPanel();
            this.buildTooltips();
            this.updatePlatform('linkedin');
            this.updateCharCount();
            this.updatePreview();
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

        bindStatusBar() {
            this.editor.addEventListener('input', () => {
                this.updateCharCount();
                this.updatePreview();
            });
            document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
            document.getElementById('clearBtn').addEventListener('click', () => {
                this.pushUndo();
                this.editor.value = '';
                this.updateCharCount();
                this.updatePreview();
                this.editor.focus();
                this.showToast('Cleared');
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
                        return;
                    }
                    if (action) {
                        e.preventDefault();
                        this.handleFormat(action);
                        return;
                    }
                }

                const shortcuts = { 'b': 'bold', 'i': 'italic', 'u': 'underline' };
                const action = shortcuts[e.key.toLowerCase()];
                // Let browser handle native Ctrl+Z when our undo stack is empty
                if (e.key.toLowerCase() === 'z') {
                    if (this.undoStack.length > 0) {
                        e.preventDefault();
                        this.handleFormat('undo');
                    }
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

            const tipsList = document.getElementById('tipsList');
            tipsList.innerHTML = config.tips.map(tip => `<li>${tip}</li>`).join('');

            // Update preview body class for platform-specific styling
            const previewBody = document.getElementById('previewBody');
            previewBody.className = 'preview-body ' + config.previewClass;

            // Toggle twitter weighted counter
            const twitterCount = document.getElementById('twitterWeightedCount');
            twitterCount.hidden = platform !== 'twitter';

            this.updateCharCount();
            this.updatePreview();
        },

        // ---- Formatting Actions ----

        handleFormat(action) {
            if (action === 'toggle-chars') { this.toggleSpecialChars(); return; }
            if (action === 'shortcut-help') { this.toggleShortcutHelp(); return; }
            if (action === 'undo') { this.undo(); return; }

            this.pushUndo();

            if (action === 'divider') {
                let divider = '━━━━━━━━━━━━━━━';
                if (this.currentPlatform === 'twitter') {
                    divider = twitterShortenDivider(divider);
                }
                this.insertAtCursor('\n' + divider + '\n');
                this.updatePreview();
                return;
            }

            const { start, end, selected } = this.getSelection();

            if (action === 'clear') {
                if (!selected) {
                    this.editor.value = stripToPlain(this.editor.value);
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

            if (!selected) {
                this.showToast('Select some text first');
                return;
            }

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

        // ---- Selection Helpers ----

        getSelection() {
            return {
                start: this.editor.selectionStart,
                end: this.editor.selectionEnd,
                selected: this.editor.value.substring(this.editor.selectionStart, this.editor.selectionEnd),
            };
        },

        replaceSelection(start, end, newText) {
            const value = this.editor.value;
            this.editor.value = value.substring(0, start) + newText + value.substring(end);
            this.editor.selectionStart = start;
            this.editor.selectionEnd = start + newText.length;
            this.editor.focus();
            this.updateCharCount();
        },

        insertAtCursor(text) {
            const start = this.editor.selectionStart;
            const value = this.editor.value;
            this.editor.value = value.substring(0, start) + text + value.substring(start);
            const newPos = start + text.length;
            this.editor.selectionStart = newPos;
            this.editor.selectionEnd = newPos;
            this.editor.focus();
            this.updateCharCount();
        },

        // ---- Character Count ----

        updateCharCount() {
            const text = this.editor.value;
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
            const text = this.editor.value;
            const content = document.getElementById('previewContent');
            const warningsEl = document.getElementById('previewWarnings');

            if (!text) {
                content.innerHTML = '<p class="preview-placeholder">Your formatted post will appear here…</p>';
                warningsEl.classList.remove('visible');
                return;
            }

            // Render text as escaped HTML preserving whitespace
            const escaped = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            content.textContent = '';
            content.textContent = text;

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

        // ---- Clipboard ----

        async copyToClipboard() {
            const raw = this.editor.value;
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
                this.editor.select();
                document.execCommand('copy');
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

        pushUndo() {
            this.undoStack.push({
                value: this.editor.value,
                selStart: this.editor.selectionStart,
                selEnd: this.editor.selectionEnd,
            });
            if (this.undoStack.length > this.maxUndo) this.undoStack.shift();
            this.updateUndoBtn();
        },

        undo() {
            if (this.undoStack.length === 0) {
                this.showToast('Nothing to undo');
                return;
            }
            const state = this.undoStack.pop();
            this.editor.value = state.value;
            this.editor.selectionStart = state.selStart;
            this.editor.selectionEnd = state.selEnd;
            this.editor.focus();
            this.updateCharCount();
            this.updatePreview();
            this.updateUndoBtn();
        },

        updateUndoBtn() {
            const btn = document.querySelector('.tool-btn-undo');
            if (btn) btn.disabled = this.undoStack.length === 0;
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
