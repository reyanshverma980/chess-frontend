export async function fetchBestMove(fen: string, depth: number) {
  const response = await fetch(
    `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(
      fen
    )}&depth=${depth}`
  );

  const data = await response.json();

  if (!data.success) throw new Error("Failed to fetch best move");

  return data.bestmove.split(" ")[1];
}
