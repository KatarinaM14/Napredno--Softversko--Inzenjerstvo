using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Neo4jClient;
using Server.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly IGraphClient _client;
        private IConfiguration _config;

        public UserController(IGraphClient client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("LogIn")]
        public async Task<ActionResult> LogIn([FromBody] UserLogIn userLogIn)
        {
            var user = Authenticate(userLogIn.username, userLogIn.password);

            if (user == null)
                return NotFound("User not found");

            var validPassword = BCrypt.Net.BCrypt.Verify(userLogIn.password, user.password);
            if (!validPassword)
                return BadRequest("Not valid password!");

            var token = Generate(user);


            var followers = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWED_BY]->(u2:User)")
                                              .Where("u1.id='" + user.id + "'")
                                              .Return(u2 => u2.As<User>())
                                              .ResultsAsync;

            var following = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWS]->(u2:User)")
                                            .Where("u1.id='" + user.id + "'")
                                            .Return(u2 => u2.As<User>())
                                            .ResultsAsync;

            user.followers = followers.ToList();
            user.following = following.ToList();

            return Ok(new
                {
                    user = user,
                    token = token
                });
            
        }

        [HttpPost]
        [Route("Register")]
        public async Task<ActionResult> Register([FromBody] User user)
        {
           var userExist = await _client.Cypher.Match("(n:User)")
                                               .Where("n.username='" + user.username + "'")
                                               .Return(n => n.As<User>())
                                               .ResultsAsync;
          
            if (!userExist.IsNullOrEmpty())
                return BadRequest("User with that username already exists");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.password);

            Guid myuuid = Guid.NewGuid();
            string idString = myuuid.ToString();

            var newUser = new User
            {
                id = idString,
                firstName = user.firstName,
                lastName = user.lastName,
                username = user.username,
                email = user.email,
                password = hashedPassword,
                role = user.role,
                city = user.city,
                phoneNumber = user.phoneNumber,
                profileImg = user.profileImg
            };

            await _client.Cypher.Create("(u:User $newUser)")
                                .WithParam("newUser", newUser)
                                .ExecuteWithoutResultsAsync();

            var savedUser = await _client.Cypher.Match("(u:User)")
                                               .Where("u.username='" + user.username + "'")
                                               .Return(u => u.As<User>())
                                               .ResultsAsync;

            var savedUser1 = savedUser.First();

            var token = Generate(savedUser1);

            return Ok(new
            {
                user= savedUser1,
                token = token
            });
        }
        private User GetCurrentUser()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if(identity != null)
            {
                var userClaims = identity.Claims;

                return new User
                {
                    username = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value,
                    email = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value,
                    firstName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.GivenName)?.Value,
                    lastName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Surname)?.Value,
                    role = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Role)?.Value
                };
            }
            return null;
        }


        private string Generate(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                   new Claim(ClaimTypes.NameIdentifier, user.username),
                   new Claim(ClaimTypes.Email, user.email),
                   new Claim(ClaimTypes.GivenName, user.firstName),
                   new Claim(ClaimTypes.Surname, user.lastName),
                   new Claim(ClaimTypes.Role, user.role)
            };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private User Authenticate(string username, string password)
        {
            var users = _client.Cypher.Match("(n:User)")
                                               .Where("n.username='" + username + "'")
                                               .Return(n => n.As<User>())
                                               .ResultsAsync;
           
            if(users.Result.IsNullOrEmpty())
            {
                return null;
            }
            return users.Result.First();
        }
        [HttpGet]
        [Route("GetUser/{id}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _client.Cypher.Match("(u:User)")
                                               .Where("u.id='" + id + "'")
                                               .Return(u => u.As<User>())
                                               .ResultsAsync;

            var followers = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWED_BY]->(u2:User)")
                                            .Where("u1.id='" + user.First().id + "'")
                                            .Return(u2 => u2.As<User>())
                                            .ResultsAsync;

            var following = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWS]->(u2:User)")
                                            .Where("u1.id='" + user.First().id + "'")
                                            .Return(u2 => u2.As<User>())
                                            .ResultsAsync;

            user.First().followers = followers.ToList();
            user.First().following = following.ToList();

            return Ok(user.First());

        }
        [HttpGet]
        [Route("GetUsersForFollow/{id}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetUsersForFollow(string id)
        {
            var users = await _client.Cypher.Match("(u:User)")
                                               .Where("u.id<>'" + id + "'")
                                               .Return(u => u.As<User>())
                                               //.Limit(10)
                                               .ResultsAsync;

            var following = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWS]->(u2:User)")
                                              .Where("u1.id='" + id + "'")
                                              .Return(u2 => u2.As<User>())
                                              .ResultsAsync;
            var usersForFollow = new List<User>();

            foreach(User u in users)
            {
                bool exists = false;
                foreach (User u1 in following)
                {
                    if (u1.id == u.id)
                        exists = true;
                }
                if (!exists)
                {
                    var followers = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWED_BY]->(u2:User)")
                                            .Where("u1.id='" + u.id + "'")
                                            .Return(u2 => u2.As<User>())
                                            .ResultsAsync;

                    var followings = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWS]->(u2:User)")
                                                    .Where("u1.id='" + u.id + "'")
                                                    .Return(u2 => u2.As<User>())
                                                    .ResultsAsync;

                    u.followers = followers.ToList();
                    u.following = followings.ToList();
                    usersForFollow.Add(u);
                }
            }

            return Ok(usersForFollow);

        }

        [HttpGet]
        [Route("GetUsers")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _client.Cypher.Match("(n: User)")
                                                  .Return(n => n.As<User>()).ResultsAsync;

            return Ok(users);
        }

        [HttpPost]
        [Route("GetUsersById")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetUsersById([FromBody] List<string> usersIds)
        {

            List<User> users = new List<User>();

            foreach(var userId in usersIds)
            {
                var user = await _client.Cypher.Match("(u:User)")
                                                   .Where("u.id='" + userId + "'")
                                                   .Return(u => u.As<User>())
                                                   .ResultsAsync;

                if (!user.IsNullOrEmpty())
                    users.Add(user.First());
            }

            return Ok(users);
        }

        [HttpGet]
        [Route("GetFollowers/{id}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetFollowers(string id)
        {

            var currentUser = await _client.Cypher.Match("(u:User)")
                                    .Where("u.id='" + id + "'")
                                    .Return(u => u.As<User>())
                                    .ResultsAsync;
            if (currentUser.IsNullOrEmpty())
                return NotFound($"User not found!");

            var followers = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWED_BY]->(u2:User)")
                                              .Where("u1.id='" + currentUser.First().id + "'")
                                              .Return(u2 => u2.As<User>())
                                              .ResultsAsync;

            return Ok(new
            {
                userId = id,
                followers = followers
            });
        }

        [HttpGet]
        [Route("GetFollowing/{id}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetFollowing(string id)
        {

            var currentUser = await _client.Cypher.Match("(u:User)")
                                    .Where("u.id='" + id + "'")
                                    .Return(u => u.As<User>())
                                    .ResultsAsync;
            if (currentUser.IsNullOrEmpty())
                return NotFound($"User not found!");

            var following = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWS]->(u2:User)")
                                              .Where("u1.id='" + currentUser.First().id + "'")
                                              .Return(u2 => u2.As<User>())
                                              .ResultsAsync;

            return Ok(new
            {
                userId = id,
                following = following
            });
        }
        [HttpGet]
        [Route("GetPosts/{id}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<IActionResult> GetPosts(string id)
        {

            var currentUser = await _client.Cypher.Match("(u:User)")
                                    .Where("u.id='" + id + "'")
                                    .Return(u => u.As<User>())
                                    .ResultsAsync;
            if (currentUser.IsNullOrEmpty())
                return NotFound($"User not found!");

            var posts = await _client.Cypher.Match("(p:Post)<-[r2:CREATED]-(u:User)")
                                              .Where("u.id='" + currentUser.First().id + "'")
                                              .Return(p => p.As<Post>())
                                              .ResultsAsync;

            return Ok(posts);
        }

        [HttpPut]
        [Route("UpdateUser")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> UpdateUser([FromBody] User user)
        {
           
            var users = await _client.Cypher.Match("(u:User)")
                                           .Where("u.id='" + user.id + "'")
                                           .Set("u.firstName='" + user.firstName + "'")
                                           .Set("u.lastName='" + user.lastName + "'")
                                           .Set("u.username='" + user.username + "'")
                                           .Set("u.email='" + user.email + "'")
                                           .Set("u.city='" + user.city + "'")
                                           .Set("u.phoneNumber='" + user.phoneNumber + "'")
                                           .Set("u.biography='" + user.biography + "'")
                                           .Set("u.profileImg='" + user.profileImg + "'")
                                           .Return(u => u.As<User>())
                                           .ResultsAsync;

            var followers = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWED_BY]->(u2:User)")
                                             .Where("u1.id='" + user.id + "'")
                                             .Return(u2 => u2.As<User>())
                                             .ResultsAsync;

            var following = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWS]->(u2:User)")
                                            .Where("u1.id='" + user.id + "'")
                                            .Return(u2 => u2.As<User>())
                                            .ResultsAsync;

            users.First().followers = followers.ToList();
            users.First().following = following.ToList();


            return Ok(users.First());
        }
        [HttpDelete]
        [Route("DeleteUser/{id}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            var user = await _client.Cypher.Match("(u:User)")
                                        .Where("u.id='" + id+"'")
                                         .DetachDelete("u")
                                         .Return(u => u.As<User>())
                                         .ResultsAsync;
            return Ok("User is deleted");
        }

        [HttpPost]
        [Route("FollowUser/{followedUserId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> FollowUser(string followedUserId, [FromBody] User user)
        {
            if (user.id == followedUserId)
                return BadRequest("You can't follow yourself!");

            var currentUser = await _client.Cypher.Match("(u:User)")
                                     .Where("u.id='" + user.id + "'")
                                     .Return(u => u.As<User>())
                                     .ResultsAsync;
            if (currentUser.IsNullOrEmpty())
                return NotFound($"User not found!");

            var followedUser = await _client.Cypher.Match("(u:User)")
                                     .Where("u.id='" + followedUserId + "'")
                                     .Return(u => u.As<User>())
                                     .ResultsAsync;
            if (followedUser.IsNullOrEmpty())
                return NotFound($"User you want to follow is not found!");


            var alreadyFollowed = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWS]->(u2:User)")
                                              .Where("u1.id='" + currentUser.First().id + "' AND u2.id='" + followedUser.First().id + "'")
                                              .Return(u2 => u2.As<User>())
                                              .ResultsAsync;

            if (!alreadyFollowed.IsNullOrEmpty())
                return BadRequest($"You already follow user {alreadyFollowed.First().username}!");

            var followed = await _client.Cypher.Match("(u1:User), (u2:User)")
                                      .Where("u1.id='" + currentUser.First().id + "' AND u2.id='" + followedUser.First().id + "'")
                                      .Create("(u1)-[r1:FOLLOWS]->(u2)")
                                      .Return(u1 => u1.As<User>())
                                      .ResultsAsync;


            var alreadyFollowedBy = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWED_BY]->(u2:User)")
                                              .Where("u1.id='" + followedUser.First().id + "' AND u2.id='" + currentUser.First().id + "'")
                                              .Return(u2 => u2.As<User>())
                                              .ResultsAsync;

            if (!alreadyFollowedBy.IsNullOrEmpty())
                return BadRequest($"You are already followed by user {alreadyFollowedBy.First().username}!");

            var following = await _client.Cypher.Match("(u1:User), (u2:User)")
                                      .Where("u1.id='" + followedUser.First().id + "' AND u2.id='" + currentUser.First().id + "'")
                                      .Create("(u1)-[r1:FOLLOWED_BY]->(u2)")
                                      .Return(u1 => u1.As<User>())
                                      .ResultsAsync;

            return Ok(new
            {
                userId = user.id,
                followedUser = followedUser.First()
            });
        }

        [HttpPost]
        [Route("FollowedBy/{currentUserId}/{followedBydUserId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> FollowedBy(string currentUserId, string followedBydUserId)
        {
            if (currentUserId == followedBydUserId)
                return BadRequest("You can't follow yourself!");

            var currentUser = await _client.Cypher.Match("(u:User)")
                                     .Where("u.id='" + currentUserId + "'")
                                     .Return(u => u.As<User>())
                                     .ResultsAsync;
            if (currentUser.IsNullOrEmpty())
                return NotFound($"User not found!");

            var followedByUser = await _client.Cypher.Match("(u:User)")
                                     .Where("u.id='" + followedBydUserId + "'")
                                     .Return(u => u.As<User>())
                                     .ResultsAsync;
            if (followedByUser.IsNullOrEmpty())
                return NotFound($"User you are followed by is not found!");


            var alreadyFollowedBy = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWED_BY]->(u2:User)")
                                              .Where("u1.id='" + currentUser.First().id + "' AND u2.id='" + followedByUser.First().id + "'")
                                              .Return(u2 => u2.As<User>())
                                              .ResultsAsync;

            if (!alreadyFollowedBy.IsNullOrEmpty())
                return BadRequest($"You already follow user {alreadyFollowedBy.First().username}!");

            var following = await _client.Cypher.Match("(u1:User), (u2:User)")
                                      .Where("u1.id='" + currentUser.First().id + "' AND u2.id='" + followedByUser.First().id + "'")
                                      .Create("(u1)-[r1:FOLLOWED_BY]->(u2)")
                                      .Return(u1 => u1.As<User>())
                                      .ResultsAsync;



            return Ok($"You are now followed by user {followedByUser.First().username}.");
        }
        [HttpPost]
        [Route("UnfollowUser/{unfollowedUserId}")]
        [Authorize(Roles = "Administrator,User")]
        public async Task<ActionResult> UnfollowUser(string unfollowedUserId, [FromBody] User user)
        {
            if (user.id == unfollowedUserId)
                return BadRequest("You can't unfollow yourself!");

            var currentUser = await _client.Cypher.Match("(u:User)")
                                     .Where("u.id='" + user.id + "'")
                                     .Return(u => u.As<User>())
                                     .ResultsAsync;
            if (currentUser.IsNullOrEmpty())
                return NotFound($"User not found!");

            var unfollowedUser = await _client.Cypher.Match("(u:User)")
                                     .Where("u.id='" + unfollowedUserId + "'")
                                     .Return(u => u.As<User>())
                                     .ResultsAsync;
            if (unfollowedUser.IsNullOrEmpty())
                return NotFound($"User you want to unfollow is not found!");


            var alreadyFollowed = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWS]->(u2:User)")
                                              .Where("u1.id='" + currentUser.First().id + "' AND u2.id='" + unfollowedUser.First().id + "'")
                                              .Return(u2 => u2.As<User>())
                                              .ResultsAsync;

            if (alreadyFollowed.IsNullOrEmpty())
                return BadRequest($"You can't unfollow user that you don't follow!");

            var unfollowed = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWS]->(u2:User)")
                                      .Where("u1.id='" + currentUser.First().id + "' AND u2.id='" + unfollowedUser.First().id + "'")
                                      .Delete("r1")
                                      .Return(u2 => u2.As<User>())
                                      .ResultsAsync;

            var unfollowing = await _client.Cypher.Match("(u1:User)-[r1:FOLLOWED_BY]->(u2:User)")
                                      .Where("u1.id='" + unfollowedUser.First().id + "' AND u2.id='" + currentUser.First().id + "'")
                                      .Delete("r1")
                                      .Return(u2 => u2.As<User>())
                                      .ResultsAsync;

            return Ok(new
            {
                userId = user.id,
                unfollowedUser = unfollowed.First()
            });
        }
    }
}
