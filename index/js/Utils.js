window.Utils = {

    _ajaxGet: function(url, responseOk, errorCallback) {

        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {

                responseOk.call(null, request.responseText);

            } else {

                errorCallback.call(null, 'Ajax error happened');

            }
        };

        request.onerror = function() {
            errorCallback.call(null, 'Ajax connection problem');
        };

        request.send();
    },

    getJSON: function(url) {

        return new Promise(function(fulfill, reject) {

            Utils._ajaxGet(url, function(responseText) {

                var data = JSON.parse(responseText);
                fulfill(data);

            }, function(error) {

                reject(error);

            });

        });
    },

    getText: function(url, callback) {

        return new Promise(function(fulfill, reject) {

            Utils._ajaxGet.call(null, url, function(responseText) {

                fulfill(responseText);

            }, function(error) {

                reject(error);

            });

        });
    },

    documentReady: function(fn) {
        if (document.readyState != 'loading'){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
};