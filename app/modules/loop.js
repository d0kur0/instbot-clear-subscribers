const logger         = require(`${_app}/modules/logger`);
const sleep          = require(`${_app}/modules/sleep`);
const { PendingXHR } = require('pending-xhr-puppeteer');
const waitAndClick  = require(`${_app}/modules/waitAndClick.js`);

module.exports = async (page) => {
  const USER_PAGE_SELECTOR          = 'nav > div._8MQSO.Cx7Bp > div > div > div.ctQZg > div > div:nth-child(3) > a';
  const FOLLOWERS_BUTTON_SELECTOR   = '.k9GMp > li:nth-child(3) > a';
  const FOLLOWING_BUTTON_SELECTOR   = 'div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > ._0mzm-.sqdOP.L3NKy._8A5w5';
  const UNSUBSCRIBE_BUTTON_SELECTOR = 'div > div > div.mt3GC > button.aOOlW.-Cab_';
  const SCROLL_BLOCK_SELECTOR       = 'div.RnEpo.Yx5HN > div > div.isgrP';
  const ROW_FOLLOWER_SELECTOR       = '.jSC57._6xe7A > .PZuss > .wo9IH';
  const INDEX_PAGe                  = 'https://www.instagram.com';

  const reopen = async () => {
    await page.goto(INDEX_PAGe);

    await waitAndClick(
      page,
      USER_PAGE_SELECTOR,
      'ссылка на страницу пользователя'
    );

    await waitAndClick(
      page,
      FOLLOWERS_BUTTON_SELECTOR,
      'окно списка подписчиков'
    );
  };

  const cleaner = async () => {

    logger.header('# NEXT ITERATION');

    await waitAndClick(
      page,
      FOLLOWING_BUTTON_SELECTOR,
      'окно с кнопкой отписки'
    );

    const pendingXHR = new PendingXHR(page);

    await waitAndClick(
      page,
      UNSUBSCRIBE_BUTTON_SELECTOR,
      'кнопка отписаться'
    );

    await pendingXHR.waitForAllXhrFinished()
      .then(() => {
        logger.info('Все XHR запросы завершены');
      });

    await page.evaluate((selector) => {
      const block = document.querySelector(selector);

      if (block) {
        block.remove();
      }
    }, ROW_FOLLOWER_SELECTOR)
  };

  await reopen();

  for (let count = 1; count <= 7; count++) {
    await cleaner();
    await sleep(1000);

    if (count === 7) {
      await reopen();

      count = 1;
    }
  }

  return true;
};