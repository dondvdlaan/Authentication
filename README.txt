Building Block Authentication for REACT

A simple login page is built and shall be unlocked by way of a token received
from the CouchDB. The login is checked at the beginning of every component. 

User data, after succesful login, is stored in localStorage of browser, so it will be
available also if user switches to other tab.

Summary:
- REACT, enter "npm start" in ui directory
- Nodejs server, enter "node server.js" in root
- CouchDB for users data storage, starts automatically at localhost:5984
- Authentication by Google Captcha
- User Authentication by email (not finished)

TODOS:
- User "Password forgotten?"

