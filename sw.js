var ver = '1.0.1'

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(ver).then(function(cache) {
        return cache.addAll([
          '/test/static/img/asdf.jpg'
        ]);
      })
    );
  });


  self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request).then(function (response) {
          // response may be used only once
          // we need to save clone to put one copy in cache
          // and serve second one
          let responseClone = response.clone();
          
          caches.open(ver).then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch(function () {
          return caches.match('/test/static/img/asdf.jpg');
        });
      }
    }));
  });  