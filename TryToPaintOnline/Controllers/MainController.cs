using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TryToPaintOnline.Models;

namespace TryToPaintOnline.Controllers
{
    public class MainController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public IActionResult IndexPost()
        {
            return RedirectToAction("Index", "Paint", new { id = RoomIdGenerator.GetRoomNumber() });
        }
    }
}