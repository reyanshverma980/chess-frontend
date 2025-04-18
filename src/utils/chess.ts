import { ShortMove, Square } from "chess.js";

export type PromotionPiece = "n" | "b" | "r" | "q" | undefined;

export function parseUciMove(uci: string): ShortMove {
  return {
    from: uci.slice(0, 2) as Square,
    to: uci.slice(2, 4) as Square,
    promotion: (uci.length > 4 ? uci[4] : undefined) as PromotionPiece,
  };
}
