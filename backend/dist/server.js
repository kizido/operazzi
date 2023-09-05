"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 5000;
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    console.log("Server running on port: " + port);
});

/*
MONGO_CONNECTION_STRING=mongodb+srv://kizido:Xiiq0PHcTxVeFE63@operazzicluster.shyjeaa.mongodb.net/operazzi_app?retryWrites=true&w=majority
PORT=5000
*/
