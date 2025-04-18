import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-6 border-b border-zinc-800 text-center">
        <h1 className="text-3xl font-bold tracking-wide text-green-500">
          ♟️ ChessX
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
          Welcome to ChessX
        </h2>
        <p className="text-zinc-400 max-w-xl text-lg mb-10">
          Choose a mode and start playing right away.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          <Link
            to="/play-computer"
            className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 p-6 text-lg font-semibold hover:border-green-500 hover:shadow-green-600/20 shadow-md transition flex justify-center items-center"
          >
            🤖 Play vs Computer
          </Link>
          <Link
            to="/play-online"
            className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white p-6 text-lg font-semibold transition flex justify-center items-center"
          >
            🌐 Play Online
          </Link>
        </div>
      </main>

      {/* Optional Footer */}
      <footer className="p-4 text-center text-zinc-500 text-sm border-t border-zinc-800">
        Built with ❤️ by ChessX
      </footer>
    </div>
  );
};

export default Home;
