parameterToKeep = [""];

var ajaxPlugin = (function ($) {
    var emptyFunction = function () {

    };

    var plugin = {
        urls: {
            getQueryParameterValue: function (name, url) {
                var value = null;
                if (!url)
                    url = location.search;
                else
                    url = "?" + url.split('?')[1];

                name = name.toLowerCase();
                var hashes = url.slice(url.indexOf('?') + 1).split('&');
                for (var i = 0; i < hashes.length; i++) {
                    var hash = hashes[i].split('=');
                    if (hash[0] && hash[0].toLowerCase() === name) {
                        value = hash[1];
                        break;
                    }
                }
                return value;
            },

            appendQueryString: function (uri, key, value) {
                var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
                var separator = uri.indexOf('?') !== -1 ? "&" : "?";
                if (uri.match(re)) {
                    return uri.replace(re, '$1' + key + "=" + value + '$2');
                }
                else {
                    return uri + separator + key + "=" + value;
                }
            },

            formatUrl: function (url) {
                var newUrl = url;
                var paramsToBePersisted = parameterToKeep;
                if (paramsToBePersisted && paramsToBePersisted.length) {
                    paramsToBePersisted.forEach(function (query) {
                        var existingValue = this.getQueryParameterValue(query); 
                        if (!this.getQueryParameterValue(query, newUrl)) {
                            newUrl = this.appendQueryString(newUrl, query, existingValue);
                        }
                    }.bind(this));
                }
                return this.getExecuionUrl(newUrl);
            },

            redirectionalUrl: function (url) {
                var newUrl = url;
                var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                for (var i = 0; i < hashes.length; i++) {
                    var hash = hashes[i].split('=');
                    newUrl = i == 0 ? newUrl + "?" + hash[0] + "=" + hash[1] : newUrl + "&" + hash[0] + "=" + hash[1];
                }
                return this.getExecuionUrl(newUrl);
            },

            getExecuionUrl: function (newUrl) {
                if (newUrl.indexOf('http://') != 0) {
                    var slash = "/";
                    if (newUrl[0] == "/")
                        slash = "";
                    newUrl = location.origin + slash + newUrl;
                }
                return newUrl;
            }
        },

        ajax: {
            core: function (request) {
                var deferred = $.Deferred();
                var url = request.url || "/";
                var method = request.method || "GET";
                var data = (request.data && JSON.stringify(request.data)) || null;
                var dataType = request.dataType || 'json';
                var contentType = request.contentType || "application/json";
                var success = request.success || emptyFunction;
                var failure = request.failure || emptyFunction;

                var promise = $.ajax({
                    url: url,
                    method: method,
                    dataType: dataType,
                    contentType: contentType,
                    data: data,
                    success: success,
                    failure: failure
                });

                promise.then(function (apiResult) {
                    deferred.resolve(apiResult);
                }, function () {
                    deferred.reject();
                });

                var deferredPromise = deferred.promise();
                deferredPromise.abort = function () {
                    promise.abort();
                };
                return deferredPromise;
            },

            get: function (request) {
                request.url = plugin.urls.formatUrl(request.url);
                request.method = "GET";
                return this.core(request);
            },

            post: function (request) {
                request.url = plugin.urls.formatUrl(request.url);
                request.method = "POST";
                return this.core(request);
            },

            put: function (request) {
                request.url = plugin.urls.formatUrl(request.url);
                request.method = "PUT";
                return this.core(request);
            },

        }, 
    }
    return plugin;
})(jQuery);