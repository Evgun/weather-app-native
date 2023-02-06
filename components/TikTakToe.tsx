import { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { io, Socket } from "socket.io-client";
import { Text } from "./Themed";

function useSocket(url: string) {
  const [socket, setSocket] = useState<Socket>(null!);

  useEffect(() => {
    const socketIo = io(url);

    setSocket(socketIo);

    function cleanup() {
      socketIo.disconnect();
    }
    return cleanup;
  }, [url]);

  return socket;
}

export default function TicTacToe() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [users, setUsers] = useState([]);
  const [field, setField] = useState([]);
  const [wins, setWins] = useState([0, 0]);
  const [inputCode, setInputCode] = useState("");
  const socket = useSocket("http://192.168.0.105:3002");

  useEffect(() => {
    function socketRoomCode(code: string) {
      setCode(code);
      setIsOpen(false);
    }

    function socketError(error: string) {
      setError(error);
    }

    function socketSetUsers(users: []) {
      setUsers(users);
    }

    function socketSetField(field: []) {
      setField(field);
    }

    function socketWinner(key: number) {
      if (key === 1) {
        setWins([(wins[0] += 1), wins[1]]);
      } else if (key === 0) {
        setWins([wins[0], (wins[1] += 1)]);
      }
    }

    if (socket) {
      socket.emit("connection");
      socket.on("roomCode", socketRoomCode);
      socket.on("error", socketError);
      socket.on("setUsers", socketSetUsers);
      socket.on("setField", socketSetField);
      socket.on("winner", socketWinner);
    }
  }, [socket]);

  function setChecker(item: number) {
    if (item === 1) {
      return "✕";
    }
    if (item === 0) {
      return "◯";
    }
    return "";
  }

  return (
    <View>
      {!code ? (
        <>
          <View>
            <Pressable
              style={styles.button}
              onPress={() => socket.emit("newGame")}
            >
              <Text style={styles.buttonText}>Create room</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => setIsOpen((p) => !p)}
            >
              <Text style={styles.buttonText}>Join room</Text>
            </Pressable>
          </View>
          {isOpen && (
            <View>
              <Text style={styles.enterText}>Enter session code</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Session code"
                  style={[styles.input, error && styles.inputError]}
                  value={inputCode}
                  onChangeText={(e) => setInputCode(e)}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
              </View>
              <Pressable
                style={styles.button}
                onPress={() => socket.emit("joinGame", inputCode)}
              >
                <Text style={styles.buttonText}>Enter the room</Text>
              </Pressable>
            </View>
          )}
        </>
      ) : (
        <View>
          <Text style={styles.roomCode}>{code}</Text>
          {users.length === 2 ? (
            <>
              <View>
                <Text>Users:</Text>
                {users.map((item) => (
                  <Text style={styles.player} key={item}>
                    {item}
                  </Text>
                ))}
              </View>
              <View>
                <Text style={styles.raiting}>{`${wins[0]}/${wins[1]}`}</Text>
                <View style={styles.gameField}>
                  {field.map((item, id) => (
                    <Pressable
                      style={styles.cell}
                      key={id}
                      onPress={() => socket.emit("makeMove", id)}
                    >
                      <Text style={styles.cellMark}>{setChecker(item)}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <Text>Waiting for users...</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "grey",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
  },
  enterText: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#fff",
    height: 40,
    paddingLeft: 10,
  },
  inputError: {
    borderStyle: "solid",
    borderColor: "red",
    borderWidth: 2,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  roomCode: {
    marginBottom: 10,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
  player: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
  },
  raiting: {
    textAlign: "center",
    marginBottom: 5,
  },
  gameField: {
    aspectRatio: 1,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
  },
  cell: {
    aspectRatio: 1,
    width: "33.3%",
    borderStyle: "solid",
    borderColor: "grey",
    borderWidth: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cellMark: {
    fontSize: 48,
  },
});
