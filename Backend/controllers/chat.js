const dotenv = require("dotenv");
const { v4: uuid } = require("uuid");
const WebSocket = require("ws");
const querystring = require("querystring");
dotenv.config();
const { startGeminiChat } = require("../gemini/chat.js");
const chatHistModel = require("../models/ChatHist.js");
const chatGroupSchema = require("../models/ChatGroups.js");

const connectWithChatBot = async (req, res) => {
  const { chatGroup } = req.query;
  try {
    if (!chatGroup) {
      return res.status(422).json({ error: "ChatGroup is required" });
    }
    const isChatGroupAvaialable = await chatGroupSchema.findById(chatGroup);
    if (!isChatGroupAvaialable) {
      return res.status(404).json({ error: "Invalid Chat Group" });
    }
    const foundHist = await chatHistModel
      .find({ chatgroup })
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

    const websocketserverLink = `${
      process.env.WEBSOCKET_SERVER
    }?${querystring.stringify({
      id: chatGroup,
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
            chatgroup,
            prompt: data.prompt,
            response: respText,
            userId: req.userId
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
