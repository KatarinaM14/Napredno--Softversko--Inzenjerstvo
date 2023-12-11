using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Models
{
    public class Message
    {
        public string id { get; set; }
        public Conversation conversation { get; set; }
        public User sender { get; set; }
        public User receiver { get; set; }
        public string message { get; set; }
    }
}
