self.addEventListener('install', (event) => {
    console.log('Service Worker 安裝成功');
});

self.addEventListener('fetch', (event) => {
    //console.log('攔截請求:', event.request.url);
});
