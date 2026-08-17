import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, Users, FileText, CheckCircle, ArrowRight, Heart } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-9 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
              N
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight text-slate-900">NEUROSPECTRA</div>
              <div className="text-[11px] font-semibold text-blue-600">Pediatric Autism Care & Therapy</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Screening Tools</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">IEP Formulations</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">Clinical Standards</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (2-Column Photography Layout) */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-sm">
              <Activity className="w-3.5 h-3.5" />
              <span>NEUROSPECTRA Clinical Baseline Phase 1</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Empowering Autism Therapy with Smart Technology
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              NEUROSPECTRA is an AI-powered autism screening and therapy management platform designed to streamline clinical workflows, empower therapists, and support families every step of the way.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Explore Platform</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="px-8 py-3.5 bg-white hover:bg-slate-100 text-blue-600 text-base font-bold rounded-xl border border-blue-200 shadow-sm transition-all"
              >
                Watch Demo
              </a>
            </div>
          </div>

          {/* Right Column Clean Photography Hero */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-blue-50 relative group">
              <img
                src="/assets/hero_clinic_child.jpg"
                alt="Pediatric Therapy Clinic"
                className="w-full h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000';
                }}
              />
            </div>
          </div>

        </div>

        {/* Hero Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 text-left" id="features">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 font-bold">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">M-CHAT-R/F Screening</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standardized 20-item Modified Checklist for Autism in Toddlers with automated risk categorization (Low, Medium, High).
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Individualized IEP Plans</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Formulate concrete milestone goals across communication, social orientation, sensory regulation, and motor domains.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Role-Based Collaboration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated interfaces and permissions for Administrators, Clinicians, School Teachers, and Parents with data isolation.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>&copy; 2026 NEUROSPECTRA. Pediatric Autism Care & Assessment Portal.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Clinical Standards</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
