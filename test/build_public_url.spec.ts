import { buildPublicUrl, makeUrlFromRoot } from '../src/build_public_url';

describe('buildPublicUrl', () => {
  it('should skip all non-string url parts and parts that are empty strings', () => {
    const url = buildPublicUrl('', 'to', '', 'ho', undefined);

    expect(url).not.toMatch(/\/\//);
    expect(url).not.toContain('undefined');
    expect(url).toMatch('to/ho');
  });

  it('should not prepend slash to url', () => {
    const url = buildPublicUrl('foo', 'bar');

    expect(url.startsWith('/')).toBe(false);
  });

  it('should not append slash to url', () => {
    const url = buildPublicUrl('baz', 'bar');

    expect(url.endsWith('/')).toBe(false);
  });
});

describe('makeUrlFromRoot', () => {
  it('should prepend slash to url if it has not got it', () => {
    const url = makeUrlFromRoot('foo');

    expect(url).toMatch('/foo');
  });

  it('should not prepend slash if url has got it already', () => {
    const url = makeUrlFromRoot('/baz');

    expect(url).toMatch('/baz');
  });
});
