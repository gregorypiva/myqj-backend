const main = require('express').Router();

main.get('/', (req: any, res: any) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = main;