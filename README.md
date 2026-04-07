# PostCraft ✦

Unicode text formatting for social media — a lightweight, client-side web app.

Format your posts for **LinkedIn**, **Instagram**, and **Twitter/X** with bold, italic, strikethrough, and more — no extensions or sign-ups required.

## Features

- **Text Formatting** — Bold, italic, bold-italic, underline, strikethrough, monospace, small caps, superscript
- **Lists** — Bullet points and numbered lists
- **Special Characters** — Arrows, shapes, check marks, dividers, brackets, and more
- **Live Preview** — Side-by-side editor and preview panel
- **Platform-Aware**
  - *Twitter/X* — Weighted character counter (Unicode = 2 chars), auto-shortened dividers, over-limit warnings
  - *Instagram* — Blank lines preserved with invisible spacers on copy, hashtag count warnings (max 30)
  - *LinkedIn* — Auto-separates hashtag blocks on copy, warns about long single paragraphs
- **Undo** — Formatting undo stack with `Ctrl+Z` / `⌘Z` (falls back to native undo when stack is empty)
- **Keyboard Shortcuts** — OS-aware tooltips (`⌘` on Mac, `Ctrl` on Windows)
- **Copy to Clipboard** — One-click copy with platform-specific post-processing
- **Fully Client-Side** — No server, no tracking, everything runs in your browser

## Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Bold | `Ctrl+B` |
| Italic | `Ctrl+I` |
| Underline | `Ctrl+U` |
| Strikethrough | `Ctrl+Shift+S` |
| Monospace | `Ctrl+Shift+M` |
| Superscript | `Ctrl+Shift+P` |
| Bullet List | `Ctrl+Shift+L` |
| Numbered List | `Ctrl+Shift+O` |
| Insert Divider | `Ctrl+Shift+D` |
| Copy to Clipboard | `Ctrl+Shift+C` |
| Clear Formatting | `Ctrl+Shift+X` |
| Undo | `Ctrl+Z` |
| Shortcut Help | `?` |

> On macOS, use `⌘` instead of `Ctrl`.

## Getting Started

No build step required. Just open `index.html` in a browser:

```sh
open index.html
```

Or serve it locally:

```sh
npx serve .
```

## How It Works

PostCraft converts your text into [Unicode mathematical alphanumeric symbols](https://en.wikipedia.org/wiki/Mathematical_Alphanumeric_Symbols) that render as bold, italic, etc. on any platform — because they're real Unicode characters, not rich text formatting.

For example, `Hello` → `𝐇𝐞𝐥𝐥𝐨` (bold) uses characters from the U+1D400 block.

## Tech Stack

- Vanilla HTML, CSS, JavaScript
- Zero dependencies
- Single-page app (~1,600 lines total)

## License

[MIT](LICENSE)
