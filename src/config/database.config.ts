import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const username = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  console.log('Database Config:');
  console.log(`Host: ${host}`);
  console.log(`Port: ${port}`);
  console.log(`Username: ${username}`);
  console.log(`Password: ${password ? '****' : 'Not provided'}`);
  console.log(`Database: ${database}`);

  return {
    type: 'mysql',
    host,
    port, 
    username,
    password,
    database,
    autoLoadEntities: true,
    synchronize: true,
  };
});
