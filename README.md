<img src="icons/icon-left-font-monochrome-black.png" width="200px" />


# Groupomania #

This is the Project 7 of the Junior Web Developer path of Tristan Monget.

### Prerequisites ###

You will need to have Node (https://nodejs.org/en/) and `npm` installed locally on your machine.

### Installation ###

1. Clone this repo.
2. Launch your MySQL server and add new db with name : groupomania. Then open `backend\config\db.config.js` and change config (host, user, password) if necessary.
3. Open the `backend\images` folder and add the "publications" and "comments" folders to the "images" root.
4. Create a new file in backend folder with name ".env" and add it "JWT_SECRET = your secret key" and JWT_EXPIRES_IN= 24h.
5. Open your cmd or powerShell at the root of the frontend folder and do the same for the backend
6. Run `npm install` for both.
7. For the backend run `node server`. the tables will be created automatically in the db. The server should run on `localhost` with default port `3000`. If the server runs on another port for any reason, this is printed to the console when the server starts, e.g. `Listening on port 3001`.
8. For the frontend run `npm run serve`.

### Use ###

Open http://localhost:8080/


⚠ The Moderator will be exclusivelly create on the first inscription ⚠