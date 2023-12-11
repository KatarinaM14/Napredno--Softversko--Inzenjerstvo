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
    public class PostController : Controller
    {
        private readonly IGraphClient _client;

        public PostController(IGraphClient client)
        {
            _client = client;
        }

        [HttpGet]
        [Route("GetPosts/{userId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetPosts(string userId)
        {
            var users = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + userId + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (users.IsNullOrEmpty())
                return NotFound("User not found!");

            var posts = await _client.Cypher.Match("(p:Post)-[r1:IS_CREATED_BY]->(u:User)")
                                               .Where("u.id='" + users.First().id + "'")
                                               .Return(p => p.As<Post>())
                                               .ResultsAsync;

            if (posts.IsNullOrEmpty())
                return NotFound("Posts not found!");

            foreach (Post p in posts)
            {
                p.user = users.First();
            
                var liked = await _client.Cypher.Match("(p:Post)-[r1:IS_LIKED_BY]->(u:User)")
                                           .Where("p.id='" + p.id + "'")
                                           .Return(u => u.As<User>())
                                           .ResultsAsync;
                p.likes = new List<User>();
                p.likes = liked.ToList();

                var commented = await _client.Cypher.Match("(p:Post)-[r1:HAS_A_COMMENT]->(c:Comment)")
                                           .Where("p.id='" + p.id + "'")
                                           .Return(c => c.As<Comment>())
                                           .ResultsAsync;
                p.comments = new List<Comment>();
                p.comments = commented.ToList();

                foreach (Comment c in p.comments)
                {  
                    var u1 = await _client.Cypher.Match("(c:Comment)-[r2:IS_CREATED_BY]->(u:User)")
                                           .Where("c.id='" + c.id + "'")
                                           .Return(u => u.As<User>())
                                           .ResultsAsync;
                    c.user = u1.First();
                }       
            }
            return Ok(posts);
        }
        [HttpGet]
        [Route("GetPostsOfUserAndHisFollowings/{userId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetPostsOfUserAndHisFollowings(string userId)
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

            var posts = new List<Post>();

            foreach(User u in followings)
            {
                var post = await _client.Cypher.Match("(u:User)-[r1:CREATED]->(p:Post)")
                                               .Where("u.id='" + u.id + "'")
                                               .Return(p => p.As<Post>())
                                               .OrderBy("p.createdAt DESC")
                                               .Limit(1)
                                               .ResultsAsync;
                if (!post.IsNullOrEmpty())
                {
                    foreach (Post p in post)
                    {
                        p.user = u;
                      
                        var liked = await _client.Cypher.Match("(p:Post)-[r1:IS_LIKED_BY]->(u:User)")
                                                   .Where("p.id='" + p.id + "'")
                                                   .Return(u => u.As<User>())
                                                   .ResultsAsync;
                        p.likes = new List<User>();
                        p.likes = liked.ToList();

                        var commented = await _client.Cypher.Match("(p:Post)-[r1:HAS_A_COMMENT]->(c:Comment)")
                                                   .Where("p.id='" + p.id + "'")
                                                   .Return(c => c.As<Comment>())
                                                   .ResultsAsync;
                        p.comments = new List<Comment>();
                        p.comments = commented.ToList();

                        foreach(Comment c in p.comments)
                        { 
                            var u1 = await _client.Cypher.Match("(c:Comment)-[r2:IS_CREATED_BY]->(u:User)")
                                                   .Where("c.id='" + c.id + "'")
                                                   .Return(u => u.As<User>())
                                                   .ResultsAsync;
                            c.user = u1.First();
                        }
                        posts.Add(p);
                    }
                }
            }
            return Ok(posts);
        }
        [HttpGet]
        [Route("GetPostsOfNotFollowingUsers/{userId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetPostsOfNotFollowingUsers(string userId)
        {
            var user = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + userId + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (user.IsNullOrEmpty())
                return NotFound("User not found!");

            var users = await _client.Cypher.Match("(u:User)")
                                      .Where("u.id<>'" + userId + "'")
                                      .Return(u => u.As<User>())
                                      .ResultsAsync;


            var followings = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWS]->(u2:User)")
                                               .Where("u1.id='" + user.First().id + "'")
                                               .Return(u2 => u2.As<User>())
                                               .ResultsAsync;

            var posts = new List<Post>();
            var notFollowingUsers = new List<User>();

            foreach (User u in users)
            {
               
                bool exists = false;
                foreach(User u1 in followings)
                {
                    if (u1.id == u.id)
                        exists = true;
                }
                if (!exists)
                    notFollowingUsers.Add(u);

            }

            foreach (User u in notFollowingUsers)
            {
                var post = await _client.Cypher.Match("(u:User)-[r1:CREATED]->(p:Post)")
                                               .Where("u.id='" + u.id + "'")
                                               .Return(p => p.As<Post>())
                                               .OrderBy("p.createdAt DESC")
                                               .Limit(10)
                                               .ResultsAsync;
                if (!post.IsNullOrEmpty())
                {
                    foreach (Post p in post)
                    {
                        p.user = u;
                   
                        var liked = await _client.Cypher.Match("(p:Post)-[r1:IS_LIKED_BY]->(u:User)")
                                                   .Where("p.id='" + p.id + "'")
                                                   .Return(u => u.As<User>())
                                                   .ResultsAsync;
                        p.likes = new List<User>();
                        p.likes = liked.ToList();

                        var commented = await _client.Cypher.Match("(p:Post)-[r1:HAS_A_COMMENT]->(c:Comment)")
                                                   .Where("p.id='" + p.id + "'")
                                                   .Return(c => c.As<Comment>())
                                                   .ResultsAsync;
                        p.comments = new List<Comment>();
                        p.comments = commented.ToList();

                        foreach (Comment c in p.comments)
                        {  
                            var u1 = await _client.Cypher.Match("(c:Comment)-[r2:IS_CREATED_BY]->(u:User)")
                                                   .Where("c.id='" + c.id + "'")
                                                   .Return(u => u.As<User>())
                                                   .ResultsAsync;
                            c.user = u1.First();
                        }

                        p.user = u;
                        posts.Add(p);
                    }
                }

            }

            return Ok(posts);

        }

        [HttpGet]
        [Route("GetPost/{postId}/{userId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetPost(string postId, string userId)
        {

            var post = await _client.Cypher.Match("(p:Post)")
                                       .Where("p.id='" + postId + "'")
                                       .Return(p => p.As<Post>())
                                       .ResultsAsync;
            if (post.IsNullOrEmpty())
                return NotFound($"Post not found!");

            var users = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + userId + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (users.IsNullOrEmpty())
                return NotFound("User not found!");

            var posts = await _client.Cypher.Match("(p:Post)-[r1:IS_CREATED_BY]->(u:User)")
                                               .Where("p.id='" + post.First().id + "' AND u.id='"+users.First().id +"'")
                                               .Return(p => p.As<Post>())
                                               .ResultsAsync;

            if (posts.IsNullOrEmpty())
                return NotFound("Post not found!");

            return Ok(posts.First());

        }

        [HttpPost]
        [Route("CreatePost")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> CreatePost([FromBody] Post post)
        {
            var users = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + post.user.id+"'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (users.IsNullOrEmpty())
                return NotFound("User not found!");

            var creator = users.First();

            Guid myuuid = Guid.NewGuid();
            string idString = myuuid.ToString();
           
            var newPost = new Post
            {
                id = idString,
                description = post.description,
                image = post.image,
                createdAt = DateTime.Now,
                location = post.location
            };
           

            await _client.Cypher.Create("(p:Post $newPost)")
                             .WithParam("newPost", newPost)
                             .ExecuteWithoutResultsAsync();

            var postUser = await _client.Cypher.Match("(p:Post), (u:User)")
                                        .Where("p.id='" + newPost.id + "' AND u.id='" + creator.id+"'")
                                        .Create("(p)-[r1:IS_CREATED_BY]->(u)")
                                        .Create("(p)<-[r2:CREATED]-(u)")
                                         .Return(p=>   p.As<Post>())
                                        .ResultsAsync;

            return Ok(postUser.First());
        }

        [HttpPost]
        [Route("AddTaggedUsers/{postId}/{taggedUsers}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> AddTaggedUsers(string postId,List<string> taggedUsers)
        {
            if (!taggedUsers.IsNullOrEmpty())
            {
                foreach (var taggedUserId in taggedUsers)
                {
                    var tagged = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + taggedUserId + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
                    if (tagged.IsNullOrEmpty())
                        return NotFound($"TaggedUser {tagged.First().username} not found!");

                    await _client.Cypher.Match("(p:Post), (u:User)")
                                        .Where("p.id='" + postId + "' AND u.id='" + tagged.First().id + "'")
                                        .Create("(p)<-[r2:IS_TAGGED_ON]-(u)")
                                        .ExecuteWithoutResultsAsync();
                  
                }

                return Ok("Users are tagged on the post!");
            }
            return BadRequest("Error while tagging users");
        }
        [HttpPost]
        [Route("LikePost/{postId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> LikePost(string postId, [FromBody] User userId)
        {

            var post = await _client.Cypher.Match("(p:Post)")
                                       .Where("p.id='" + postId + "'")
                                       .Return(p => p.As<Post>())
                                       .ResultsAsync;
            if (post.IsNullOrEmpty())
                return NotFound($"Post not found!");

            var user = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + userId.id + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (user.IsNullOrEmpty())
                  return NotFound($"User not found!");

            await _client.Cypher.Match("(p:Post), (u:User)")
                                     .Where("p.id='" + post.First().id + "' AND u.id='" + user.First().id + "'")
                                      .Create("(p)-[r2:IS_LIKED_BY]->(u)")
                                      .ExecuteWithoutResultsAsync();

                return Ok(new
                {
                    postId = post.First().id,
                    user = user.First()
                });
        }
        [HttpPost]
        [Route("DislikePost/{postId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> DislikePost(string postId, [FromBody] User userId)
        {

            var post = await _client.Cypher.Match("(p:Post)")
                                       .Where("p.id='" + postId + "'")
                                       .Return(p => p.As<Post>())
                                       .ResultsAsync;
            if (post.IsNullOrEmpty())
                return NotFound($"Post not found!");

            var user = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + userId.id + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (user.IsNullOrEmpty())
                return NotFound($"User not found!");

            var u = await _client.Cypher.Match("(p:Post)-[r2:IS_LIKED_BY]->(u:User)")
                                     .Where("p.id='" + post.First().id + "' AND u.id='" + user.First().id + "'")
                                      .Delete("r2")
                                      .Return(u => u.As<User>())
                                     .ResultsAsync;

            return Ok(new
            {
                postId = post.First().id,
                user = u.First()
            });
        }

        [HttpPost]
        [Route("CommentPost/{postId}/{commentId}/{userId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> CommentPost(string postId, string commentId, string userId)
        {

            var post = await _client.Cypher.Match("(p:Post)")
                                       .Where("p.id='" + postId + "'")
                                       .Return(p => p.As<Post>())
                                       .ResultsAsync;
            if (post.IsNullOrEmpty())
                return NotFound($"Post not found!");

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

            await _client.Cypher.Match("(p:Post), (c:Comment), (u:User)")
                                     .Where("p.id='" + post.First().id + "' AND c.id='" + comment.First().id + "' AND u.id='" + user.First().id + "'")                            
                                      .Create("(p)-[r1:HAS_A_COMMENT]->(c)-[r2:IS_CREATED_BY]->(u)")
                                      .ExecuteWithoutResultsAsync();

            return Ok("Post is commented!");
        }

        [HttpPut]
        [Route("UpdatePostDescription/{description}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> UpdatePostDescription([FromBody] Post post, string description)
        {
            var newPost = await _client.Cypher.Match("(p:Post)")
                                            .Where("p.id='" + post.id + "'")
                                            .Set("p.description='" + description + "'")
                                            .Return(p => p.As<Post>())
                                            .ResultsAsync;

            var user = await _client.Cypher.Match("(u:User)")
                                     .Where("u.id='" + post.user.id + "'")
                                     .Return(u => u.As<User>())
                                     .ResultsAsync;
            newPost.First().user = user.First();
         
            var liked = await _client.Cypher.Match("(p:Post)-[r1:IS_LIKED_BY]->(u:User)")
                                       .Where("p.id='" + post.id + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            newPost.First().likes = new List<User>();
            newPost.First().likes = liked.ToList();

            var commented = await _client.Cypher.Match("(p:Post)-[r1:HAS_A_COMMENT]->(c:Comment)")
                                       .Where("p.id='" + post.id + "'")
                                       .Return(c => c.As<Comment>())
                                       .ResultsAsync;
            newPost.First().comments = new List<Comment>();
            newPost.First().comments = commented.ToList();

            foreach (Comment c in newPost.First().comments)
            {  
                var u1 = await _client.Cypher.Match("(c:Comment)-[r2:IS_CREATED_BY]->(u:User)")
                                       .Where("c.id='" + c.id + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
                c.user = u1.First();
            }

         

            return Ok(newPost.First());
        }

        [HttpDelete]
        [Route("DeletePost/{userId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> DeletePost([FromBody] Post newPost, string userId)
        {
            var post = await _client.Cypher.Match("(p:Post)")
                                       .Where("p.id='" + newPost.id + "'")
                                       .Return(p => p.As<Post>())
                                       .ResultsAsync;
            if (post.IsNullOrEmpty())
                return NotFound($"Post not found!");

            var user = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + userId + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (user.IsNullOrEmpty())
                return NotFound($"User not found!");


            var deletedPost = await _client.Cypher.Match("(p:Post)-[r1:IS_CREATED_BY]->(u:User)")
                                       .Where("p.id='" + newPost.id + "' AND u.id='" + user.First().id + "'")
                                       .Return(p => p.As<Post>())
                                       .ResultsAsync;

            if (deletedPost.IsNullOrEmpty() && user.First().role == "User")
                return BadRequest("You can not delete post that is not created by you!");


            var p = await _client.Cypher.Match("(p:Post)")
                                        .Where("p.id='" + deletedPost.First().id + "'")
                                        .DetachDelete("p")
                                        .Return(p => p.As<Post>())
                                        .ResultsAsync;

            return Ok("Post is deleted!");
        
        }

        [HttpDelete]
        [Route("DeleteCommentFromPost/{postId}/{commentId}/{userId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> DeleteCommentFromPost(string postId,string commentId, string userId)
        {
            var post = await _client.Cypher.Match("(p:Post)")
                                       .Where("p.id='" + postId + "'")
                                       .Return(p => p.As<Post>())
                                       .ResultsAsync;
            if (post.IsNullOrEmpty())
                return NotFound($"Post not found!");

            var user = await _client.Cypher.Match("(u:User)")
                                       .Where("u.id='" + userId + "'")
                                       .Return(u => u.As<User>())
                                       .ResultsAsync;
            if (user.IsNullOrEmpty())
                return NotFound($"User not found!");


            var deletedComment = await _client.Cypher.Match("(p:Post)-[r1:HAS_A_COMMENT]->(c:Comment)-[r2:IS_CREATED_BY]->(u:User)")
                                       .Where("p.id='" + postId + "' AND c.id='" + user.First().id + "' AND u.id='"+user.First().id+ "'")
                                       .Return(c => c.As<Comment>())
                                       .ResultsAsync;

            if (deletedComment.IsNullOrEmpty() && user.First().role == "User")
                return BadRequest("You can not delete comment that is not created by you!");


            var c = await _client.Cypher.Match("(c:Comment)")
                                        .Where("c.id='" + deletedComment.First().id + "'")
                                        .DetachDelete("c")
                                        .Return(c => c.As<Comment>())
                                        .ResultsAsync;

            return Ok("Comment is deleted from post!");

        }
    }
}
