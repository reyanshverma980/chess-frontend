type SocketStatusProps = {
  message?: string;
};

const SocketStatus = ({
  message = "Connecting to game server...",
}: SocketStatusProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-transparent border-t-green-500 border-l-green-500 rounded-full animate-spin" />
        <p className="text-white text-lg md:text-xl font-semibold text-center">
          {message}
        </p>
      </div>
    </div>
  );
};

export default SocketStatus;
