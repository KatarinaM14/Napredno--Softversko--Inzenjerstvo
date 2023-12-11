using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Models
{
    public class Comment
    {
        public string id { get; set; }
        public string description { get; set; }
        public DateTime createdAt { get; set; }
        public User user { get; set; }
        public Post post { get; set; }
        public List<User> tags { get; set; }
        public List<User> likes { get; set; }
    }
}
