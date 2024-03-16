import { useNavigate } from "react-router-dom";
import { Logo } from "../../svgs/logoSVG";
import styles from "./message.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import LoginContext from "../../context/context";

function Chat({ text, own, isLoading = false }) {
  return (
    <div className={`${styles.chat} ${own && styles.own}`}>
      <Markdown>{text}</Markdown>
      {isLoading && <div className={styles.loadCursor}></div>}
    </div>
  );
}

function LoaderRipple() {
  return (
    <div className={styles["lds-ripple"]}>
      <div></div>
      <div></div>
    </div>
  );
}

function Message() {
  const [chatId, setChatId] = useState(null);
  const navigate = useNavigate();
  const { logout, loggedIn } = useContext(LoginContext);
  const mainRef = useRef();
  const [chat, setChat] = useState([]);
  const [chatState, setChatState] = useState("busy");
  const [chatInit, setChatInit] = useState(false);
  const [chatError, setChatError] = useState(false);
  const [message, setMessage] = useState("");
  let ws = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      const container = mainRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await axios.get(process.env.REACT_APP_API_LINK + "/chat", {
          withCredentials: true,
        });
        setChatId(data.data.chatId);
      } catch (error) {
        setChatState("busy");
        console.log("Error Fetching Data");
        setChatError(true);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function isUser() {
      try {
        const user = await axios.get(
          process.env.REACT_APP_API_LINK + "/isUser",
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.log(error.message);
        navigate("/login");
      }
    }
    isUser();
  }, []);

  useEffect(() => {
    if (chatId !== null) {
      //make a websocket connection here
      let wss = new WebSocket(`ws://localhost:8802?id=${chatId}`);
      wss.addEventListener("open", () => {
        console.log("Websocket connected");
        ws.current.send(JSON.stringify({ type: "client:connected" }));
        ws.current.send(JSON.stringify({ type: "client:chathist" }));
      });
      wss.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        setChatError(false);

        if (data?.type === "server:chathist") {
          const histdata = data?.data;
          if (!histdata) return;

          for (let conv of histdata) {
            if (conv.prompt) {
              setChat((prevchat) => [
                ...prevchat,
                { message: conv.prompt, own: true },
              ]);
            }
            if (conv.response) {
              setChat((prevchat) => [
                ...prevchat,
                { message: conv.response, own: false },
              ]);
            }
          }

          setChatState("idle");
          setChatInit(true);
        } else if (data?.type === "server:response:start") {
          // setChat((prevchat) => [
          //   ...prevchat,
          //   { message: "", own: false, isLoading: true },
          // ]);
        } else if (data?.type === "server:response:chunk") {
          setChat((prevchat) => {
            return [
              ...prevchat.slice(0, -1),
              {
                message: `${prevchat.at(prevchat.length - 1).message}${
                  data.chunk
                }`,
                own: false,
                isLoading: true,
              },
            ];
          });
        } else if (data?.type === "server:response:end") {
          setChat((prevchat) => {
            return [
              ...prevchat.slice(0, -1),
              {
                message: prevchat.at(prevchat.length - 1).message,
                own: false,
                isLoading: false,
              },
            ];
          });
          setChatState("idle");
        }
      });
      ws.current = wss;
    } else {
      setChatState("busy");
      setChatInit(true);
      setChatError(true);
    }
  }, [chatId]);

  const handleClick = () => {
    setChat((prevchat) => [...prevchat, { message, own: true }]);
    ws.current?.send(
      JSON.stringify({
        type: "client:prompt",
        prompt: message,
      })
    );
    setMessage("");
    setChatState("busy");
    setChat((prevchat) => [
      ...prevchat,
      { message: "", own: false, isLoading: true },
    ]);
  };

  const logoutUser = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_LINK + "/logout",
        {
          withCredentials: true,
        }
      );
      if (data?.msg === "loggedout") {
        logout();
        window.localStorage.clear();
        window.sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
      }
    } catch (error) {
      console.log("Err in logout");
    }
  };

  const clearChatHistoryHandler = async () => {
    setChat([]);
  };

  return (
    <div className={styles.messageContainer}>
      <header>
        <div
          className={styles.logoContainer}
          onClick={() => {
            navigate("/");
          }}
        >
          <Logo />
          <div className={styles.headerText}>
            <h4>BrainLink</h4>
            <h6>
              A virtual confidante fostering mental health through personalized
              chats.
            </h6>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <button
            onClick={() => {
              if (!loggedIn) navigate("/login");
              else {
                navigate("/analysis");
              }
            }}
          >
            Analyse
          </button>

          <button
            onClick={() => {
              if (!loggedIn) navigate("/login");
              else {
                logoutUser();
                navigate("/login");
              }
            }}
          >
            {!loggedIn ? <div>Login</div> : <div>Logout</div>}
          </button>
        </div>
      </header>
      <main
        ref={mainRef}
        style={
          !chatInit || chat.length === 0
            ? {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }
            : {}
        }
      >
        {chatError ? (
          <div className="text-center">
            <div className={styles.emptyChat}>Something went wrong!</div>
            <a style={{ color: "blue", textDecoration: "underline" }}>
              Try again
            </a>
          </div>
        ) : (
          <div>
            {!chatInit && (
              <div className={styles.loadingChatInit}>
                <LoaderRipple />
              </div>
            )}
            {chatInit && chat.length === 0 && (
              <div className={styles.emptyChat}>
                No Previous Chat History!
                <br />
                Chat with me now.
              </div>
            )}
            {chatInit &&
              chat &&
              chat.map((x, i) => {
                return (
                  <Chat
                    text={x.message}
                    own={x.own}
                    key={i}
                    isLoading={x.isLoading ? true : false}
                  />
                );
              })}
          </div>
        )}
      </main>
      <button
        onClick={clearChatHistoryHandler}
        className="py-2 px-4 rounded-md border-gray-800 z-20 border mt-2 mb-2 shadow-xl"
      >
        Clear chat history
      </button>
      <footer>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            disabled={chatState === "busy" ? true : false}
            placeholder={
              chatState === "busy"
                ? "Something went wrong!"
                : "Type your prompt here...."
            }
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="material-symbols-outlined"
            onClick={() => {
              handleClick();
            }}
            disabled={chatState === "busy" ? true : false}
          >
            send
          </button>
        </form>
      </footer>
    </div>
  );
}

export default Message;
