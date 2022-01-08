import database from './database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (): any => ({
  database: database(),
});
