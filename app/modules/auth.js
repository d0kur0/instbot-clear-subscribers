const logger  = require(`${_app}/modules/logger`);

module.exports = async (page) => {

  const SIGNIN_PAGE             = 'https://www.instagram.com/accounts/login/';
  const SELECTOR_USERNAME_FIELD = 'input[name="username"]';
  const SELECTOR_PASSWORD_FIELD = 'input[name="password"]';
  const SELECTOR_SUBMIT_BUTTON  = 'button[type="submit"]';
  const SELECTOR_CHECK_AUTH     = '.glyphsSpriteUser__outline__24__grey_9.u-__7';
  const REQUEST_SIGNIN_URL      = 'https://www.instagram.com/accounts/login/ajax/';
  const PAGE_CHECK_AUTH         = 'https://www.instagram.com';

  if (!process.env.INST_USER) {
    logger.error('Не установленна переменная окружения "INST_USER"');

    return false;
  }

  if (!process.env.INST_PASSWORD) {
    logger.error('Не установлена переменная окружения "INST_PASSWORD"');

    return false;
  }

  logger.header('Начинаю авторизацию...');
  await page.goto(SIGNIN_PAGE);

  logger.info('Ожидание, пока отрисуются поля формы авторизации');

  await page.mainFrame().waitForSelector(SELECTOR_USERNAME_FIELD)
    .then( () => {
      logger.info('Поле для ввода имени пользователя отрисовано');
    })
    .catch(() => {
      logger.error('Поле ввода имени пользователя не отрендерилось');
    });

  await page.mainFrame().waitForSelector(SELECTOR_PASSWORD_FIELD)
    .then( () => {
      logger.success('Поле для ввода пароля отрисовано');
    })
    .catch(() => {
      logger.error('Поле ввода пароля не отрендерилось');
    });

  await page.focus(SELECTOR_USERNAME_FIELD);
  await page.keyboard.type(process.env.INST_USER);

  await page.focus(SELECTOR_PASSWORD_FIELD);
  await page.keyboard.type(process.env.INST_PASSWORD);

  await page.click(SELECTOR_SUBMIT_BUTTON)
    .then(() => {
      logger.success('Поля заполнены, отправка формы');
    })
    .catch(() => {
      logger.error('Произошла ошибка отправки формы авторизации');
    });

  await page.waitForResponse(REQUEST_SIGNIN_URL);

  await page.goto(PAGE_CHECK_AUTH)
    .then(() => {
      logger.success(`Открытие "${PAGE_CHECK_AUTH}" для проверки авторизации`);
    })
    .catch(() => {
      logger.error(`Не удалось открыть "${PAGE_CHECK_AUTH}"`);
    });

  await page.mainFrame().waitForSelector(SELECTOR_CHECK_AUTH)
    .then(() => {
      logger.success(`Ожидание появление в DOM дереве элемента с селектором: "${SELECTOR_CHECK_AUTH}"`);
    })
    .catch(() => {
      logger.error(`Элемент с селектором "${SELECTOR_CHECK_AUTH}" не был отрисован`);
    });

  const authResponse = await page.evaluate((SELECTOR_CHECK_AUTH) => {
    return Boolean(document.querySelector(SELECTOR_CHECK_AUTH));
  }, SELECTOR_CHECK_AUTH);

  if (!authResponse) {
    logger.error('Авторизация не удалась');
    return false;
  }

  logger.success('Авторизация прошла успешно ❤');
  return true;
};