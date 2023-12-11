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
    public class MessageController : Controller
    {
        private readonly IGraphClient _client;

        public MessageController(IGraphClient client)
        {
            _client = client;
        }

        [HttpPost]
        [Route("CreateMessage")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> CreateMessage([FromBody] Message message)
        {

            Guid myuuid = Guid.NewGuid();
            string idString = myuuid.ToString();

            var newMessage = new Message
            {
                id = idString,
                message = message.message,
            };


            await _client.Cypher.Create("(m:Message $newMessage)")
                             .WithParam("newMessage", newMessage)
                             .ExecuteWithoutResultsAsync();

            
            await _client.Cypher.Match("(u:User), (c:Conversation)")
                                         .Where("u.id='" + message.sender.id + "' AND c.id='" + message.conversation.id + "'")
                                          .Create("(u)-[r1:SENT_A_MESSAGE_IN_CONVERSATION]->(c)")
                                          .ExecuteWithoutResultsAsync();
            await _client.Cypher.Match("(u:User), (c:Conversation)")
                                        .Where("u.id='" + message.receiver.id + "' AND c.id='" + message.conversation.id + "'")
                                         .Create("(u)-[r1:RECEIVED_A_MESSAGE_IN_CONVERSATION]->(c)")
                                         .ExecuteWithoutResultsAsync();

            await _client.Cypher.Match("(m:Message), (c:Conversation)")
                                         .Where("m.id='" + newMessage.id + "' AND c.id='" + message.conversation.id + "'")
                                          .Create("(m)-[r1:MESSAGE_IN_CONVERSATION]->(c)")
                                          .ExecuteWithoutResultsAsync();

            await _client.Cypher.Match(" (u:User), (m:Message)")
                                        .Where("u.id='" + message.sender.id + "' AND m.id='" + newMessage.id + "'")
                                         .Create("(u)-[r1:SENDER_IN_MESSAGE]->(m)")
                                         .ExecuteWithoutResultsAsync();

            await _client.Cypher.Match(" (u:User), (m:Message)")
                                       .Where("u.id='" + message.receiver.id + "' AND m.id='" + newMessage.id + "'")
                                        .Create("(u)-[r1:RECEIVER_IN_MESSAGE]->(m)")
                                        .ExecuteWithoutResultsAsync();

            newMessage.sender = message.sender;
            newMessage.receiver = message.receiver;
            newMessage.conversation = message.conversation;


            return Ok(newMessage);
        }

        [HttpGet]
        [Route("GetMessagesInConversation/{conversationId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetMessagesInConversation(string conversationId)
        {
            
            var messages = await _client.Cypher.Match("(m:Message)-[r1:MESSAGE_IN_CONVERSATION]->(c:Conversation)")
                                               .Where("c.id='" + conversationId + "'")
                                               .Return(m => m.As<Message>())
                                               .ResultsAsync;

            if (messages.IsNullOrEmpty())
                return NotFound("Messages not found!");

            foreach(var m in messages)
            {
                var sender = await _client.Cypher.Match("(u:User)-[r1:SENDER_IN_MESSAGE]->(m:Message)")
                                              .Where("m.id='" + m.id + "'")
                                              .Return(u => u.As<User>())
                                              .ResultsAsync;

                var receiver = await _client.Cypher.Match("(u:User)-[r1:RECEIVER_IN_MESSAGE]->(m:Message)")
                                              .Where("m.id='" + m.id + "'")
                                              .Return(u => u.As<User>())
                                              .ResultsAsync;

                if (!sender.IsNullOrEmpty())
                         m.sender = sender.First();

                if (!receiver.IsNullOrEmpty())
                    m.receiver = receiver.First();
            }

            return Ok(messages.Reverse());
        }
    }
}

