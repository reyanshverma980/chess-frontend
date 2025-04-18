import { fetchBestMove } from "@/api/stockfish";
import GameOver from "@/components/GameOver";
import { parseUciMove, PromotionPiece } from "@/utils/chess";
import { Chess, ShortMove, Square } from "chess.js";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import {
  Piece,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";

enum Side {
  White = "white",
  Black = "black",
}

enum Difficulty {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

enum GameStatus {
  Active = "active",
  InActive = "inactive",
  Over = "over",
}

type Result = "win" | "lose" | "draw" | undefined;

const depthDifficultyMap: Record<Difficulty, number> = {
  [Difficulty.Beginner]: 1,
  [Difficulty.Intermediate]: 3,
  [Difficulty.Advanced]: 6,
};

const PlayComputer = () => {
  const [board, setBoard] = useState(new Chess());
  const [side, setSide] = useState<Side>(Side.White);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.InActive);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Beginner);
  const [result, setResult] = useState<Result>();

  function playerMove(move: ShortMove) {
    const result = board.move(move);
    setBoard(new Chess(board.fen()));
    return result;
  }

  function checkGameStatus(playerOutcome: Result) {
    if (!board.game_over()) return;
    setGameStatus(GameStatus.Over);
    if (board.in_checkmate()) {
      setResult(playerOutcome);
    } else {
      setResult("draw");
    }
  }

  async function computerMove() {
    const fen = board.fen();
    const depth = depthDifficultyMap[difficulty];
    try {
      const bestMove = await fetchBestMove(fen, depth);
      const move = parseUciMove(bestMove);
      board.move(move);
      setBoard(new Chess(board.fen()));
      checkGameStatus("lose");
    } catch (error) {
      console.error("Computer move failed:", error);
    }
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const move = playerMove({
      from: sourceSquare,
      to: targetSquare,
    });
    if (!move) return false;
    checkGameStatus("win");
    computerMove();
    return true;
  }

  const onPromotion = (
    piece?: PromotionPieceOption,
    from?: Square,
    to?: Square
  ) => {
    if (!piece || !from || !to) return false;
    const move = playerMove({
      from,
      to,
      promotion: piece[1].toLowerCase() as PromotionPiece,
    });
    if (!move) return false;
    checkGameStatus("win");
    computerMove();
    return true;
  };

  const isPieceDraggable = ({ piece }: { piece: Piece }) => {
    return piece[0] === side[0] && piece[0] === board.turn();
  };

  function startGame() {
    const playerSide = Math.random() < 0.5 ? Side.White : Side.Black;
    setSide(playerSide);
    setGameStatus(GameStatus.Active);
    if (playerSide === Side.Black) {
      computerMove();
    }
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen gap-8 p-6 pt-18">
      <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl  bg-white p-3">
        <Chessboard
          position={board.fen()}
          onPieceDrop={onDrop}
          onPromotionPieceSelect={onPromotion}
          boardOrientation={side}
          arePiecesDraggable={gameStatus === GameStatus.Active ? true : false}
          isDraggablePiece={isPieceDraggable}
        />
      </div>

      {gameStatus === GameStatus.InActive && (
        <div className="flex flex-col w-full max-w-md rounded-2xl border  border-zinc-800 bg-zinc-950 p-6 text-white shadow-xl hover:shadow-2xl transition-all">
          <h2 className="mb-4 text-2xl font-bold text-center">
            Play vs Computer
          </h2>

          <div className="w-full mb-4">
            <label
              htmlFor="difficulty"
              className="block mb-2 text-sm text-zinc-400"
            >
              Choose Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={Difficulty.Beginner}>Beginner</option>
              <option value={Difficulty.Intermediate}>Intermediate</option>
              <option value={Difficulty.Advanced}>Advanced</option>
            </select>
          </div>

          <button
            className="mt-2 w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      )}

      {gameStatus === GameStatus.Over && <GameOver result={result} />}
    </div>
  );
};

export default PlayComputer;
