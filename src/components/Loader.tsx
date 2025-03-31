import { motion, AnimatePresence } from "framer-motion";

export function SearchLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm z-50">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 p-8 shadow-xl">
        <div className="flex flex-col items-center">
          {/* Chess board with animated pieces */}
          <div className="relative mb-8 h-64 w-64">
            {/* Chess board background */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
              {Array.from({ length: 64 }).map((_, index) => {
                const row = Math.floor(index / 8);
                const col = index % 8;
                const isLight = (row + col) % 2 === 0;

                return (
                  <div
                    key={index}
                    className={`${isLight ? "bg-zinc-800" : "bg-zinc-900"}`}
                  />
                );
              })}
            </div>

            {/* Animated chess pieces */}
            <div className="absolute inset-0">
              {/* White Knight */}
              <motion.div
                className="absolute"
                initial={{ x: "calc(50% - 16px)", y: "calc(75% - 16px)" }}
                animate={{
                  x: [
                    "calc(50% - 16px)",
                    "calc(25% - 16px)",
                    "calc(25% - 16px)",
                    "calc(50% - 16px)",
                    "calc(75% - 16px)",
                    "calc(75% - 16px)",
                    "calc(50% - 16px)",
                  ],
                  y: [
                    "calc(75% - 16px)",
                    "calc(75% - 16px)",
                    "calc(50% - 16px)",
                    "calc(25% - 16px)",
                    "calc(25% - 16px)",
                    "calc(50% - 16px)",
                    "calc(75% - 16px)",
                  ],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <ChessPiece type="knight" color="white" />
              </motion.div>

              {/* Black Knight */}
              <motion.div
                className="absolute"
                initial={{ x: "calc(50% - 16px)", y: "calc(25% - 16px)" }}
                animate={{
                  x: [
                    "calc(50% - 16px)",
                    "calc(75% - 16px)",
                    "calc(75% - 16px)",
                    "calc(50% - 16px)",
                    "calc(25% - 16px)",
                    "calc(25% - 16px)",
                    "calc(50% - 16px)",
                  ],
                  y: [
                    "calc(25% - 16px)",
                    "calc(25% - 16px)",
                    "calc(50% - 16px)",
                    "calc(75% - 16px)",
                    "calc(75% - 16px)",
                    "calc(50% - 16px)",
                    "calc(25% - 16px)",
                  ],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <ChessPiece type="knight" color="black" />
              </motion.div>

              {/* Pulsing center indicator */}
              <motion.div
                className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Chess piece component
interface ChessPieceProps {
  type: "knight";
  color: "white" | "black";
}

function ChessPiece({ type, color }: ChessPieceProps) {
  // SVG paths for different chess pieces
  const piecePaths = {
    knight: {
      white: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8,26L8,22C8,22 9.5,21 10,20C10.5,19 11,18 11,18L11,14C11,14 11.5,13 12,13C12.5,13 13,13 13,13C13,13 13.5,12 14,11.5C14.5,11 15,9 15,8.5C15,8 15,6 15,6C15,6 16,5 16.5,5C17,5 18,5 18,5L19,5C19,5 20,5 20,5.5C20,6 19,7 19,7C19,7 20,8 20,8.5C20,9 19,10 19,10C19,10 21,11 21,11.5C21,12 20,13 20,13L22,14L24,18L24,26L8,26Z"
            fill="white"
            stroke="black"
            strokeWidth="1"
          />
        </svg>
      ),
      black: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8,26L8,22C8,22 9.5,21 10,20C10.5,19 11,18 11,18L11,14C11,14 11.5,13 12,13C12.5,13 13,13 13,13C13,13 13.5,12 14,11.5C14.5,11 15,9 15,8.5C15,8 15,6 15,6C15,6 16,5 16.5,5C17,5 18,5 18,5L19,5C19,5 20,5 20,5.5C20,6 19,7 19,7C19,7 20,8 20,8.5C20,9 19,10 19,10C19,10 21,11 21,11.5C21,12 20,13 20,13L22,14L24,18L24,26L8,26Z"
            fill="black"
            stroke="white"
            strokeWidth="1"
          />
        </svg>
      ),
    },
  };

  return piecePaths[type][color];
}
