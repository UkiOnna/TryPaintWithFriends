using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TryToPaintOnline.Hubs;

namespace TryToPaintOnline.Controllers
{
    public class PaintController : Controller
    {
        int counter = 0;
        [HttpGet("{id}")]
        public IActionResult Index(int? id)
        {
            if (id != null)
            {
                ViewBag.RoomNumber = id.ToString();
                return View();
            }
            return NotFound();
        }
    }
}