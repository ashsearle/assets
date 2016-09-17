import test from 'ava';
import webdrivercss from 'webdrivercss';
import webdriverio from 'webdriverio';

import server from './helpers/server';

test.beforeEach(t => {
  t.context.client = webdriverio.remote({
    desiredCapabilities: {
      browserName: 'chrome'
    },
    host: 'ondemand.saucelabs.com',
    port: 80,
    user: 'assets',
    key: process.env.SAUCE_ACCESS_KEY
  });
  webdrivercss.init(t.context.client);
});

test.cb('integration', t => {
  server(function (err, server) {
    if (err) return t.fail();

    t.context.client.init()
      .url('http://localhost:3000')
      .webdrivercss('images', [{
        name: 'images',
        elem: '#images'
      }], function (err, res) {
        console.log(err, res.images);
        t.true(res.images[0].isWithinMisMatchTolerance);
        t.end()
      })
      .end()
      .call(function () {
        server.close();
      });
  });
});
