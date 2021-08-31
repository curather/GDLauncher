import configureStoreDev from './configureStore.dev';
import configureStoreProd from './configureStore.prod';

const selectedConfigureStore =
  window.env.NODE_ENV === 'production'
    ? configureStoreProd
    : configureStoreDev;

export const { configureStore } = selectedConfigureStore;

export const { history } = selectedConfigureStore;
