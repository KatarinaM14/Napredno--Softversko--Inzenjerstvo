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
    public class StoryController : Controller
    {
        private readonly IGraphClient _client;

        public StoryController(IGraphClient client)
        {
            _client = client;
        }
 
        [HttpPost]
        [Route("CreateStory")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> CreateStory([FromBody] Story story)
        {
            var users = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + story.user.id + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (users.IsNullOrEmpty())
                return NotFound("User not found!");

            var creator = users.First();

            Guid myuuid = Guid.NewGuid();
            string idString = myuuid.ToString();

            var newStory = new Story
            {
                id = idString,
                description = story.description,
                image = story.image,
                createdAt = DateTime.Now,
                location = story.location
            };


            await _client.Cypher.Create("(s:Story $newStory)")
                             .WithParam("newStory", newStory)
                             .ExecuteWithoutResultsAsync();

            var storyUser = await _client.Cypher.Match("(s:Story), (u:User)")
                                        .Where("s.id='" + newStory.id + "' AND u.id='" + creator.id + "'")
                                        .Create("(s)-[r1:STORY_IS_CREATED_BY]->(u)")
                                        .Create("(s)<-[r2:CREATED_STORY]-(u)")
                                        .Return(s =>  s.As<Story>())
                                        .ResultsAsync;

            return Ok(storyUser.First());
        }

        [HttpGet]
        [Route("GetStoriesOfUserAndHisFollowings/{userId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetStoriesOfUserAndHisFollowings(string userId)
        {
            var users = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + userId + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (users.IsNullOrEmpty())
                return NotFound("User not found!");

            var followings = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWS]->(u2:User)")
                                               .Where("u1.id='" + users.First().id + "'")
                                               .Return(u2 => u2.As<User>())
                                               .ResultsAsync;

            var stories = new List<Story>();

            foreach (User u in followings)
            {
                var story = await _client.Cypher.Match("(u:User)-[r1:CREATED_STORY]->(s:Story)")
                                               .Where("u.id='" + u.id + "'")
                                               .Return(s => s.As<Story>())
                                               .OrderBy("s.createdAt DESC")
                                               .Limit(1)
                                               .ResultsAsync;
    
                if (!story.IsNullOrEmpty())
                {
                    story.First().user = u;
                    stories.Add(story.First());
                }
            }

            return Ok(stories);

        }

        [HttpGet]
        [Route("GetLatestStory/{userId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetLatestStory(string userId)
        {
            var users = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + userId + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (users.IsNullOrEmpty())
                return NotFound("User not found!");

            var story = await _client.Cypher.Match("(s:Story)-[r1:STORY_IS_CREATED_BY]->(u:User)")
                                               .Where("u.id='" + users.First().id + "'")
                                               .Return(s => s.As<Story>())
                                               .OrderBy("s.createdAt DESC")
                                               .Limit(1)
                                               .ResultsAsync;

            if (story.IsNullOrEmpty())
                return NotFound("Story not found!");

            story.First().user = users.First();

            return Ok(story.First());
        }
    }
}
