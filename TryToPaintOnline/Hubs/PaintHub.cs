using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TryToPaintOnline.Models;

namespace TryToPaintOnline.Hubs
{
    public class PaintHub : Hub
    {
        static public List<User> Users { private set; get; } = new List<User>();
        bool gameStart = false;
        public void Send(int x, int y, int dx, int dy, string color)
        {
            Clients.All.SendAsync("Send", x, y, dx, dy, color);
        }

        public void Clear()
        {
            Clients.All.SendAsync("Clear");
        }

        public void SendMessage(string message)
        {
            var context = Context.GetHttpContext();
            string userName;
            context.Request.Cookies.TryGetValue("user", out userName);
            Clients.All.SendAsync("SendMessage",$"{userName}:{message}");
        }

        public void StartGame()
        {
            gameStart = true;
            var context = Context.GetHttpContext();
            string userName;
            context.Request.Cookies.TryGetValue("user", out userName);
            Clients.All.SendAsync("StartGame",userName);
        }

        public override async Task OnConnectedAsync()
        {
            var id = Context.ConnectionId;
            var context = Context.GetHttpContext();
            var i=context.Request.Path.Value;
            if (!Users.Any(x => x.ConnectionId == id))
            {
                if (context.Request.Cookies.ContainsKey("user"))
                {
                    string userName;
                    if (context.Request.Cookies.TryGetValue("user", out userName))
                    {
                        Users.Add(new User { ConnectionId = id, Name = userName });
                        await Clients.All.SendAsync("Notify", $"{userName} вошел в чат", $"Подключено({Users.Count}/8)").ConfigureAwait(false);

                    }
                }
            }
            await base.OnConnectedAsync().ConfigureAwait(false);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var item = Users.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                Users.Remove(item);
                var id = Context.ConnectionId;
                await Clients.All.SendAsync("Notify", $"{item.Name} покинул в чат", $"Подключено({Users.Count}/8)").ConfigureAwait(false);
            }
            await base.OnDisconnectedAsync(exception).ConfigureAwait(false);
        }
    }
}
