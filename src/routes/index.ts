module.exports = (app: any) => {
  app.use('/main', require('./main'));
}