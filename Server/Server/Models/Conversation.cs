﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Models
{
    public class Conversation
    {
        public string id { get; set; }
        public List<User> members { get; set; }
    }
}
