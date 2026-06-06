import { Link } from "react-router";
import { API_BASE_URL } from "../config";
import { formatDate } from "../utils/formatDate";
import type { LogDocument } from "../types/log";

export async function loader({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/logs/${params.id}`);
    const entry = await res.json();
    return { entry };
  } catch {
    return { entry: null };
  }
}

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-green-50 text-green-700 border border-green-200",
    FAILED: "bg-red-50 text-red-600 border border-red-200",
    PENDING: "bg-blue-50 text-blue-600 border border-blue-200",
  };
  const style = styles[status ?? ""] ?? "bg-gray-100 text-gray-500";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status ?? "—"}
    </span>
  );
}

function SourceBadge({ source }: { source?: string }) {
  const styles: Record<string, string> = {
    PAYROLL_SERVICE: "bg-blue-50 text-blue-600",
    LOGSENSE_AI: "bg-green-50 text-green-700",
  };
  const style = styles[source ?? ""] ?? "bg-gray-100 text-gray-500";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style}`}>
      {source ?? "—"}
    </span>
  );
}

export default function LogDetailPage({
  loaderData,
}: {
  loaderData: { entry: LogDocument | null };
}) {
  const { entry } = loaderData;

  if (!entry) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500">
          Log ikke funnet
        </div>
        <div className="py-10 text-center text-sm text-gray-400">
          <Link to="/logs" className="text-blue-600 hover:underline">
            ← Tilbake til søk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 flex items-center justify-between">
        <span>📋 Log detaljer</span>
        <Link
          to="/logs"
          className="text-xs text-gray-500 px-2.5 py-1 rounded-lg border border-gray-200 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
        >
          ← Tilbake
        </Link>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">
            Kilde
          </span>
          <SourceBadge source={entry.source} />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">
            Korrelasjons-ID
          </span>
          <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {entry.correlationId ?? "—"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">
            Status
          </span>
          <StatusBadge status={entry.status} />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">
            Opprettet
          </span>
          <span className="font-mono text-xs text-gray-400">{formatDate(entry.createdAt)}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">
            Fullført
          </span>
          <span className="font-mono text-xs text-gray-400">{formatDate(entry.completedAt)}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Melding
          </span>
          <pre className="font-mono text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 whitespace-pre-wrap break-words">
            {entry.message ?? "—"}
          </pre>
        </div>

        {entry.result && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              🤖 AI-analyse
            </span>
            <div className="border-l-4 border-blue-400 bg-gray-50 rounded-r-lg p-3">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {entry.result}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
