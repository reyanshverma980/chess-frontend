import { useCallback, useEffect, useRef, useState } from "react";
import { Chess, ShortMove, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import useSocket from "../hooks/useSocket";
import GameOver from "@/components/GameOver";
import { SearchLoader } from "@/components/Loader";
import {
  Piece,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";
import { PromotionPiece } from "@/utils/chess";
import { WSMessageType } from "@/types/websocket";
import SocketStatus from "@/components/SocketStatus";
import { useNavigate } from "react-router";

enum GameStatus {
  Start = "start",
  Active = "active",
  Over = "over",
}

enum Result {
  Win = "win",
  Lose = "lose",
  Draw = "draw",
}

const Game = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  const [fen, setFen] = useState(new Chess().fen());
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Start);
  const [side, setSide] = useState<"white" | "black">("white");
  const [result, setResult] = useState<Result>();
  const [isSearching, setIsSearching] = useState(false);

  const gameStatusRef = useRef(gameStatus);
  const boardRef = useRef(new Chess(fen));

  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  useEffect(() => {
    boardRef.current = new Chess(fen);
  }, [fen]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case WSMessageType.INIT_GAME: {
          setGameStatus(GameStatus.Active);
          setSide(message.payload.color);
          setIsSearching(false);
          navigate(`/game/${message.payload.gameId}`);
          break;
        }

        case WSMessageType.MOVE: {
          const { from, to, promotion } = message.payload.move;
          boardRef.current.move({ from, to, promotion });
          setFen(boardRef.current.fen());
          break;
        }

        case WSMessageType.GAME_OVER: {
          setGameStatus(GameStatus.Over);
          if (message.payload.result === Result.Draw) {
            setResult(Result.Draw);
          } else {
            setResult(
              message.payload.result === side ? Result.Win : Result.Lose
            );
          }
          break;
        }

        case WSMessageType.PLAYER_LEFT: {
          if (gameStatusRef.current !== GameStatus.Over) {
            setGameStatus(GameStatus.Over);
            setResult(Result.Win);
          }
          break;
        }

        default:
          break;
      }
    },
    [navigate, side]
  );

  useEffect(() => {
    if (!socket) return;

    socket.addEventListener("message", handleMessage);

    // Cleanup on unmount
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, handleMessage]);

  function makeMove(move: ShortMove) {
    const result = boardRef.current.move(move);
    setFen(boardRef.current.fen());
    return result;
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
    });

    if (!move) return false;

    socket?.send(
      JSON.stringify({
        type: WSMessageType.MOVE,
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

  const onPromotion = (
    piece?: PromotionPieceOption,
    from?: Square,
    to?: Square
  ) => {
    if (!piece || !from || !to) return false;
    const move = makeMove({
      from,
      to,
      promotion: piece[1].toLowerCase() as PromotionPiece,
    });

    if (!move) return false;

    socket?.send(
      JSON.stringify({
        type: WSMessageType.MOVE,
        payload: {
          move: {
            from,
            to,
            promotion: piece[1].toLowerCase() as PromotionPiece,
          },
        },
      })
    );

    return true;
  };

  const isPieceDraggable = ({ piece }: { piece: Piece }) => {
    if (piece[0] === side[0] && piece[0] === boardRef.current.turn()) {
      return true;
    }

    return false;
  };

  if (!socket) return <SocketStatus />;

  return isSearching ? (
    <SearchLoader />
  ) : (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen p-6 pt-18">
      <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl  bg-white p-3">
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          onPromotionPieceSelect={onPromotion}
          boardOrientation={side}
          arePiecesDraggable={gameStatus === "active"}
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
                  type: WSMessageType.INIT_GAME,
                })
              );
            }}
          >
            Start
          </button>
        </div>
      )}

      {gameStatus === "over" && <GameOver result={result} />}
    </div>
  );
};

export default Game;
