const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API to Get all players details

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team`;
  const dbObject = await db.all(getPlayersQuery);

  response.send(dbObject);
});

//API To Add player
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO cricket_team (player_name,jersey_number,role) 
                                VALUES ('${playerName}','${jerseyNumber}','${role}');`;

  await db.run(addPlayerQuery);

  response.send(playerDetails);
});

//API to get single player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id = '${playerId[1]}';`;
  const player = await db.get(getPlayerQuery);
  const playerAns = {
    playerId: player.player_id,
    playerName: player.player_name,
    jerseyNumber: player.jersey_number,
    role: player.role,
  };
  response.send(playerAns);
});

//API to Update details

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const updatePlayerQuery = `UPDATE cricket_team 
        SET player_name = '${player_name}',
            jersey_number = '${jersey_number}',
            role = '${role}'
            WHERE player_id = '${playerId[1]}';`;
  await db.run(updatePlayerQuery);
  response.send(playerDetails);
});

module.exports = app;
