Secret Santa's Little Helper
Live Client Link: https://santaserver-8khqgpbvp.vercel.app/

I have created an API and a database to work with this app as well. This is a basic API that allows for information to manipulated by all four CRUD functionalities by the user. My database is a simple one with one table with three attributes: a unique number id, a member name of text, and a number to indicate dollar amount to spend on your Secret Santa drawing. My API allows to call for information on the Heroku link from the /api endpoint. From there, information can be drawn from /members and /members/:memberid. 
Link API/Server Link: https://dry-brook-26909.heroku.com

Secret Santa's Little Helper API - This API is for use with my Secret Santa client.

Members Endpoints:
BASE URL: https://dry-brook-26909.herokuapp.com/api

GET/members

Provides array of all member objects ib the database.
---EXAMPLE REQUEST/RESPONSE---
GET https://dry-brook-26909.herokuapp.com/api/members
HTTP STATUS 200 OK
[
  {
    "id": 1,
    "member_name": "Mom",
    "dollars": 100
  },
  {
    "id": 2,
    "member_name": "Dad",
    "dollars": 100
  }
]

POST/members
Creates a new member object. Requires a request body.
---KEY-----------VALUE--------
member_name: string, required minimum 1 length
dollars: number, positive integer
---EXAMPLE REQUEST/RESPONSE---
POST https://dry-brook-26909.herokuapp.com/api/members
REQ BODY: { "member_name": "Darcey", "dollars": 300000 }

HTTP STATUS 201 Created
Location: https://dry-brook-26909.herokuapp.com/api/members/3
{
  "id": 3,
  "member_name": "Darcey",
  "dollars": 300000
}

PATCH/members/:memberId
Updates member info with matching id with new member name and/or dollar amount. Requires a request body with at least one valid field.
-----KEY-------------VALUE-----------
member_name: string, required minimum 1 length
dollars: number, positive integer
---EXAMPLE REQUEST/RESPONSE---
PATCH https://dry-brook-26909.herokuapp.com/api/members/3
REQ BODY: { "dollars": 400000 }

HTTP STATUS 200 OK
{
  "dollars": 400000
} 

DELETE/members/:memberId
Deletes member with matching id.
---EXAMPLE REQUEST/RESPONSE---
DELETE https://dry-brook-26909.herokuapp.com/api/members/3

HTTP STATUS 200 OK
{} (empty)


This is an app I made that helps families and groups plan for the fun tradition of Secret Santa. It's recommended for groups of three or more to play with in a group setting. In the past, my family has planned our Secret Santa by using scraps of paper in a bowl and it is prone to problems like drawing your own name, and it's just old and clunky. So this is a new way!

The user is able to navigate to a comprehensive group member page that allows them to edit their group roster. This page displays all of the existing users. The user has the option to click on a certain member and this page takes them to a form where they can choose to delete the member or they can change the name, or the dollar amount, or both for the member. Whether they choose edit or delete, when they are done, the app will take them back to the members page. They can then refresh the page by button click to see the updated members. Down below the list of members, there is a link to create a new member. This link allows them to add in a name and  a dollar amount. After submitting this new member, they will be taken back to the members page and have another chance to make sure their group looks correct.

After the user hits 'Start drawing names' they are taken to a page where they can select their own name and see the name of the person they will be buying a gift for. When they see the name, they can press a button to be sent page to the drawing page and then pass the device to the next person set to draw. This prevents that next person in line from seeing who the last person will be buying for, thus keeping the secret. This cycle continues until the last person has drawn. The last page shows the final name to be drawn as well as a button to restart the process and head to home page.