// Local dev only: serves the same Vercel handlers from api/ so dev and prod can't drift.
import "dotenv/config";
import express from "express";
import planner from "./api/planner";
import revise from "./api/revise";

const app = express();
app.use(express.json());

// Express req/res cover everything these handlers use (body, method, status, json).
app.all("/api/planner", planner as unknown as express.RequestHandler);
app.all("/api/revise", revise as unknown as express.RequestHandler);

app.listen(3000, () => console.log("Server started on port 3000"));
