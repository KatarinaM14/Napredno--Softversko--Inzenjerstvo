using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Neo4jClient;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConversationController : Controller
    {
        private readonly IGraphClient _client;

        public ConversationController(IGraphClient client)
        {
            _client = client;
        }
        

        [HttpPost]
        [Route("CreateConversation")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> CreateConversation([FromBody] List<User> users)
        {

            var conversations = await _client.Cypher.Match("(u:User)-[r1:CREATED_CONVERSATION_WITH]->(u2:User)")
                                               .Where("u.id='" + users[0].id + "' AND u2.id='" + users[1].id + "'")
                                               .Return(u => u.As<User>())
                                               .ResultsAsync;

            if (!conversations.IsNullOrEmpty())
                return NotFound("Conversation already created!");

            Guid myuuid = Guid.NewGuid();
            string idString = myuuid.ToString();

            var newConversation = new Conversation
            {
                id = idString,
            };
            newConversation.members = new List<User>();

            await _client.Cypher.Create("(c:Conversation $newConversation)")
                             .WithParam("newConversation", newConversation)
                             .ExecuteWithoutResultsAsync();

            await _client.Cypher.Match("(u1:User), (u2:User)")
                                        .Where("u1.id='" + users[0].id + "' AND u2.id='" + users[1].id + "'")
                                         .Create("(u1)-[r1:CREATED_CONVERSATION_WITH]->(u2)")
                                         .ExecuteWithoutResultsAsync();

            foreach (var user in users)
            {

                await _client.Cypher.Match("(c:Conversation), (u:User)")
                                         .Where("c.id='" + newConversation.id + "' AND u.id='" + user.id + "'")
                                          .Create("(c)-[r1:HAS_A_MEMBER]->(u)")
                                          .ExecuteWithoutResultsAsync();


                newConversation.members.Add(user);
            }
            
            return Ok(newConversation);  
        }

        [HttpGet]
        [Route("GetConversationsOfUser/{userId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetConversationsOfUser(string userId)
        {
            var users = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + userId + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (users.IsNullOrEmpty())
                return NotFound("User not found!");

            var conversations = await _client.Cypher.Match("(c:Conversation)-[r1:HAS_A_MEMBER]->(u:User)")
                                               .Where("u.id='" + userId + "'")
                                               .Return(c => c.As<Conversation>())
                                               .ResultsAsync;

            if (conversations.IsNullOrEmpty())
                return NotFound("Conversations not found!");

            foreach(var c in conversations)
            {
                var members = await _client.Cypher.Match("(c:Conversation)-[r1:HAS_A_MEMBER]->(u:User)")
                                               .Where("c.id='" + c.id+"'")
                                               .Return(u => u.As<User>())
                                               .ResultsAsync;

                c.members = new List<User>();
                foreach(var m in members)
                {
                    c.members.Add(m);
                }
            }

            return Ok(conversations);
        }
        [HttpDelete]
        [Route("DeleteConversation/{id}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> DeleteConversation(string id)
        {
            var conversation = await _client.Cypher.Match("(c:Conversation)")
                                        .Where("c.id='" + id + "'")
                                         .DetachDelete("c")
                                         .Return(c => c.As<Conversation>())
                                         .ResultsAsync;
            return Ok("Conversation is deleted");
        }
    }
}
