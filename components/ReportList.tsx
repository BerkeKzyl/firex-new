import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MapPin, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  _id: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  image?: string;
  comment?: string;
  showOnMap: boolean;
  status: string;
  hidden?: boolean;
}

interface ReportListProps {
  type: 'web' | 'mobile';
}

export default function ReportList({ type }: ReportListProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmResolve, setConfirmResolve] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, [type]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const endpoint = type === 'web' ? '/api/report' : '/api/mobile/report';
      const response = await fetch(endpoint + '?all=true');
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (report: Report) => {
    const endpoint = type === 'web'
      ? `/api/report/${report._id}`
      : `/api/mobile/report/${report._id}`;
    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Inactive', showOnMap: false }),
      });
      if (!response.ok) throw new Error('Failed to resolve report');
      await fetchReports();
      toast.success('Report has been resolved');
    } catch (error) {
      console.error('Error resolving report:', error);
      toast.error('Failed to resolve report');
    }
  };

  const confirmResolveHandler = async () => {
    if (!confirmResolve) return;
    const endpoint = type === 'web'
      ? `/api/report/${confirmResolve._id}`
      : `/api/mobile/report/${confirmResolve._id}`;
    try {
      const body = { status: 'Inactive', showOnMap: false };
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Failed to resolve report');
      await fetchReports();
      toast.success('Report has been resolved');
    } catch (error) {
      console.error('Error resolving report:', error);
      toast.error('Failed to resolve report');
    } finally {
      setConfirmResolve(null);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading reports...</div>;
  }

  // Show all reports in the table, regardless of status or showOnMap
  const visibleReports = reports;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visibleReports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(report.dateTime), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    report.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setShowDetails(true);
                    }}
                    className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                    title="View details"
                  >
                    <Eye className="w-5 h-5 mr-1" />
                    Details
                  </button>
                  {report.status === 'Active' && (
                    <button
                      onClick={() => handleResolve(report)}
                      className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
                      title="Mark as resolved"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetails && selectedReport && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Report Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date & Time</p>
                  <p className="mt-1">{format(new Date(selectedReport.dateTime), 'MMM d, yyyy HH:mm')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">{selectedReport.status}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="mt-1">{selectedReport.latitude.toFixed(6)}, {selectedReport.longitude.toFixed(6)}</p>
                </div>
              </div>
              {selectedReport.comment && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Comment</p>
                  <p className="mt-1 text-gray-700">{selectedReport.comment}</p>
                </div>
              )}
              {selectedReport.image ? (
                <div>
                  <p className="text-sm font-medium text-gray-500">Image</p>
                  <img 
                    src={selectedReport.image.startsWith('/') ? `data:image/jpeg;base64,${selectedReport.image}` : selectedReport.image}
                    alt="Report" 
                    className="mt-2 max-w-full h-auto max-h-[400px] rounded-lg object-contain bg-gray-50 border border-gray-200 shadow"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <span className="text-gray-400 text-sm">Görsel yok</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Resolve Modal */}
      {confirmResolve && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Raporu Çöz ve Haritadan Kaldır</h3>
            <p className="mb-6 text-gray-700">Bu işlem raporu çözülecek ve haritadan gizlenecektir. Geri alınamaz, emin misiniz?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmResolve(null)}
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >İptal</button>
              <button
                onClick={confirmResolveHandler}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >Evet, Çöz ve Kaldır</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 