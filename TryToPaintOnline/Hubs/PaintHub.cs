using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
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

        public void SendMessage(string message, string group)
        {
            var context = Context.GetHttpContext();
            string userName;
            context.Request.Cookies.TryGetValue("user", out userName);
            Clients.Group(group).SendAsync("SendMessage", $"{userName}:{message}");
        }

        public void StartGame()
        {
            gameStart = true;
            var context = Context.GetHttpContext();
            string userName;
            context.Request.Cookies.TryGetValue("user", out userName);
            Clients.All.SendAsync("StartGame", userName);
        }

        public async Task CreateGroup(string userName)
        {
            var id = Context.ConnectionId;
            var context = Context.GetHttpContext();
            var i = context.Request.Path.Value;
            if (!Users.Any(x => x.ConnectionId == id))
            {
                string group = RoomIdGenerator.GetRoomNumber().ToString();
                Users.Add(new User { ConnectionId = id, Name = userName, GroupId = group });
                await Groups.AddToGroupAsync(Context.ConnectionId, group).ConfigureAwait(false);
            }
        }

        public async Task JoinGroup(string group, string userName)
        {
            if (RoomIdGenerator.IsRoomCreated(int.Parse(group)))
            {
                var id = Context.ConnectionId;
                var context = Context.GetHttpContext();
                var i = context.Request.Path.Value;
                if (!Users.Any(x => x.ConnectionId == id))
                {
                    Users.Add(new User { ConnectionId = id, Name = userName, GroupId = group });
                    await Groups.AddToGroupAsync(Context.ConnectionId, group).ConfigureAwait(false);
                }
            }
        }

        public override async Task OnConnectedAsync()
        {
            var id = Context.ConnectionId;

            var i = context.Request.Path.Value;
            if (Users.Any(x => x.ConnectionId == id))
            {
                var user = Users.FirstOrDefault(x => x.ConnectionId == id);
                IEnumerable<User> users = Users.Where(x => x.GroupId == user.GroupId);
                await Clients.All.SendAsync("Notify", $"{user.Name} вошел в чат", $"Подключено({users.Count()}/8)").ConfigureAwait(false);
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
                await Groups.RemoveFromGroupAsync(id, item.GroupId).ConfigureAwait(false);
                IEnumerable<User> users = Users.Where(x => x.GroupId == item.GroupId);
                await Clients.Group(item.GroupId).SendAsync("Notify", $"{item.Name} покинул в чат", $"Подключено({users.Count()}/8)").ConfigureAwait(false);
            }
            await base.OnDisconnectedAsync(exception).ConfigureAwait(false);
        }
    }
}
