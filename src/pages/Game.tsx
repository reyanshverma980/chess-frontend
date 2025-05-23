import { useEffect, useRef, useState } from "react";
import { Chess, ShortMove, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
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
import { useAuth } from "@/context/AuthContext";

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
  const { socket } = useAuth();
  const navigate = useNavigate();

  const [fen, setFen] = useState<string | undefined>();
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Start);
  const [side, setSide] = useState<"white" | "black">("white");
  const [result, setResult] = useState<Result>();
  const [isSearching, setIsSearching] = useState(true);

  const boardRef = useRef(new Chess());
  const gameStatusRef = useRef(gameStatus);
  const sideRef = useRef<"white" | "black">("white");

  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  useEffect(() => {
    if (fen) {
      boardRef.current.load(fen);
    }
  }, [fen]);

  useEffect(() => {
    sideRef.current = side;
  }, [side]);

  useEffect(() => {
    if (!socket) return;

    socket.on(WSMessageType.INIT_GAME, (data) => {
      socket.emit(WSMessageType.JOIN_GAME_ROOM, data.payload.gameId);
      setGameStatus(GameStatus.Active);
      setSide(data.payload.side);
      boardRef.current = new Chess();
      setFen(boardRef.current.fen());
      setIsSearching(false);
      navigate(`/game/${data.payload.gameId}`);
    });

    socket.on(WSMessageType.RECONNECT, (data) => {
      setIsSearching(false);
      setGameStatus(GameStatus.Active);
      setSide(data.payload.side);
      setFen(data.payload.fen);
    });

    socket.on(WSMessageType.MOVE, (data) => {
      const { from, to, promotion } = data.payload.move;
      boardRef.current.move({ from, to, promotion });
      setFen(boardRef.current.fen());
    });

    socket.on(WSMessageType.GAME_OVER, (data) => {
      const gameResult = data.payload.result;
      setGameStatus(GameStatus.Over);
      if (gameResult === Result.Draw) {
        setResult(Result.Draw);
      } else {
        setResult(gameResult === sideRef.current ? Result.Win : Result.Lose);
      }
    });

    socket.on(WSMessageType.PLAYER_LEFT, () => {
      if (gameStatusRef.current !== GameStatus.Over) {
        setGameStatus(GameStatus.Over);
        setResult(Result.Win);
      }
    });

    return () => {
      socket.off(WSMessageType.INIT_GAME);
      socket.off(WSMessageType.RECONNECT);
      socket.off(WSMessageType.MOVE);
      socket.off(WSMessageType.GAME_OVER);
      socket.off(WSMessageType.PLAYER_LEFT);
    };
  }, [socket]);

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

    socket?.emit(WSMessageType.MOVE, {
      payload: {
        move: {
          from: sourceSquare,
          to: targetSquare,
        },
      },
    });

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

    socket?.emit(WSMessageType.MOVE, {
      payload: {
        move: {
          from,
          to,
          promotion: piece[1].toLowerCase() as PromotionPiece,
        },
      },
    });

    return true;
  };

  const isPieceDraggable = ({ piece }: { piece: Piece }) => {
    if (piece[0] === side?.[0] && piece[0] === boardRef.current.turn()) {
      return true;
    }

    return false;
  };

  if (!socket) return <SocketStatus />;
  if (!fen) return <SearchLoader />;

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

      {gameStatus === "over" && <GameOver result={result} />}
    </div>
  );
};

export default Game;
