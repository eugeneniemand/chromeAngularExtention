import { ExtPage } from './app.po';

describe('ext App', () => {
  let page: ExtPage;

  beforeEach(() => {
    page = new ExtPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
