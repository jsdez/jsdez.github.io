# neo-pricework local demo harness

This folder contains a self-contained, offline test page for the
`<neo-pricework>` form plugin. It loads the local `dist/neo-pricework.js`
build directly, so you can edit `src/`, rebuild, and refresh the page —
**no push to the `jsdez.github.io` GitHub Pages repository required.**

## Quick start

```bash
cd plugins/neo-pricework
npm run dev
```

Open **http://localhost:4321/demo/**. Leave `npm run dev` running while you work:

- Saving a file in `src/` rebuilds the plugin and reloads the page.
- Saving a file in `demo/` reloads the page.
- A failed build shows the error in a red banner and keeps the last good build
  running; the next good build clears it.
- Property field values are kept across reloads (per browser tab). To keep the
  component's jobs across reloads too, click **Use output as input**.
- Use `PORT=5000 npm run dev` for a different port. The server listens on
  localhost only.

`npm run dev` writes its builds to `.dev-build/` (gitignored) and serves them
for `/dist/…` requests, so the committed `dist/neo-pricework.js` is **not**
changed while you work. When you're ready to deploy, run `npm run build` to
update `dist/`, then commit and push as usual.

> Without the dev server you can still `npm run build` and open
> `demo/index.html` directly or via any static server; it just won't reload
> automatically.

## What the demo does

- Mounts a single `<neo-pricework>` instance, configured from the fixture
  (see "Fixture data" below).
- **Properties panel** — generated automatically from the component's
  `getMetaConfig()`, so any property you add to the plugin shows up here
  without editing the demo:
  - Booleans (e.g. `readOnly`) and enums (e.g. `formMode`) apply immediately.
  - Strings and objects apply when you click **Apply**. Object fields are
    edited as JSON; invalid JSON is reported inline and not applied.
  - **Remount with these values** creates a fresh element with every field
    applied *before* it connects — use this to test initial-load behaviour
    (e.g. a Forms host setting `inputobj`/`outputobj` on first render).
  - **Reset fields to fixture** restores the editor fields (then Apply or
    Remount to use them).
  - **Use output as input** copies the current output value into the
    `inputobj` field and applies it.
  - The value field (`outputobj`) starts empty, like a new form.
- **Output value** — shows the latest `ntx-value-change` payload, i.e. what
  the Forms host would store.
- **Event log** — property changes, emitted values, and test results.
- Quick tests:
  - **Add sample job** — runs the real add-job path
    (`openAdd` → `addWorkItem` → `save`) so you get a non-empty value.
  - **Test: read-only while editing** — opens the editor, sets
    `readOnly = true`, and reports whether the modal is still editable
    (currently reports a bug).
  - **Test: restore emitted value** — assigns the last emitted value to
    `outputobj` on a fresh instance before mount and reports whether the jobs
    are restored (currently reports a bug).
  - **Test: Reset** — remounts the component, loads a job through
    `inputobj`, then checks that pressing Reset (`reset = true`) returns the
    component to a blank first load (no jobs, cleared `inputobj`/`inputstr`,
    editor closed, one empty output value, empty list rendered) and switches
    Reset back to `false`; that re-sending the same input is ignored; that a
    different input loads; that Reset works a second time; and that Reset set
    before first load starts blank. It leaves the component in the reset state.
  - **Test: Delete and remove()** — checks that no component method or
    property replaces a built-in element member (such as `remove()`), that
    the editor's Delete button deletes only the job being edited and emits one
    value, that `removeJob()` ignores invalid indexes, and that `remove()`
    takes the element off the page without emitting a value.
  - Reset works like a button: ticking the **Reset** checkbox resets the
    component, which switches Reset back off, so the checkbox unticks itself.
    The Input fields in the Properties panel stand in for the form's bound
    values, so they are not cleared; applying the same value again is
    ignored, a different value loads.
- The Google Maps API key is only kept in the page for the session. Leave it
  blank to test offline; the address field then acts as a plain text input.

## Fixture data

The demo reads component configuration from a global variable,
`window.__NEO_PRICEWORK_FIXTURE__`, populated by one of two scripts loaded
by `index.html` (in order of preference):

1. **`fixture-data.js`** (gitignored, not committed) — a real, faithful copy
   of a live form's configuration (contract list, work item catalog,
   `formMode`, `readOnly`). This can contain **real, non-public business
   data** (contract names, pricing), so it is intentionally excluded from
   git via `.gitignore` and must never be committed to this public
   repository.
2. **`fixture-data.example.js`** (tracked in git) — a small, safe placeholder
   fixture used automatically if `fixture-data.js` is absent, so the demo
   works out of the box for anyone who clones the repo.

### Regenerating `fixture-data.js` from a live form

If you have a live Nintex form open with a `neo-pricework` instance
rendered, open the browser DevTools console on that page and run:

```js
copy((() => {
  const el = [...document.querySelectorAll('neo-pricework')]
    .find(e => e.getBoundingClientRect().width > 0) || document.querySelector('neo-pricework');
  if (!el) throw new Error('No neo-pricework instance found on this page.');
  const component = {
    formMode: el.formMode,
    inputstr: el.inputstr,
    inputobj: el.inputobj,
    outputobj: el.outputobj,
    contracts: el.contracts,
    workItems: el.workItems,
    readOnly: el.readOnly,
    currency: el.currency,
    // apiKey is intentionally NOT captured — never copy real API keys into fixtures.
  };
  return 'window.__NEO_PRICEWORK_FIXTURE_SOURCE__ = "live-capture (local, gitignored)";\n' +
    'window.__NEO_PRICEWORK_FIXTURE__ = ' + JSON.stringify(component, null, 2) + ';\n';
})());
```

This copies the generated script to your clipboard. Paste it into a new
`demo/fixture-data.js` file (this repo's `.gitignore` already excludes it,
so it is safe to keep locally and will not be committed).

**Never commit `fixture-data.js` or `live-timesheet-fixture.json`** — this
repository is published publicly via GitHub Pages, and captured fixtures may
contain real contract names and pricing.
