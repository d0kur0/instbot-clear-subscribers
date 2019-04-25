const logger = require(`${_app}/modules/logger`);

module.exports = async (page, SELECTOR, DESCRIPTION) => {

  await page.mainFrame().waitForSelector(SELECTOR)
    .then(() => {
      logger.success(`Элемент: "${DESCRITPION}" отрисован`);
    })
    .catch(() => {
      logger.error(`Элемент: "${DESCRITPION}" не был отрисован`);
    });

  await page.click(SELECTOR)
    .then(() => {
      logger.info(`Эмулирую клик на элемент "${DESCRIPTION}"`);
    })
    .catch(() => {
      logger.error(`Не удалось произвести клик на элемент "${DESCRIPTION}"`);
    });

};