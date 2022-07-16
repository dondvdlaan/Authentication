Building Block Authentication for REACT

A simple login page is built and shall be unlocked by way of a token received
from the CouchDB. The login page blocks any route to become active. 

User data, after succesful login, is stored in localStorage of browser, so it will be
available also if user switches to other tab.

Summary:
- REACT, enter "npm start" in ui directory
- Nodejs server, enter "node server.js" in root
- CouchDB for users data storage, starts automatically at localhost:5984

TODOS:
- User Registration
- User Authentication by email
- User Authentication by Captcha
- User "Password forgotten?"

