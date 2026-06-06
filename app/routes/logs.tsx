import { Form } from 'react-router';
import { API_BASE_URL, API_LOGS_SEARCH, API_LOGS_SEARCH_STATUS } from '../config';

import type { LogDocument } from '../types/log';
import { formatDate } from '../utils/formatDate';
import { sortByDateDesc } from '../utils/sortByDate';

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') ?? '';
  const status = url.searchParams.get('status') ?? '';

  const apiBase = process.env.API_BASE_URL ?? 'http://localhost:8080';

  let fetchUrl: string;
  if (status && !q) {
    fetchUrl = `${apiBase}${API_LOGS_SEARCH_STATUS}/${status}`;
  } else {
    fetchUrl = `${apiBase}${API_LOGS_SEARCH}?q=${encodeURIComponent(q)}`;
  }

  try {
    const res = await fetch(fetchUrl);
    const logs = await res.json();
    const sorted = sortByDateDesc(logs);
    return { logs: sorted, q, status };
  } catch (e) {
    console.error('fetch error:', JSON.stringify(e));
    console.error('fetch error message:', (e as Error).message);
    return { logs: [], q, status };
  }
}

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    COMPLETED: 'bg-green-50 text-green-700 border border-green-200',
    FAILED: 'bg-red-50 text-red-600 border border-red-200',
    PENDING: 'bg-blue-50 text-blue-600 border border-blue-200',
  };
  const style = styles[status ?? ''] ?? 'bg-gray-100 text-gray-500';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status ?? '—'}
    </span>
  );
}

function SourceBadge({ source }: { source?: string }) {
  const styles: Record<string, string> = {
    PAYROLL_SERVICE: 'bg-blue-50 text-blue-600',
    LOGSENSE_AI: 'bg-green-50 text-green-700',
  };
  const style = styles[source ?? ''] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style}`}>
      {source ?? '—'}
    </span>
  );
}

export default function LogsPage({
  loaderData,
}: {
  loaderData: { logs: LogDocument[]; q: string; status: string };
}) {
  const { logs, q, status } = loaderData;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500">
        🔍 Søk i logger (Elasticsearch)
      </div>

      <Form method="get" className="px-4 py-3 flex gap-2 border-b border-gray-200">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Søk etter keyword..."
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 focus:bg-white transition-all"
        />
        <select
          name="status"
          defaultValue={status}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 cursor-pointer"
        >
          <option value="">Alle statuser</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="FAILED">FAILED</option>
          <option value="PENDING">PENDING</option>
        </select>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all hover:shadow-md hover:-translate-y-px"
        >
          Søk
        </button>
      </Form>

      {logs.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-400">Ingen resultater.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-32">
                  Kilde
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-36">
                  Korrelasjons-ID
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                  Melding
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-24">
                  Status
                </th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide w-24">
                  Opprettet
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: LogDocument, i: number) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5">
                    <SourceBadge source={log.source} />
                  </td>
                  <td className="px-4 py-2.5">
                    <a
                      href={`/logs/${log.correlationId}`}
                      className="font-mono text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded hover:bg-blue-100 transition-colors"
                    >
                      {log.correlationId ? log.correlationId.slice(0, 8) + '…' : '—'}
                    </a>
                  </td>
                  <td className="px-4 py-2.5 text-gray-700 truncate max-w-[200px]">
                    {log.message ?? '—'}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
