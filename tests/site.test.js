const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

describe('index.html', () => {
  test('starts with an HTML5 doctype', () => {
    expect(html.trim().toLowerCase()).toMatch(/^<!doctype html>/);
  });
  test('has a non-empty <title>', () => {
    expect(html).toMatch(/<title>\s*\S+.*<\/title>/is);
  });
  test('declares a language', () => {
    expect(html).toMatch(/<html[^>]*\slang=/i);
  });
  test('has visible body content', () => {
    expect(html).toMatch(/<body[^>]*>\s*\S+/i);
  });
});