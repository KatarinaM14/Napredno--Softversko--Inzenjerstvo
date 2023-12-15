using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Server.Models;
using Server.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ChatService _chatService;
        public ChatHub(ChatService chatService)
        {
            _chatService = chatService;
        }

        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Come2Chat");
            await Clients.Caller.SendAsync("UserConnected");
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Come2Chat");
            var user = _chatService.GetUserByConnectionId(Context.ConnectionId);
            _chatService.RemoveUserFromList(user);
            await DisplayOnlineUsers();
         
            await base.OnDisconnectedAsync(exception);
        }

        public async Task AddUserConnection(string userId)
        {
            _chatService.AddUserConnection(userId, Context.ConnectionId);
            await DisplayOnlineUsers();
        }
        public async Task ReceiveMessage(string sender, string receiver, string message)
        {
            await Clients.Group("Come2Chat").SendAsync("NewMessage", sender, receiver, message);
        }
        public async Task CeatePrivateChat(string message, string sender, string receiver)
        {
            string privateGroupName = GetPrivateGroupName(sender, receiver);
            await Groups.AddToGroupAsync(Context.ConnectionId, privateGroupName);
            var toConnectionId = _chatService.GetUserByConnectionIdByUser(receiver);
            await Groups.AddToGroupAsync(toConnectionId, privateGroupName);

            await Clients.Client(toConnectionId).SendAsync("OpenPrivateChat", message, sender, receiver);
        }

        public async Task ReceivePrivateMessage(string message, string sender, string receiver)
        {
            string privateGroupName = GetPrivateGroupName(sender, receiver);
            await Clients.Group(privateGroupName).SendAsync("NewPrivateMessage", message, sender, receiver);
        }
        public async Task RemovePrivateChat(string from, string to)
        {
            string privateGroupName = GetPrivateGroupName(from, to);
            await Clients.Group(privateGroupName).SendAsync("ClosePrivateChat");

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, privateGroupName);
            var toConnectionId = _chatService.GetUserByConnectionIdByUser(to);
            await Groups.RemoveFromGroupAsync(toConnectionId, privateGroupName);

        }

        public async Task SendMessageToUser(string message, string senderId, string receiverId)
        {
            string privateGroupName = GetPrivateGroupName(senderId, receiverId);
            await Groups.AddToGroupAsync(Context.ConnectionId, privateGroupName);
            var toConnectionId = _chatService.GetUserByConnectionIdByUser(receiverId);
            await Groups.AddToGroupAsync(toConnectionId, privateGroupName);

            await Clients.Client(toConnectionId).SendAsync("NewPrivateMessage", message, senderId, receiverId);
        }
        
        public async Task DisplayOnlineUsers()
        {
            var onlineUsers = _chatService.GetOnlineUsers();
            await Clients.Groups("Come2Chat").SendAsync("OnlineUsers", onlineUsers);
        }
        private string GetPrivateGroupName(string from, string to)
        {
            var stringCompare = string.CompareOrdinal(from, to) < 0;
            return stringCompare ? $"{from}-{to}" : $"{to}-{from}";
        }
    }
}
