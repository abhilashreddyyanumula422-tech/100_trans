import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import collegesData from "../data/collegesData";

const universities = [
  "JNTU Hyderabad", "Osmania University", "University of Hyderabad", "JNTU Kakinada", "JNTU Anantapur",
  "Andhra University", "Sri Venkateswara University", "Kakatiya University", "SV University", "Acharya Nagarjuna University",
  "University of Mumbai", "University of Pune", "Savitribai Phule Pune University", "University of Delhi", "Jawaharlal Nehru University",
  "Banaras Hindu University", "Aligarh Muslim University", "University of Calcutta", "University of Madras", "Anna University",
  "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
  "NIT Trichy", "NIT Warangal", "NIT Surathkal", "NIT Rourkela", "BITS Pilani",
  "VIT Vellore", "SRM University", "Manipal University", "Amrita University", "Christ University",
  "Jain University", "Bangalore University", "Mysore University", "Karnataka University", "Gulbarga University",
  "Kuvempu University", "Mangalore University", "Rajiv Gandhi University", "Tezpur University", "Dibrugarh University",
  "Gauhati University", "Assam University", "North Eastern Hill University", "Punjab University", "Panjab University Chandigarh",
  "Guru Nanak Dev University", "Punjabi University", "Thapar University", "Lovely Professional University", "Chandigarh University",
  "University of Rajasthan", "Rajasthan Technical University", "Maharshi Dayanand University", "Kurukshetra University", "Guru Jambheshwar University",
  "Chaudhary Charan Singh University", "Dr. B.R. Ambedkar University", "University of Lucknow", "Banasthali University", "Amity University",
  "Sharda University", "Galgotias University", "Jamia Millia Islamia", "Jamia Hamdard", "Bundelkhand University",
  "Chhatrapati Shahu Ji Maharaj University", "Dr. A.P.J. Abdul Kalam Technical University", "Madan Mohan Malaviya University", "University of Allahabad",
  "Sam Higginbottom University", "English and Foreign Languages University", "NALSAR University of Law", "Jadavpur University", "Presidency University",
  "St. Xavier's College", "University of Burdwan", "Kalyani University", "Vidyasagar University", "North Bengal University",
  "Bharath University", "SASTRA University", "PSG College of Technology", "Loyola College", "Madras Christian College",
  "Hindustan University", "Sathyabama University", "Vel Tech University", "Vels University", "Saveetha University",
  "Sri Ramachandra University", "Cochin University of Science and Technology", "Mahatma Gandhi University", "Calicut University", "Kannur University",
  "Indian Institute of Technology Palakkad", "Indian Institute of Technology Tirupati", "Indian Institute of Technology Dharwad", "Indian Institute of Technology Bhilai",
  "Indian Institute of Technology Goa", "Indian Institute of Technology Jammu", "Indian Institute of Technology Bhubaneswar", "Indian Institute of Technology Guwahati",
  "Indian Institute of Technology Ropar", "Indian Institute of Technology Mandi", "Indian Institute of Technology Indore", "Indian Institute of Technology Jodhpur",
  "Indian Institute of Technology Hyderabad", "Indian Institute of Technology Patna", "Indian Institute of Technology Gandhinagar", "Indian Institute of Technology Roorkee",
  "Indian Institute of Technology Varanasi", "Indian Institute of Technology Chennai", "National Institute of Technology Delhi", "National Institute of Technology Srinagar",
  "National Institute of Technology Hamirpur", "National Institute of Technology Jalandhar", "National Institute of Technology Kurukshetra", "National Institute of Technology Allahabad",
  "National Institute of Technology Patna", "National Institute of Technology Jamshedpur", "National Institute of Technology Durgapur", "National Institute of Technology Silchar",
  "National Institute of Technology Agartala", "National Institute of Technology Nagpur", "National Institute of Technology Raipur", "National Institute of Technology Puducherry",
  "National Institute of Technology Goa", "National Institute of Technology Andhra Pradesh", "National Institute of Technology Uttarakhand", "National Institute of Technology Sikkim",
  "National Institute of Technology Manipur", "National Institute of Technology Meghalaya", "National Institute of Technology Mizoram", "National Institute of Technology Nagaland",
  "National Institute of Technology Arunachal Pradesh", "Birla Institute of Technology Mesra", "Birla Institute of Technology Pilani", "Birla Institute of Technology Goa",
  "Birla Institute of Technology Hyderabad", "Birla Institute of Technology Jaipur", "Birla Institute of Technology Dubai", "VIT Bhopal", "VIT Chennai",
  "VIT Amaravati", "VIT Bangalore", "SRM Institute of Science and Technology", "SRM University Delhi NCR", "SRM University Sonepat",
  "SRM University Haryana", "Amrita School of Engineering", "Amrita School of Business", "Amrita School of Medicine", "Amrita School of Arts and Sciences",
  "Manipal Academy of Higher Education", "Manipal Institute of Technology", "Manipal College of Pharmaceutical Sciences", "Manipal College of Dental Sciences", "Kasturba Medical College",
  "Jawaharlal Institute of Postgraduate Medical Education", "Christian Medical College", "Armed Forces Medical College", "St. John's Medical College", "Lady Hardinge Medical College",
  "Maulana Azad Medical College", "All India Institute of Medical Sciences", "Post Graduate Institute of Medical Education", "Christian Medical College Vellore", "JIPMER Puducherry",
  "National Institute of Mental Health", "Tata Memorial Hospital", "Kidwai Memorial Institute", "Chittaranjan National Cancer Institute", "Sri Ramachandra Medical College",
  "Saveetha Medical College", "Sri Venkateswara Medical College", "Osmania Medical College", "Gandhi Medical College", "Kakatiya Medical College",
  "Andhra Medical College", "Guntur Medical College", "Kurnool Medical College", "Rajiv Gandhi University of Health Sciences", "Bangalore Medical College",
  "Mysore Medical College", "Kasturba Medical College Manipal", "Kasturba Medical College Mangalore", "Father Muller Medical College", "St. John's Medical College Bangalore",
  "M.S. Ramaiah Medical College", "Kempegowda Institute of Medical Sciences", "Vydehi Institute of Medical Sciences", "Apollo Hospitals Educational", "Yenepoya University",
  "Nitte University", "JSS University", "M.S. Ramaiah University", "Dayananda Sagar University", "Alliance University",
  "Azim Premji University", "PES University", "BMS College of Engineering", "R.V. College of Engineering", "M.S. Ramaiah Institute of Technology",
  "Bangalore Institute of Technology", "University Visvesvaraya College", "Central College Bangalore", "National College Bangalore", "Mount Carmel College",
  "St. Joseph's College", "Jyoti Nivas College", "Bishop Cotton College", "Sophia College", "Elphinstone College",
  "St. Xavier's College Mumbai", "Hindu College", "St. Stephen's College", "Miranda House", "Lady Shri Ram College",
  "Hansraj College", "Kirori Mal College", "Ramjas College", "Shri Ram College", "Lady Irwin College",
  "Indraprastha College", "Jesus and Mary College", "Maitreyi College", "Gargi College", "Kamla Nehru College",
  "Acharya Narendra Dev College", "Deen Dayal Upadhyaya College", "Shaheed Sukhdev College", "Netaji Subhas University", "Bhagat Singh College",
  "Sri Venkateswara College", "Zakir Husain College"
];

const Universities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 0) {
      const filtered = universities.filter(uni => 
        uni.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUniversities(filtered);
      setShowResults(true);
    } else {
      setFilteredUniversities([]);
      setShowResults(false);
    }
  };

  const selectUniversity = (uni) => {
    setSearchTerm(uni);
    setShowResults(false);
  };
  
  const colleges = Object.entries(collegesData).map(([id, data]) => ({
    id,
    ...data,
  }));

  const filteredColleges = colleges.filter((college) =>
    college.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.short.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-500 pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-[3px] w-16 bg-white/60" />
              <p className="text-sm font-bold uppercase tracking-widest text-white/90">
                Partnered Colleges
              </p>
              <span className="h-[3px] w-16 bg-white/60" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Our Partnered Universities
            </h1>

            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-white/80 leading-relaxed">
              We partner with leading universities and colleges across India to provide 
              seamless transcript and document services for students.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-white">50+</div>
                <div className="text-sm text-white/70 uppercase tracking-wider">Colleges</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-white">15+</div>
                <div className="text-sm text-white/70 uppercase tracking-wider">States</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-white">100%</div>
                <div className="text-sm text-white/70 uppercase tracking-wider">Success</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COLLEGES GRID */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white relative">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-16">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search universities by name or short name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all duration-300 shadow-lg"
            />

            {/* SEARCH DROPDOWN */}
            <AnimatePresence>
              {searchTerm.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-50 mt-3 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar"
                >
                  {filteredColleges.length > 0 ? (
                    filteredColleges.map((college) => (
                      <Link
                        key={college.id}
                        to={`/universities/${college.id}`}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-none group"
                      >
                        <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center">
                          <img src={college.logo} alt="" className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {college.title.replace("Exclusive Transcript Services for ", "").replace("Exclusive Document Services for ", "").replace(" Students", "")}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {college.short}
                          </div>
                        </div>
                        <FiArrowRight className="text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                      </Link>
                    ))
                  ) : (
                    <div className="px-6 py-10 text-center">
                      <p className="text-slate-500 font-medium">No universities found matching your search.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredColleges.map((college, idx) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                viewport={{ once: true }}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-200"
              >
                {/* Minimal Header with Logo */}
                <div className="relative p-6 pb-4 flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4 rounded-2xl bg-white shadow-md p-3 flex items-center justify-center border border-slate-100 transition-transform duration-300 group-hover:scale-110">
                    <img 
                      src={college.logo} 
                      alt={college.short} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.15em] mb-3">
                    {college.short}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {college.title.replace("Exclusive Transcript Services for ", "").replace("Exclusive Document Services for ", "").replace(" Students", "")}
                  </h3>
                </div>

                {/* Compact Info Section */}
                <div className="px-6 pb-6 mt-auto">
                  <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {college.description}
                  </p>

                  <Link
                    to={`/universities/${college.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-50 text-blue-600 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    View Details <FiArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-500 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, white 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>

        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-white/90">Expanding Network</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Can't Find Your College?
            </h2>
            
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              We're constantly expanding our network. Contact us to learn how we can 
              help with transcript services from your university.
            </p>
            
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-full font-bold shadow-xl shadow-white/20 hover:bg-blue-50 hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-105"
            >
              Contact Us
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Universities;
