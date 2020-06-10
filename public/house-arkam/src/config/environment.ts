const isProd = process.env.NODE_ENV === 'production';
export default {
  isProd,
  baseUrl: isProd ? '' : process.env.REACT_APP_DOMAIN_DEV,
};
