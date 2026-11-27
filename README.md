# Folksessie Utrecht

The whole site is one page (`index.html`), so the background music keeps playing while people move
around. It has three views, chosen by the address:

| Address | View |
|---|---|
| `/` | Home: fabric with the four instruments (they tilt as you scroll the text), the coming sessions from the sheet with the INSCHRIJVEN button, and the explanation of how a session works plus "Over ons". |
| `/#aanmelden` | Sign-up: the sessions to tick, and the form along the bottom of the screen. |
| `/#tunes` | The tunebook: sheet music per level, with links to thesession.org. |

Everything is in Dutch; the button top-right switches the whole page to English (and remembers
the choice). The button top-left plays or pauses the music.

## Folder

| Path | What it is |
|---|---|
| `index.html` | The page, with all Dutch texts. |
| `site.css` | The look of all three views. |
| `site.js` | Language switching (English texts are in here), the views, the sessions, the sign-up form, the sound button, the tilting instruments. Also holds `SCRIPT_URL`, the link to the Apps Script. |
| `assets/img/` | Instruments, fabric (`textile.jpg`; `textile-plain.jpg` is the same fabric without the maroon circle), the photo of Pieter and Boet. |
| `assets/audio/kesh-set.webm` | The background music. |
| `assets/tunebook/`, `assets/The-Dutch-Session-Tunebook-2nd-ed.pdf` | Sheet music for the tunes view. |
| `apps-script/Code.gs` | The Apps Script behind the sessions and sign-ups. **Not in git** (see `.gitignore`): it contains the sheet IDs and this repo is public. It only exists on your computer and in Apps Script. |
| `apps-script/aanmeldingen.gs` | Older Apps Script. Not used for sign-ups any more, but the video page still sends its messages through it, so keep it deployed. |
| `sessie-video-k7q2/` | The hidden video page. |
| `signup.html`, `info.html`, `tunes.html`, `aanmelden/` | Old addresses; they forward to the right view, for anyone with an old link. |

Files the site no longer uses were moved to `../folkwebsiteOld/uit-folkwebsite/`.

## The sheets

The script uses three Google Sheets:

| Sheet | What's in it |
|---|---|
| **session dates** (first tab) | The sessions you fill in: `Event \| date \| time \| location \| cost \| id \| max participants`. |
| **sessie deelnemers** | One column per upcoming session (name, date and time on top, the names of everyone who signed up below). When a session has passed, its column moves to the tab **past sessions** in the same file. |
| **inschrijvingen** | Everyone who has ever joined: each newcomer is added as a row (Datum, Naam, Email, Instrument, Speelduur, Opmerking). |

Session dates:

- Only `Event` is required. A row with just a name already shows up on the page.
- `date` can be a real date or text like `19 dec 26`. Past sessions are hidden; sessions without
  a date are listed last.
- `time` is text like `13:00 - 14:30`.
- `id` links a session to its column in sessie deelnemers. Leave it empty for new sessions: the
  script fills one in. After that, don't change it.
- `max participants`: when that many names are under the session, it shows as **VOL** and nobody
  else can sign up. Empty means no limit.
- Optional `active` column: `FALSE` hides a session without deleting it.

Sessie deelnemers:

- Columns are added automatically when someone opens the page or signs up.
- Each header cell has a note with the session id. Don't delete it.
- Someone signing up twice for the same session appears once. A remark is a note on the name.
- Don't put counts or other text under the names: every filled cell counts as a person. Count on a
  separate tab, e.g. `=COUNTA(Blad1!A2:A)`.

Sharing: the sheets hold names and email addresses, so keep them **Restricted**. The script runs as
you, so the page keeps working.

## Updating the Apps Script

After changing `apps-script/Code.gs`:

1. Copy it: `Get-Content "apps-script\Code.gs" -Raw -Encoding UTF8 | Set-Clipboard`
2. In the session dates sheet: **Extensions > Apps Script**, select all, paste, save.
3. **Deploy > Manage deployments > pencil > Version: New version > Deploy.**

Don't make a *new* deployment: that gives a new link, and `SCRIPT_URL` in `site.js` would have to change.

## When something goes wrong

If the sessions can't be loaded or a sign-up can't be saved, the page tells people they can sign up
by email at folkmuziekutrecht@gmail.com. On your own computer (localhost) without `SCRIPT_URL`, the
page shows demo sessions so you can try it.
