import {
  Search, Filter, Eye, CheckCircle, Clock, XCircle, Users, X,
  MapPin, Mail, CreditCard, Truck, FileCheck, CheckCircle2, Circle,
  Send, Copy, Check, AlertCircle, MessageCircle, Phone
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import EmptyState from "../../components/EmptyState";

const StudentRequests = () => {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [requests, setRequests] = useState([]);

  // --- NEW: Reply/Message States ---
  const [replyingTo, setReplyingTo] = useState(null);
  const [issueType, setIssueType] = useState('Document Issue');
  const [exactProblem, setExactProblem] = useState('The uploaded ID proof is blurred and unreadable.');
  const [copied, setCopied] = useState(false);
  const companyName = "100 Transcripts";

  // ✅ Dynamic API Base
  const API_BASE = `http://192.168.1.53:8000`;

  // ✅ FETCH API
  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/all-applications/`, {
        cache: "no-store"
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      // Error fetching requests handled
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSendEmail = async () => {
    if (!replyingTo) return;

    try {
      // 1. Send Email Notification
      const res = await fetch(`${API_BASE}/api/send-notification/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: replyingTo.email,
          subject: `Action Required: ${issueType} for Request ${replyingTo.id}`,
          message: emailBody,
        }),
      });

      // 2. Also Update Status in DB so student sees it on Waiting Screen
      await updateStatus(replyingTo.raw_id, "rejected", exactProblem);

      if (res.ok) {
        alert("✅ Notification sent and Status updated to Rejected");
        setReplyingTo(null);
      } else {
        const data = await res.json();
        alert("❌ " + (data.error || "Failed to send"));
      }
    } catch (err) {
      // Error handled
      alert("❌ Server error");
    }
  };

  const updateStatus = async (id, newStatus, message = "", agent = null) => {
    try {
      const res = await fetch(`${API_BASE}/api/application/${id}/update-status/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          admin_message: message,
          agent: agent
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      await fetchRequests();
      setSelectedStudent(prev =>
        prev ? { ...prev, status: newStatus, admin_message: message, agent: agent !== null ? agent : prev.agent } : null
      );
    } catch (err) {
      // Error handled
      alert("Failed to update status");
    }
  };

  const total = requests.length;
  const pending = requests.filter(r => String(r.status || "").toLowerCase().trim() === "pending").length;
  const verified = requests.filter(r => String(r.status || "").toLowerCase().trim() === "approved").length;
  const rejected = requests.filter(r => String(r.status || "").toLowerCase().trim() === "rejected").length;

  const filtered = requests.filter(r => {
    const sTerm = (search || "").toLowerCase();
    const sFilter = (statusFilter || "All").toLowerCase();

    const matchesSearch =
      String(r.fullName || "").toLowerCase().includes(sTerm) ||
      String(r.id || "").toLowerCase().includes(sTerm);

    const matchesStatus =
      statusFilter === "All" ||
      String(r.status || "").toLowerCase().trim() === sFilter.trim();

    return matchesSearch && matchesStatus;
  });

  // --- Email Preview Logic ---
  const emailBody = replyingTo ? `Dear ${replyingTo.fullName},

We have reviewed your request, and there is an issue that requires your attention.

Issue Details:
• Type: ${issueType}
• Details: ${exactProblem}

What You Need to Do:
• Please review the issue and take the necessary action.
• Upload correct documents / complete payment / provide required information.

Best regards,
${companyName} Support Team` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // WhatsApp Integration
  const handleWhatsApp = (student) => {
    const message = `Dear ${student.fullName},

Your application (ID: ${student.id}) has been reviewed. 

Status: ${student.status || 'Pending'}
${student.admin_message ? `Message: ${student.admin_message}` : ''}

Please check your email for detailed information or contact us if you have any questions.

- ${companyName} Team`;

    const whatsappUrl = `https://wa.me/${student.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-6 space-y-6 bg-slate-100 min-h-screen relative font-sans">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Student Requests</h1>
          <p className="text-slate-500">Manage certificates & applications</p>
        </div>
        <button onClick={() => setIsFilterModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg">
          <div className="flex justify-between">
            <div><p className="text-sm opacity-80">Total</p><h2 className="text-3xl font-bold">{total}</h2></div>
            <Users />
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-yellow-100 text-yellow-700 shadow">
          <div className="flex justify-between">
            <div><p className="text-sm">Pending</p><h2 className="text-3xl font-bold">{pending}</h2></div>
            <Clock />
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-green-100 text-green-700 shadow">
          <div className="flex justify-between">
            <div><p className="text-sm">Verified</p><h2 className="text-3xl font-bold">{verified}</h2></div>
            <CheckCircle />
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-red-100 text-red-700 shadow">
          <div className="flex justify-between">
            <div><p className="text-sm">Rejected</p><h2 className="text-3xl font-bold">{rejected}</h2></div>
            <XCircle />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-xl shadow border border-slate-200 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input type="text" placeholder="Search by name or ID..." className="w-full outline-none text-slate-700" onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
        {filtered.length === 0 ? (
          <EmptyState 
            type="noResults"
            message="No student requests found"
            description={search ? "Try adjusting your search criteria" : "There are no student requests to display"}
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Request ID</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">University</th>
                    <th className="p-4">Request</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req) => (
                    <tr key={req.id} className="border-t hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{req.fullName}</div>
                        <div className="text-xs text-blue-500 font-medium">{req.email}</div>
                      </td>
                      <td className="p-4 text-slate-600">{req.id}</td>
                      <td className="p-4 text-slate-600">{req.phone}</td>
                      <td className="p-4 text-slate-600">{req.university}</td>
                      <td className="p-4 text-slate-600">{req.type}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${req.payment === "Paid" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                          {req.payment}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${String(req.status || "").toLowerCase().trim() === "approved" ? "bg-green-100 text-green-600" : String(req.status || "").toLowerCase().trim() === "pending" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}>
                          {req.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6 space-x-2">
                        <button onClick={() => handleWhatsApp(req)} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition inline-flex align-middle" title="Send WhatsApp message">
                          <MessageCircle size={18} />
                        </button>
                        <button onClick={() => setReplyingTo(req)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition">Reply</button>
                        <button onClick={() => setSelectedStudent(req)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition inline-flex align-middle">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-3 p-4">
              {filtered.map((req) => (
                <div key={req.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-800">{req.fullName}</h3>
                      <p className="text-xs text-blue-500">{req.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${String(req.status || "").toLowerCase().trim() === "approved" ? "bg-green-100 text-green-600" : String(req.status || "").toLowerCase().trim() === "pending" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}>
                      {req.status || "Pending"}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">ID:</span><span className="text-slate-700 font-medium">{req.id}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="text-slate-700 font-medium">{req.phone}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">University:</span><span className="text-slate-700 font-medium">{req.university}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Request:</span><span className="text-slate-700 font-medium">{req.type}</span></div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${req.payment === "Paid" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>{req.payment}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleWhatsApp(req)} className="flex-1 flex items-center justify-center gap-2 p-2 text-green-600 bg-green-50 rounded-lg transition min-h-[44px]">
                      <MessageCircle size={18} /> WhatsApp
                    </button>
                    <button onClick={() => setReplyingTo(req)} className="flex-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition min-h-[44px]">Reply</button>
                    <button onClick={() => setSelectedStudent(req)} className="flex-1 text-blue-600 bg-blue-50 rounded-lg transition min-h-[44px]">
                      <Eye size={18} className="mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- FILTER POPUP MODAL --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-white/20">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-bold text-slate-800">Filter Requests</h2>
                <button onClick={() => setIsFilterModalOpen(false)} className="hover:bg-slate-100 p-1 rounded-full transition"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {["All", "Pending", "Approved", "Rejected"].map((status) => (
                    <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${statusFilter === status ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setIsFilterModalOpen(false)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold mt-4">Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* --- NEW: REPLY / ISSUE MESSAGE MODAL --- */}
      {replyingTo && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            <div className="flex-1 p-8 space-y-6 overflow-y-auto border-r border-slate-100">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Mail className="text-blue-600" /> Issue Notification</h2>
                <button onClick={() => setReplyingTo(null)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Recipient</label>
                  <div className="p-3 bg-slate-50 border rounded-xl font-bold text-slate-700 mt-1">{replyingTo.fullName} ({replyingTo.email})</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Issue Category</label>
                  <select className="w-full border rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                    <option>Document Issue</option>
                    <option>Payment Issue</option>
                    <option>Missing Information</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Exact Problem Description</label>
                  <textarea rows="4" className="w-full border rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500" value={exactProblem} onChange={(e) => setExactProblem(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="w-full md:w-[350px] bg-slate-50 p-8 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700">Preview</h3>
                <button onClick={handleCopy} className={`flex items-center gap-1 text-xs px-3 py-1 rounded-lg transition ${copied ? 'bg-green-600 text-white' : 'bg-white border text-slate-600 hover:bg-slate-100'}`}>
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-600 whitespace-pre-wrap flex-1 italic overflow-y-auto">
                {emailBody}
              </div>
              <button onClick={handleSendEmail} className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl transition">
                <Send size={18} /> Send Notification
              </button>
              <div className="mt-4 p-3 bg-amber-50 rounded-xl flex gap-2 border border-amber-100">
                <AlertCircle className="text-amber-500 shrink-0" size={16} />
                <p className="text-[10px] text-amber-800 leading-tight">Notification will open in your mail app.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:row max-h-[90vh]">
            <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">

              {/* Left Column: Details */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 border-r border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Request Detail View</h2>
                  <button onClick={() => setSelectedStudent(null)} className="md:hidden p-1 rounded-full hover:bg-slate-100"><X size={24} /></button>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                      {String(selectedStudent.fullName || "?").charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{selectedStudent.fullName || "N/A"}</h3>
                      <div className="flex flex-col gap-1 text-xs text-slate-500 mt-1 font-medium">
                        <span className="flex items-center gap-1"><Mail size={12} /> {selectedStudent.email}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {selectedStudent.district}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border flex items-center gap-3 min-w-[180px] ${selectedStudent.payment === "Paid" ? "bg-green-50 border-green-100" : "bg-yellow-50 border-yellow-100"
                    }`}>
                    <div className={`p-2 rounded-xl ${selectedStudent.payment === "Paid" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Payment</p>
                      <p className={`text-sm font-bold ${selectedStudent.payment === "Paid" ? "text-green-700" : "text-yellow-700"}`}>
                        {selectedStudent.payment}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Documents List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-l-4 border-blue-600 pl-2">Uploaded Documents</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedStudent.documentsList?.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl text-blue-600 border border-slate-100"><FileCheck size={18} /></div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">{doc.name}</p>
                            <p className="text-[10px] font-bold uppercase text-green-600">{doc.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              window.open(doc.url, "_blank");
                            }}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              window.open(`http://192.168.1.53:8000/api/download/${doc.id}/`);
                            }}
                            className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agent Assignment */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Users size={18} className="text-blue-600" /> Assign Agent
                  </h4>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter agent name..."
                      className="flex-1 border rounded-xl p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedStudent.agent || ""}
                      onChange={(e) => setSelectedStudent({ ...selectedStudent, agent: e.target.value })}
                    />
                    <button
                      onClick={() => updateStatus(selectedStudent.raw_id, selectedStudent.status, selectedStudent.admin_message, selectedStudent.agent)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                    >
                      Assign
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex gap-4 border-t border-slate-100">
                  {/* ✅ APPROVE BUTTON */}
                  <button
                    onClick={() => updateStatus(selectedStudent.raw_id, "approved")}
                    disabled={selectedStudent.status === "approved"}
                    className={`flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition 
      ${selectedStudent.status === "approved"
                        ? "bg-green-200 text-green-800 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700 shadow-green-100"}
    `}
                  >
                    <CheckCircle size={18} />
                    {selectedStudent.status === "approved" ? "Approved ✅" : "Approve"}
                  </button>

                  {/* ✅ REJECT BUTTON */}
                  <button
                    onClick={() => updateStatus(selectedStudent.raw_id, "rejected")}
                    disabled={selectedStudent.status === "rejected"}
                    className={`flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition
                      ${selectedStudent.status === "rejected"
                        ? "bg-red-200 text-red-800 cursor-not-allowed"
                        : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"}
                    `}
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              </div>

              {/* Right Column: Tracking */}
              <div className="w-full md:w-[350px] bg-slate-50 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Truck className="text-blue-600" /> Tracking Detail
                  </h3>
                  <button onClick={() => setSelectedStudent(null)} className="hidden md:block p-1 rounded-full hover:bg-slate-200 transition"><X size={20} /></button>
                </div>

                <div className="relative space-y-8">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                  {selectedStudent.trackingHistory?.map((item, index) => (
                    <div key={index} className="relative pl-10">
                      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center z-10 border-2 ${item.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                        item.status === 'failed' ? 'bg-red-500 border-red-500 text-white' :
                          item.status === 'current' ? 'bg-white border-blue-500 text-blue-500' :
                            'bg-white border-slate-300 text-slate-300'
                        }`}>
                        {item.status === 'completed' ? <CheckCircle2 size={12} /> :
                          item.status === 'failed' ? <X size={10} /> :
                            <Circle size={10} fill="currentColor" />}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${item.status === 'upcoming' ? 'text-slate-400' : 'text-slate-700'}`}>
                          {item.step}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 italic">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 bg-blue-600/5 p-4 rounded-2xl border border-blue-200">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Assigned Agent</p>
                  <p className="text-sm font-bold text-slate-700">{selectedStudent.assigned}</p>
                  <p className="text-xs text-slate-500 mt-1">Delivery via: {selectedStudent.delivery}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRequests;

/* Mobile Responsiveness Styles */
const mobileStyles = `
@media (max-width: 1024px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .overflow-x-auto {
    overflow-x: auto !important;
  }
}

@media (max-width: 768px) {
  .p-6 {
    padding: 1rem !important;
  }
  
  .space-y-6 {
    gap: 1rem !important;
  }
  
  .grid-cols-4, .grid-cols-2 {
    grid-template-columns: 1fr !important;
  }
  
  .text-3xl {
    font-size: 1.5rem !important;
  }
  
  .text-sm {
    font-size: 0.75rem !important;
  }
  
  .space-x-2 > * {
    margin-right: 0.25rem !important;
  }
  
  .p-4 {
    padding: 0.5rem !important;
  }
  
  .px-3 {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  
  .py-1 {
    padding-top: 0.25rem !important;
    padding-bottom: 0.25rem !important;
  }
  
  .gap-5 {
    gap: 0.75rem !important;
  }
  
  .gap-6 {
    gap: 1rem !important;
  }
}

@media (max-width: 480px) {
  .p-6 {
    padding: 0.75rem !important;
  }
  
  .text-3xl {
    font-size: 1.25rem !important;
  }
  
  .text-sm {
    font-size: 0.7rem !important;
  }
  
  .space-x-2 {
    gap: 0.125rem !important;
  }
  
  .px-3 {
    padding-left: 0.25rem !important;
    padding-right: 0.25rem !important;
  }
  
  .gap-2 {
    gap: 0.5rem !important;
  }
  
  .table {
    font-size: 0.6rem !important;
  }
  
  .p-4 {
    padding: 0.25rem !important;
  }
  
  .text-xs {
    font-size: 0.6rem !important;
  }
  
  .text-lg {
    font-size: 1rem !important;
  }
}
`;

// Inject mobile styles into the document
if (typeof window !== 'undefined') {
  const styleId = 'student-requests-mobile-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = mobileStyles;
    document.head.appendChild(style);
  }
}