const dotenv = require("dotenv");
const { v4: uuid } = require("uuid");
const WebSocket = require("ws");
const querystring = require("querystring");
dotenv.config();
const { startGeminiChat } = require("../gemini/chat.js");
const chatHistModel = require("../models/ChatHist.js");

const connectWithChatBot = async (req, res) => {
  try {
    if (req.userId === undefined) {
      res.status(400).json({ error: "User ID is undefined." });
      return;
    }
    console.log("user mil gaya");
    const foundHist = await chatHistModel
      .find({ userId: req.userId })
      .sort({ timestamp: 1 });

    let foundHistForGemini = [];
    for (let conv of foundHist) {
      foundHistForGemini.push({
        role: "user",
        parts: [
          {
            text: conv.prompt,
          },
        ],
      });
      foundHistForGemini.push({
        role: "model",
        parts: [
          {
            text: conv.response,
          },
        ],
      });
    }
    console.log("gemini ki history", foundHistForGemini);

    const roomId = uuid();
    const websocketserverLink = `${
      process.env.WEBSOCKET_SERVER
    }?${querystring.stringify({
      id: roomId,
      isServer: true,
    })}`;

    const wss = new WebSocket(websocketserverLink);

    wss.on("open", () => {
      console.log("WebSocket connection opened");
      res.status(200).json({ chatId: roomId });
      wss.send(JSON.stringify({ type: "server:connected" }));
    });

    console.log("chat se pehle");
    const chat = startGeminiChat(foundHistForGemini);
    console.log("chat ke bad", chat);

    wss.on("message", async (data) => {
      try {
        data = JSON.parse(data.toString());

        if (data?.type === "client:chathist") {
          wss.send(
            JSON.stringify({ type: "server:chathist", data: foundHist })
          );
        } else if (data?.type === "client:prompt") {
          if (data.prompt === undefined) {
            res.status(400).json({ error: "Prompt is undefined." });
            return;
          }

          const result = await chat.sendMessageStream(data.prompt);
          let respText = "";
          wss.send(JSON.stringify({ type: "server:response:start" }));

          for await (const chunk of result.stream) {
            const chunkText = chunk.text();

            wss.send(
              JSON.stringify({
                type: "server:response:chunk",
                chunk: chunkText,
              })
            );
            respText += chunkText;
          }
          wss.send(JSON.stringify({ type: "server:response:end" }));

          await chatHistModel.create({
            userId: req.userId,
            prompt: data.prompt,
            response: respText,
          });
        }
      } catch (error) {
        console.error(error);
      }
    });

    console.log("chat ke bad mein");

    wss.on("close", () => {
      console.log("WebSocket connection closed");
    });

    wss.on("error", (error) => {
      console.error("WebSocket Error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    });

    console.log("last mein hu");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { connectWithChatBot };

const deleteChatHistory = async (req, res) => {
  try {
    if (req.userId === undefined) {
      res.status(400).json({ error: "User ID is undefined." });
      return;
    }

    await chatHistModel.deleteMany({ userId: req.userId });

    res.status(200).json({ message: "Chat history deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { deleteChatHistory };
