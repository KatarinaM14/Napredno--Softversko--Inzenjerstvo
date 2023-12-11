using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Services
{
    public class ChatService
    {
        private static readonly Dictionary<string, string> Users = new Dictionary<string,string>();
        public bool AddUserToList(string userToAdd)
        {
            lock(Users)
            {
                foreach(var user in Users)
                {
                    if(user.Key == userToAdd)
                    {
                        return false;
                    }
                }

                Users.Add(userToAdd,null);
                return true;
            }
        }


        public void AddUserConnection(string userId, string connectionId)
        {
            lock(Users)
            {
                if(Users.ContainsKey(userId))
                {
                    Users[userId] = connectionId;
                }
            }
        }

        public string GetUserByConnectionId(string connectionId)
        {
            lock(Users)
            {
                return Users.Where(x => x.Value == connectionId).Select(x => x.Key).FirstOrDefault();
            }
        }

         public string GetUserByConnectionIdByUser(string userId)
         {
            lock(Users)
            {
                return Users.Where(x => x.Key == userId).Select(x => x.Value).FirstOrDefault();
            }
         }

         public void RemoveUserFromList(string userId)
         {
            lock(Users)
            {
                if(Users.ContainsKey(userId))
                {
                    Users.Remove(userId);
                }
            }
         }

        public string[] GetOnlineUsers()
        {
            lock(Users)
            {
                return Users.OrderBy(x=>x.Key).Select(x=>x.Key).ToArray();
            }
        }
    }
}
