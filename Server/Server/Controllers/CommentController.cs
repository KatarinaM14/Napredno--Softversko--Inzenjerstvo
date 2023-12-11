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
    public class CommentController : Controller
    {
        private readonly IGraphClient _client;

        public CommentController(IGraphClient client)
        {
            _client = client;
        }

        [HttpPost]
        [Route("AddComment")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> AddComment([FromBody] Comment comment)
        {
            var post = await _client.Cypher.Match("(p:Post)")
                                       .Where("p.id='" + comment.post.id + "'")
                                       .Return(p => p.As<Post>())
                                       .ResultsAsync;
            if (post.IsNullOrEmpty())
                return NotFound($"Post not found!");

            var user = await _client.Cypher.Match("(u:User)")
                                     .Where("u.id='" + comment.user.id + "'")
                                     .Return(u => u.As<User>())
                                     .ResultsAsync;
            if (user.IsNullOrEmpty())
                return NotFound($"User not found!");

            Guid myuuid = Guid.NewGuid();
            string idString = myuuid.ToString();

            var newComment = new Comment
            {
                id = idString,
                description = comment.description,
                createdAt = DateTime.Now
            };

            await _client.Cypher.Create("(c:Comment $newComment)")
                              .WithParam("newComment", newComment)
                              .ExecuteWithoutResultsAsync();

            var comm = await _client.Cypher.Match("(p:Post), (c:Comment), (u:User)")
                                    .Where("p.id='" + post.First().id + "' AND c.id='" + idString + "' AND u.id='" + user.First().id + "'")
                                     .Create("(p)-[r1:HAS_A_COMMENT]->(c)-[r2:IS_CREATED_BY]->(u)")
                                     .Return(c => c.As<Comment>())
                                     .ResultsAsync;

            comm.First().user = user.First();
            comm.First().post = post.First();

            return Ok(new
            {
                postId = post.First().id,
                comment = comm.First()
            });
        }

        [HttpGet]
        [Route("GetComments/{postId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetComments(string postId)
        {
            var post = await _client.Cypher.Match("(p:Post)")
                                       .Where("p.id='" + postId + "'")
                                       .Return(p => p.As<Post>())
                                       .ResultsAsync;
            if (post.IsNullOrEmpty())
                return NotFound("Post not found!");

            var comments = await _client.Cypher.Match("(p:Post)-[r1:HAS_A_COMMENT]->(c:Comment)")
                                               .Where("p.id='" + post.First().id + "'")
                                               .Return(c => c.As<Comment>())
                                               .ResultsAsync;

            if (comments.IsNullOrEmpty())
                return NotFound("Comments not found!");

            return Ok(comments);
        }

        [HttpPost]
        [Route("LikeComment/{commentId}/{userId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> LikeComment(string commentId, string userId)
        {

            var comment = await _client.Cypher.Match("(c:Comment)")
                                       .Where("c.id='" + commentId + "'")
                                       .Return(c => c.As<Comment>())
                                       .ResultsAsync;
            if (comment.IsNullOrEmpty())
                return NotFound($"Comment not found!");

            var user = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + userId + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (user.IsNullOrEmpty())
                return NotFound($"User not found!");

            await _client.Cypher.Match("(c:Comment), (u:User)")
                                     .Where("c.id='" + comment.First().id + "' AND u.id='" + user.First().id + "'")
                                      .Create("(c)-[r1:IS_LIKED_BY]->(u)")
                                      .ExecuteWithoutResultsAsync();

            return Ok("Comment is liked!");
        }

        [HttpPost]
        [Route("TagUserInComment/{commentId}/{userId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> TagUserInComment(string commentId, string userId)
        {
            var comment = await _client.Cypher.Match("(c:Comment)")
                                       .Where("c.id='" + commentId + "'")
                                       .Return(c => c.As<Comment>())
                                       .ResultsAsync;
            if (comment.IsNullOrEmpty())
                return NotFound($"Comment not found!");

            var user = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + userId + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (user.IsNullOrEmpty())
                return NotFound($"User not found!");
          
            await _client.Cypher.Match("(c:Comment), (u:User)")
                                        .Where("c.id='" + comment.First().id + "' AND u.id='" + user.First().id + "'")
                                        .Create("(c)<-[r1:IS_TAGGED_IN]-(u)")
                                        .ExecuteWithoutResultsAsync();

                return Ok("User is tagged in the comment!"); 
        }
        [HttpPut]
        [Route("UpdateCommentDescription/{commentId}/{description}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> UpdateCommentDescription(string commentId, string description)
        {
            var comment = await _client.Cypher.Match("(c:Comment)")
                                            .Where("c.id='" + commentId + "'")
                                            .Set("c.description='" + description + "'")
                                            .Return(c => c.As<Comment>())
                                            .ResultsAsync;
            return Ok(comment.First());
        }
    }
}
