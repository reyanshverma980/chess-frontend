import { useNavigate } from "react-router";
import useSocket from "../hooks/useSocket";
import SocketStatus from "@/components/SocketStatus";

const PlayOnline = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  if (!socket) return <SocketStatus />;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen p-6">
      <img src="/chess-board.svg" alt="Chess Board" />

      <div className="w-full max-w-2xl  flex flex-col items-center gap-4 mt-10 lg:mt-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          Play Chess Online
        </h1>

        <button
          className="w-fit bg-[#3A813E] text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg flex items-center gap-3 hover:bg-[#2F6A32] hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-xl active:scale-95"
          onClick={() => {
            navigate("/game");
          }}
        >
          Play
        </button>
      </div>
    </div>
  );
};

export default PlayOnline;
