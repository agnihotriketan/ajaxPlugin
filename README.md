#Plug & Play Ajax Plugin
Add refrence to the page where you want to do ajax request to get data.
## Sample usage
> ajaxPlugin.ajax.post({
            url: url,
            data: data
        });

>var deferred = $.Deferred(); 
>var promise = ajaxPlugin.ajax.get({ url: url });
>promise.then(function (result) {deferred.resolve(result);}, 
>function () {deferred.reject(); });
>return deferred.promise();
