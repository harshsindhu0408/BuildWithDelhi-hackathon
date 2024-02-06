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
  const [chatGroups, setChatGroups] = useState([]);
  const navigate = useNavigate();
  const { logout, loggedIn } = useContext(LoginContext);
  const mainRef = useRef();
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
  }, [chatGroups]);


  useEffect(() => {
    async function fetchData() {
      try {
        const chatData = await axios.get(
          process.env.REACT_APP_API_LINK + "/chat",
          {
            withCredentials: true,
            params: {
              chatGroup: 'bar',
            },
          },
        );
        const chatGroupsData = await axios.get(
          process.env.REACT_APP_API_LINK + "/chat-groups",
          {
            withCredentials: true,
          }
        );

        setChatId(chatData.data.chatId);
        setChatGroups(chatGroupsData.data);
      } catch (error) {
        setChatState("busy");
        console.log("Error Fetching Data");
        setChatError(true);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (chatId !== null) {
      let wss = new WebSocket(`ws://localhost:8802?id=${chatId}`);
      wss.addEventListener("open", () => {
        console.log("Websocket connected");
        ws.current.send(JSON.stringify({ type: "client:connected" }));
        ws.current.send(JSON.stringify({ type: "client:chathist" }));
      });

      // ... (rest of the code remains the same)

      ws.current = wss;
    } else {
      setChatState("busy");
      setChatInit(true);
      setChatError(true);
    }
  }, [chatId]);

  const handleClick = () => {
    setChatGroups((prevGroups) => [
      ...prevGroups,
      { name: "New Group", chatHistory: [{ message, own: true, isLoading: true }] },
    ]);

    ws.current?.send(
      JSON.stringify({
        type: "client:prompt",
        prompt: message,
      })
    );

    setMessage("");
    setChatState("busy");
    setChatGroups((prevGroups) => [
      ...prevGroups,
      { name: "New Group", chatHistory: [{ message: "", own: false, isLoading: true }] },
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
          !chatInit || chatGroups.length === 0
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
            {chatInit && chatGroups.length === 0 && (
              <div className={styles.emptyChat}>
                No Previous Chat History!
                <br />
                Chat with me now.
              </div>
            )}
            {chatInit &&
              chatGroups &&
              chatGroups.map((group, index) => (
                <div key={index}>
                  <h3>{group.name}</h3>
                  {group.chatHistory.map((chat, i) => (
                    <Chat
                      text={chat.message}
                      own={chat.own}
                      key={i}
                      isLoading={chat.isLoading ? true : false}
                    />
                  ))}
                </div>
              ))}
          </div>
        )}
      </main>
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
