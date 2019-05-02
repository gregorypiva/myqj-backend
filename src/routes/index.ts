module.exports = (app: any) => {
  app.use('/main', require('./main'));
  app.use('/api', require('./api'));
}