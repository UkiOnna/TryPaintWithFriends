﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace TryToPaintOnline.Controllers
{
    public class GuesserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}