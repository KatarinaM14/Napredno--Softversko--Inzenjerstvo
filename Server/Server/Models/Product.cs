using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Models
{
    public class Product
    {
        public string id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public double price { get; set; }
        public bool availability { get; set; }
    }
}
