if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        // check if there is a new version available
        registration.onupdatefound = function() {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = function() {
                if(installingWorker.state === 'installed') {
                    if(navigator.serviceWorker.controller) {
                        showUpdateBar(); // update available
                    } 
                }
            };
        };
    }).catch(function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });
} 

// The click event on the pop up notification
window.onload = function() {
    document.getElementById('update').addEventListener('click', function(){
        window.location.reload(true);
    });
};

function showUpdateBar() {
    let snackbar = document.getElementById('update');
    snackbar.className = 'show';
}