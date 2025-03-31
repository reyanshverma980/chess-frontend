import { useEffect, useState } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import useSocket from "../hooks/useSocket";
import { useNavigate } from "react-router";
import GameOver from "@/components/GameOver";
import { SearchLoader } from "@/components/Loader";
import { Piece } from "react-chessboard/dist/chessboard/types";

const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";
const PLAYER_LEFT = "player_left";

type MoveType = {
  from: Square;
  to: Square;
};

const Game = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  const [board, setBoard] = useState(new Chess());
  const [gameStatus, setGameStatus] = useState<"start" | "active" | "over">(
    "start"
  );
  const [side, setSide] = useState<"white" | "black">("white");
  const [result, setResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setGameStatus("active");
          setBoard(new Chess());
          setSide(message.payload.color);
          setIsSearching(false);
          navigate(`/game/${message.payload.gameId}`);
          break;

        case MOVE: {
          const { from, to } = message.payload.move;
          board.move({ from, to });
          setBoard(new Chess(board.fen()));
          break;
        }

        case GAME_OVER:
          setGameStatus("over");
          console.log(message.payload.result);
          if (message.payload.result === "draw") {
            setResult("draw");
          } else {
            setResult(message.payload.result === side ? "win" : "lose");
          }
          break;

        case PLAYER_LEFT:
          setGameStatus("over");
          setResult(message.payload.result && "win");

        default:
          break;
      }
    };

    socket.addEventListener("message", handleMessage);

    // Cleanup on unmount
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, board, navigate]);

  function makeMove(move: MoveType) {
    const result = board.move(move);
    setBoard(new Chess(board.fen())); // Update the board state
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
    });

    if (!move) return false;

    socket?.send(
      JSON.stringify({
        type: MOVE,
        payload: {
          move: {
            from: sourceSquare,
            to: targetSquare,
          },
        },
      })
    );

    return true;
  }

  const isPieceDraggable = ({
    piece,
    sourceSquare,
  }: {
    piece: Piece;
    sourceSquare: Square;
  }) => {
    if (piece[0] === side[0]) {
      return true;
    }

    return false;
  };

  if (!socket) return <div>Connecting...</div>;

  return isSearching ? (
    <SearchLoader />
  ) : (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen p-6 pt-18">
      <div className="w-full max-w-xl shadow-lg rounded-2xl bg-white p-3">
        <Chessboard
          position={board.fen()}
          onPieceDrop={onDrop}
          boardOrientation={side}
          arePiecesDraggable={gameStatus === "active" ? true : false}
          isDraggablePiece={isPieceDraggable}
        />
      </div>

      {gameStatus === "start" && (
        <div className="w-full max-w-2xl flex flex-col items-center justify-center gap-8 mt-10 lg:mt-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Find a Match
          </h1>
          <button
            className="w-fit bg-[#3A813E] text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg flex items-center gap-3 hover:bg-[#2F6A32] hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-xl active:scale-95"
            onClick={() => {
              setIsSearching(true);
              socket.send(
                JSON.stringify({
                  type: INIT_GAME,
                })
              );
            }}
          >
            Start
          </button>
        </div>
      )}

      <GameOver result={result} status={gameStatus} />
    </div>
  );
};

export default Game;
