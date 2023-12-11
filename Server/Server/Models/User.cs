using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Models
{
    public class User
    {
        public string id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string username { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string role { get; set; }
        public string city { get; set; }
        public bool isLoggedIn { get; set; }
        public string phoneNumber { get; set; }
        public string profileImg { get; set; }
        public string biography { get; set; }
        public List<Post> likedPosts { get; set; }
        public List<User> followers { get; set; }
        public List<User> following { get; set; }
        public List<Post> posts { get; set; }
        public List<Comment> comments { get; set; }
        public List<Story> stories { get; set; }
        public List<string> webSites { get; set; }
    }
}
