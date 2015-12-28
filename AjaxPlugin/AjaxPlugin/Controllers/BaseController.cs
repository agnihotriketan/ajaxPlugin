using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AjaxPlugin.Controllers
{
    public class BaseController : Controller
    {
        //
        // GET: /Base/

        public ActionResult Index()
        {
            return View();
        }

    }

    public class CacheFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var cache = filterContext.HttpContext.Response.Cache;
            var cacheDuration = TimeSpan.FromSeconds(10);
            cache.SetCacheability(HttpCacheability.Public);
            cache.SetExpires(DateTime.Now.Add(cacheDuration));
            cache.SetMaxAge(cacheDuration);
            cache.AppendCacheExtension("must-revalidate, proxy-revalidate");
        }
    }

    public class CompressFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var request = filterContext.HttpContext.Request;
            if (!string.IsNullOrEmpty(request.Headers["Accept-Encoding"]))
            {
                var acceptEncoding = request.Headers["Accept-Encoding"].ToUpperInvariant();
                var response = filterContext.HttpContext.Response;
                if (acceptEncoding.Contains("GZIP"))
                {
                    response.AppendHeader("content-encoding","gzip");
                    response.Filter = new GZipStream(response.Filter,CompressionMode.Compress);
                }
                else if (acceptEncoding.Contains("DEFLATE"))
                {
                    response.AppendHeader("content-encoding","deflate");
                    response.Filter = new DeflateStream(response.Filter,CompressionMode.Compress);
                }
            }
        }
    }
}
