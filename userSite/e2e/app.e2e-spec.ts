import { UserSitePage } from './app.po';

describe('user-site App', () => {
  let page: UserSitePage;

  beforeEach(() => {
    page = new UserSitePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
