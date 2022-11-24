/\*\*

-   server setup
-   install npm packages
-   setup simple MVC pattern
-   implement JWT based authentication token
-   before we save user in DB check if user already exists or not
-   check if user's email is validd by sending verification token as a clickable link to user email
-   for sending email, we will use AWS SES, so we need to signup with AWS
-   once they click, we take them to our react app and take token from the route
-   that token consists, username, email and password
-   once again send that back to the server
-   this time we can save the user into the database
-   that's it for user registration
    \*/

/\*\*

-   login / server
-   create validator
-   create route
-   create controller -> generate token -> send user and token to client as response

-   login / client
-   login form -> show success or error message -> receive user and token from server
    \*/

/\*\*

-   server setup with routes and controllers is done
-   now we are ready to start working on creating the user
-   lets define a schema for the user
-   so a user schema will have username, password, email etc.
-   also it will have some additonal fields like hashed_password, resetPasswordLink etc.
    \*/

/\*\*

-   currently anyone can access these pages
-   lets restrict to only logged in user
-   we could do it client side only
-   using isAuth() -> we could check if cookie and user exists in local stoage and based on that allow access to this page
-   but a better way to do it would be to do it in server side in terms of security and user experience
-   we will make a flexible enough so that it can be re-used in multiple pages

-   we need to create an endpoint in our server
-   that will check that if user is authenticated (we can send token from the cookie to authenticate user)
-   our server will receive jwt/token from sent from the react client
-   if it is valid, then it will allow access or send some success response
-   based on that in the client side we will either allow access or reject
-   so lets go to server and create two end points one for logged in user and another or admin user
    \*/
