import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import collegesData from "../data/collegesData";
import Partners from "../components/Partners";
import HowItWorks from "../components/HowItWorks";
import {
  FiArrowRight,
  FiCheckCircle,
  FiFileText,
  FiShield,
  FiClock,
  FiUploadCloud,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import heroImage from "../../assets/partnerclg.png";

// ✅ Counter animation
const Counter = ({ value }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/[^0-9]/g, ""), 10);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        let start = 0;
        const end = target;
        const timer = setInterval(() => {
          start += Math.ceil(end / 60);
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, 25);
      }}
    >
      {count}
      {value.includes("+") && "+"}
      {value.includes("%") && "%"}
    </motion.span>
  );
};

const UniversityDetail = () => {
  const { universityId } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Try to fetch actual university data from collegesData.jsx
  useEffect(() => {
    const fetchUniversity = () => {
      setLoading(true);
      const foundUniversity = collegesData[universityId];
      
      if (foundUniversity) {
        setUniversity({ id: universityId, ...foundUniversity });
        setError(""); // Clear previous error
      } else {
        setError("University not found in local records");
        setUniversity(null);
      }
      setLoading(false);
    };
    
    fetchUniversity();
  }, [universityId]);

  // Default stats for universities
  const stats = university?.stats?.length > 0 ? university.stats.map((stat, index) => ({
    value: stat.value,
    label: stat.label,
    icon: index === 0 ? <FiCheckCircle /> : index === 1 ? <FiFileText /> : index === 2 ? <FiShield /> : <FiClock />
  })) : [
    { value: "17,000+", label: "Students Served", icon: <FiCheckCircle /> },
    { value: "50+", label: "Partner Universities", icon: <FiFileText /> },
    { value: "98%", label: "Success Rate", icon: <FiShield /> },
    { value: "24/7", label: "Student Support", icon: <FiClock /> },
  ];

  // Default services for universities
  const services = university?.services?.length > 0 ? university.services : [
    "Marks Memorandum",
    "MOI Letter", 
    "Transcripts",
    "Degree Certificate",
    "Verifications (for Organizations)",
    "Pharmacy Council Documents",
  ];

  const requirements = [
    "Transcripts",
    "Marks Memorandum",
    "MOI Letter",
    "Degree Certificate",
    "Verifications",
    "Pharmacy Council Documents",
  ];

  const processSteps = [
    { title: "Submit Request", text: "Fill in your details and choose the required document service." },
    { title: "Upload Documents", text: "Share clear document copies so our team can begin the process quickly." },
    { title: "Verification & Processing", text: "We coordinate the submission and processing with the concerned institution." },
    { title: "Dispatch / Delivery", text: "Your documents are prepared and sent as per the required evaluation or verification process." },
  ];

  // Get university name and short name
  const universityName = university?.title || "University";
  const shortName = university?.short || "UNI";

  const [formData, setFormData] = useState({
    fullName: "", email: "", university: universityName, college: universityName,
    course: "", phone: "", alternativeNumber: "", requirement: "",
    termsAccepted: false, declarationAccepted: false,
  });

  useEffect(() => {
    if (universityName !== "University") {
      setFormData((prev) => ({ ...prev, college: universityName, university: universityName }));
    }
  }, [universityName]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="bg-white text-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading university details...</p>
        </div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="bg-white text-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-600 mb-2">University not found</p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <Link to="/universities" className="text-blue-600 hover:text-blue-700">
            ← Back to Universities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-slate-900">
      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden bg-white pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-right bg-no-repeat opacity-100" style={{ backgroundImage: `url(${university?.heroImage || heroImage})`, backgroundSize: "contain" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,251,255,0.98)_0%,rgba(248,251,255,0.95)_28%,rgba(248,251,255,0.78)_48%,rgba(248,251,255,0.30)_70%,rgba(248,251,255,0.02)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_28%)]" />
        <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 6, repeat: Infinity }} className="absolute left-0 top-0 h-72 w-72 bg-blue-200 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-2 md:px-4 lg:px-2">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative w-full pl-0 lg:-ml-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white shadow-md p-2 flex items-center justify-center border border-slate-100">
                  <img src={university?.logo} alt={shortName} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 shadow-sm backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  Partnered University
                </div>
              </div>

              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-[#233a59] md:text-5xl xl:text-6xl">
                Exclusive Transcript Services for{" "}
                <span className="text-blue-700">{universityName}</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                {university?.description || `${universityName} students can now apply for transcript and document services without visiting the university. We make the process simple, guided, and reliable for credential evaluations and official submissions.`}
              </motion.p>

              <div className="mt-6 flex flex-wrap gap-3">
                {["Fast processing", "Secure documentation", "Dedicated support"].map((t) => (
                  <div key={t} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                    <FiCheckCircle className="text-blue-600" /> {t}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <motion.a whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} href="/contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition">
                  <FaWhatsapp /> Contact Us
                </motion.a>
                <motion.a whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} href="#submit-documents" className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm">
                  Submit Documents <FiArrowRight />
                </motion.a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((item, index) => (
                  <motion.div key={item.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: index * 0.08 }} viewport={{ once: true }} className="rounded-2xl bg-white/90 px-4 py-4 text-center shadow-md ring-1 ring-slate-100 backdrop-blur-sm">
                    <p className="text-2xl font-bold text-[#2f4a6d]"><Counter value={item.value} /></p>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-600">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12 text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="h-[3px] w-12 bg-blue-600" />
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Our Services</p>
              <span className="h-[3px] w-12 bg-blue-600" />
            </div>
            <h2 className="mt-3 text-3xl font-bold text-[#2f4a6d] md:text-4xl">Comprehensive Document Services</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Exclusive services for {universityName} students for credential evaluations, university submissions, and official verification needs.
            </p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div key={service} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700"><FiFileText /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#233a59]">{service}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Dedicated support for processing and submitting this document requirement efficiently.</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SUBMIT FORM ══ */}
      <section id="submit-documents" className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="sticky top-28 rounded-[28px] bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white shadow-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Get Started</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight">Submit Your Documents</h2>
                <p className="mt-4 text-sm leading-7 text-blue-100/90">Please fill in your details below, and our team will get back to you shortly with the next steps.</p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3"><FiShield className="mt-1 text-blue-300" /><p className="text-sm text-blue-100/90">Safe, guided, and secure submission process</p></div>
                  <div className="flex items-start gap-3"><FiClock className="mt-1 text-blue-300" /><p className="text-sm text-blue-100/90">Faster turnaround with dedicated university support</p></div>
                  <div className="flex items-start gap-3"><FaWhatsapp className="mt-1 text-blue-300" /><p className="text-sm text-blue-100/90">Upload all documents mentioned in WhatsApp for smooth processing</p></div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 35 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <form onSubmit={handleSubmit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" placeholder="Enter your full name" required />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" placeholder="Enter your email" required />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">University / Board Name *</label>
                    <input type="text" name="university" value={formData.university} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" required />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">University Name *</label>
                    <input type="text" name="college" value={formData.college} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" required />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Course *</label>
                    <input type="text" name="course" value={formData.course} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" placeholder="Example: B.Tech, MBA..." required />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" placeholder="E.g. 8123 4567 89" required />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Alternative Number *</label>
                    <input type="tel" name="alternativeNumber" value={formData.alternativeNumber} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500" placeholder="+1 234 456 7890" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Select your Requirements *</label>
                    <select name="requirement" value={formData.requirement} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500" required>
                      <option value="">Select</option>
                      {requirements.map((item) => (<option key={item} value={item}>{item}</option>))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Upload clear copies for smooth process *</label>
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 px-6 py-10 text-center transition hover:bg-blue-50">
                      <FiUploadCloud className="text-3xl text-blue-700" />
                      <p className="mt-3 text-sm font-semibold text-[#2f4a6d]">Drag and Drop (or) Choose Files</p>
                      <p className="mt-2 text-xs text-slate-500">Upload all documents mentioned in WhatsApp</p>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="flex items-start gap-3 text-sm text-slate-600">
                      <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" required />
                      <span>I have read & accepted Terms & Conditions</span>
                    </label>
                    <label className="flex items-start gap-3 text-sm text-slate-600">
                      <input type="checkbox" name="declarationAccepted" checked={formData.declarationAccepted} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" />
                      <span>I am not a physically challenged/ pregnant women (If YES, please upload a proof to avail free services)</span>
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-cyan-700">Submit</button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ PROCESS STEPS ══ */}
      <section className="relative overflow-hidden bg-white pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(47,74,109,0.08),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-12 text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="h-[3px] w-12 bg-blue-600" />
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Application Process</p>
              <span className="h-[3px] w-12 bg-blue-600" />
            </div>
            <h2 className="mt-3 text-3xl font-bold text-[#2f4a6d] md:text-4xl">Simple and Guided Process</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">A clear step-by-step workflow designed to make transcript and document processing smooth, secure, and easy to follow.</p>
          </motion.div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative">
              <div className="absolute left-[21px] top-6 hidden h-[78%] w-[2px] bg-gradient-to-b from-blue-200 via-blue-300 to-transparent md:block" />
              <div className="space-y-5">
                {processSteps.map((step, index) => (
                  <motion.div key={step.title} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="group relative flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                    <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-200">{index + 1}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#233a59]">{step.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.65 }} viewport={{ once: true }} className="relative">
              <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-blue-100/70 blur-3xl" />
              <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-cyan-100/70 blur-3xl" />
              <div className="relative overflow-hidden rounded-[30px] border border-blue-100 bg-[linear-gradient(145deg,#eff6ff_0%,#ffffff_45%,#f8fbff_100%)] p-6 shadow-[0_20px_60px_rgba(37,99,235,0.10)] md:p-8">
                <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-blue-100/70 blur-2xl" />
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mx-auto flex max-w-md flex-col items-center text-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-[radial-gradient(circle,#dbeafe_0%,#bfdbfe_45%,#93c5fd_100%)] shadow-inner">
                    <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-lg">
                      <FiFileText className="text-5xl text-blue-700" />
                    </motion.div>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-2 top-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f4a6d] text-white shadow-lg"><FiUploadCloud className="text-xl" /></motion.div>
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-2 top-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg"><FiCheckCircle className="text-xl" /></motion.div>
                    <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-4 left-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-md"><FiShield className="text-lg" /></motion.div>
                    <motion.div animate={{ x: [0, -8, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-md"><FiClock className="text-lg" /></motion.div>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold text-[#233a59]">Smooth Document Workflow</h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-600 md:text-base">From request submission to final dispatch, every stage is managed with clarity, secure handling, and dedicated support for students.</p>
                  <div className="mt-8 grid w-full grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white px-4 py-4 text-center shadow-sm ring-1 ring-slate-100"><p className="text-xl font-bold text-blue-700">4 Steps</p><p className="mt-1 text-xs font-medium text-slate-500">Easy Process</p></div>
                    <div className="rounded-2xl bg-white px-4 py-4 text-center shadow-sm ring-1 ring-slate-100"><p className="text-xl font-bold text-blue-700">Fast</p><p className="mt-1 text-xs font-medium text-slate-500">Guided Support</p></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <Partners />
    </div>
  );
};

export default UniversityDetail;
