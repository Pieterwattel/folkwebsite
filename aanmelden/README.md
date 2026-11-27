# Session sign-up page

Note: `Code.gs` is kept out of git (see `.gitignore`) because it contains the sheet IDs and
this repo is public. It only exists on your computer and, once pasted in, in Apps Script.

Two files in this folder:

- `index.html`: the public sign-up page. It's a single file with no build step.
- `Code.gs`: a Google Apps Script that reads events from your sheet and saves sign-ups.

## 1. Prepare the sheet

The **session dates** sheet works as it is: the first tab, with the columns
`Event | date | time | location | cost | id | max participants` in row 1.

- Only `Event` is required. A row with just a name already shows up on the page.
- `date` can be a real date or text like `19 dec 26`. Events with a date in the past are hidden;
  events without a date are listed after the dated ones.
- `time` is text like `13:00 - 14:30`. (Separate `start` and `end` columns work too.)
- `id` links each session to its column in sessie deelnemers. You can leave it empty for new
  sessions: the script fills one in the first time someone opens the page. After that, don't
  change the id. You can rename the event or move its date and its sign-ups stay with it.
- `max participants`: a number. When that many names are under the session in sessie deelnemers,
  the page shows the session as **FULL** and nobody else can sign up for it. Empty means no limit.
  To make room again, remove a name in sessie deelnemers or raise the number.
- Optional: an `active` column. Set it to `FALSE` to hide an event without deleting it.

Sharing: once people sign up, the sheets hold names and email addresses. Set all three sheets to
**Restricted** and add only your team. The script runs as you, so the page keeps working.

### Where sign-ups go

The script uses three sheets:

| Sheet | What's in it |
|---|---|
| **session dates** (Events tab) | The sessions you fill in. |
| **sessie deelnemers** (Blad1) | One column per session: row 1 is the session name and date (e.g. `folk session, mainly Irish, 19 dec '26`), below it the names of everyone who signed up. |
| **inschrijvingen** (Blad1) | Everyone who has ever joined. Each newcomer is added as a row: Datum, Naam, Email, Instrument, Speelduur, Opmerking. |

- Columns in sessie deelnemers are added automatically for each upcoming session,
  when someone opens the sign-up page or signs up. Past sessions stay as they are.
- The session id is stored as a note on each header cell. You can rename a header by hand;
  don't delete the note.
- If someone signs up twice for the same session, their name appears only once.
- A remark is attached to the person's name as a cell note (hover over the name to read it).
  Newcomers' remarks also go into Opmerking in inschrijvingen.
- Returning players only appear in sessie deelnemers; they're already in inschrijvingen.

The script runs as the Google account that deploys it, so deploy it from an account that can
edit **all three** sheets (e.g. pieterwattel@gmail.com, which owns inschrijvingen).

## 2. Deploy the Apps Script

1. Open the **session dates** sheet, then go to **Extensions > Apps Script**.
2. Delete the sample code and paste in all of `Code.gs`. Save.
3. In the function dropdown pick **testSetup**, then click **Run**. Approve the permissions prompt
   (Advanced > Go to … (unsafe) is normal for your own scripts). Check the log lists your events,
   and that sessie deelnemers now has a column for each upcoming session.
4. **Deploy > New deployment**, click the gear, choose **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
6. Open that URL in a browser. You should see `{"ok":true,"events":[...]}`.

When you change `Code.gs` later, use **Deploy > Manage deployments > Edit (pencil) > Version: New version**.
That keeps the same URL. A *new* deployment would give you a new URL.

## 3. Connect the page

In `index.html`, near the top of the `<script>`:

```js
const SCRIPT_URL = 'https://script.google.com/macros/s/XXXX/exec';
```

With `SCRIPT_URL` empty the page shows demo sessions and doesn't save anything.

## 4. Host the page

The page lives in the folk website, in the `aanmelden/` folder. Wherever the folk website is
published, the sign-up page is at `<site address>/aanmelden/`.

## Look and files

The colours match the folk session website: grey `#ebece8`, maroon `#7a1f2b` and yellow `#fdc81e`.
The big dots between sessions are filled with the site's own `textile.jpg` (`../textile.jpg`).

## Counting sign-ups

Don't put counts or other text under the names in sessie deelnemers: the script counts every
filled cell there as a person. Count on a separate tab instead, e.g. a tab "Totaal" with
`=COUNTA(Blad1!A2:A)` in A1, dragged to the right.
