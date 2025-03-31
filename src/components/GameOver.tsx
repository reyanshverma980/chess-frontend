import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Handshake, Trophy, XCircle } from "lucide-react";

const GameOver = ({ result, status }: { result: string; status: string }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Dialog open={status === "over"}>
      <DialogContent className="absolute bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-200 z-10 text-center animate-fade-in">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {result === "win" ? (
              <Trophy className="text-yellow-500 w-12 h-12 mb-2" />
            ) : result === "lose" ? (
              <XCircle className="text-red-500 w-12 h-12 mb-2" />
            ) : (
              <Handshake className="text-gray-500 w-12 h-12 mb-2" />
            )}

            <DialogTitle className="text-2xl font-bold">
              {result === "draw" ? "DRAW" : `YOU ${result.toUpperCase()}`}
            </DialogTitle>
          </motion.div>
        </DialogHeader>

        <DialogFooter className="flex justify-center mt-4">
          <Button
            type="button"
            onClick={handleClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
          >
            Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameOver;
