const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const UNIVERSE_ID = 8823142749;

app.get("/stats", async (req, res) => {
    try {

        // 🔥 dane gry
        const gameRes = await fetch(
            `https://games.roblox.com/v1/games?universeIds=${UNIVERSE_ID}`
        );

        const gameJson = await gameRes.json();
        const game = gameJson.data?.[0];

        if (!game) {
            return res.status(500).json({ error: "no game data" });
        }

        // 👍 votes (czasem działa, czasem Roblox blokuje)
        let likes = 0;
        let dislikes = 0;

        try {
            const voteRes = await fetch(
                `https://games.roblox.com/v1/games/votes?universeIds=${UNIVERSE_ID}`
            );

            const voteJson = await voteRes.json();
            const votes = voteJson.data?.[0];

            likes = votes?.upVotes ?? 0;
            dislikes = votes?.downVotes ?? 0;

        } catch (e) {
            // jeśli Roblox zablokuje votes → nie wywala serwera
            likes = 0;
            dislikes = 0;
        }

        res.json({
            players: game.playing || 0,
            visits: game.visits || 0,
            favorites: game.favoritedCount || 0,
            likes,
            dislikes
        });

    } catch (err) {
        res.status(500).json({ error: "api fail" });
    }
});

app.listen(3000, () => {
    console.log("Serwer działa 🤪🍔");
});