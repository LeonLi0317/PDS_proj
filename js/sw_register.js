if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log("Service Worker 註冊成功"))
        .catch(() => console.log("Service Worker 註冊失敗"));
}