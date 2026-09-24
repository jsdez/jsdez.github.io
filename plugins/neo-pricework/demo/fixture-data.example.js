/**
 * Safe, tracked example fixture for the neo-pricework local demo.
 *
 * This file contains no real business data. It exists so that anyone who
 * clones the repository can run `demo/index.html` immediately, without
 * needing access to the live Nintex form or its production pricing data.
 *
 * To test against a real, faithful copy of the live form's configuration
 * (contracts, work item catalog, etc.), generate `fixture-data.js` next to
 * this file using the capture snippet in `demo/README.md`. `fixture-data.js`
 * is gitignored and will automatically take precedence over this example
 * when present (see `demo/index.html`).
 */
window.__NEO_PRICEWORK_FIXTURE_SOURCE__ = 'example (safe placeholder)';
window.__NEO_PRICEWORK_FIXTURE__ = {
  formMode: 'Nintex Cloud Form',
  inputstr: '',
  inputobj: { jobs: [], totalJobs: 0, totalWorkItems: 0, totalPrice: 0 },
  outputobj: { jobs: [], totalJobs: 0, totalWorkItems: 0, totalPrice: 0 },
  contracts: JSON.stringify([
    { contract: 'N/A' },
    { contract: 'Example Contract A' },
    { contract: 'Example Contract B' },
  ]),
  workItems: {
    items: [
      { name: 'EX001 - Example Callout', contract: 'N/A', itemCode: 'EX001', price: 46.5 },
      { name: 'EX002 - Example Install', contract: 'Example Contract A', itemCode: 'EX002', price: 25 },
      { name: 'EX003 - Example Remedial', contract: 'Example Contract A', itemCode: 'EX003', price: 18 },
      { name: 'EX004 - Example Board Replacement', contract: 'Example Contract B', itemCode: 'EX004', price: 100 },
      { name: 'EX005 - Example Basic Extra', contract: 'Example Contract B', itemCode: 'EX005', price: 1 },
    ],
  },
  readOnly: false,
  currency: '£',
};
