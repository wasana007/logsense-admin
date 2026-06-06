import { Links, Meta, Outlet, Scripts, NavLink } from "react-router";
import "./app.css";

export default function Root() {
  return (
    <html lang="no">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100 min-h-screen font-sans">
        <div className="min-h-screen flex flex-col items-center px-6 py-12">
          <header className="w-full max-w-3xl flex items-center gap-3 mb-9">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-lg flex-shrink-0">
              📋
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-gray-900 tracking-tight truncate">
                LogSense Admin
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-0.5">React Router · Elasticsearch</p>
            </div>
            <nav className="flex items-center gap-1 flex-shrink-0">
              <NavLink
                to="/logs"
                className={({ isActive }) =>
                  isActive
                    ? "text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-300 px-3 py-1.5 rounded-lg"
                    : "text-sm font-medium text-gray-500 px-3 py-1.5 rounded-lg border border-transparent hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all"
                }
              >
                Logs
              </NavLink>
            </nav>
          </header>

          <main className="w-full max-w-3xl flex flex-col gap-4">
            <Outlet />
          </main>

          <footer className="mt-7 text-xs font-mono text-gray-400 flex gap-3">
            <span>v1.0.0</span>
            <span>·</span>
            <span>localhost:8080</span>
            <span>·</span>
            <span>elasticsearch:9200</span>
          </footer>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
