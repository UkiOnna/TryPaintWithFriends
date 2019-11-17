using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace TryToPaintOnline.Controllers
{
    public class PaintController : Controller
    {
        public IActionResult Index(string login)
        {
            ViewBag.isDrawer = true;
            ViewBag.Login = login;
            return View();
        }
    }
}