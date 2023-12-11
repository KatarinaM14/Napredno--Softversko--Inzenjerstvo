using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;
        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost]
        [Route("RegisterUser")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> RegisterUser([FromBody] User user)
        {
            if(_chatService.AddUserToList(user.id))
            {
                return NoContent();
            }

            return BadRequest("This name is taken please choose another name!");
        }
    }
}
