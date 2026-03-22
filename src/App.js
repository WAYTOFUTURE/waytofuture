import React, { useState, useEffect, useRef } from 'react'; 
import { 
  TrendingUp, 
  ShieldCheck, 
  PiggyBank, 
  HeartPulse, 
  Calculator, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  Award, 
  Users, 
  CheckCircle,
  Briefcase,
  Umbrella,
  ArrowRight,
  Coins,
  Lock,
  Sparkles,
  Zap,
  CalendarDays,
  Target,
  Star,
  Quote,
  MessageSquare,
  Bot,
  Send,
  Loader2
} from 'lucide-react';

// API Key constant as per instructions
const apiKey = "";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mutual-funds');
  const [scrolled, setScrolled] = useState(false);

  // SIP Calculator State
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(15);
  const [sipResult, setSipResult] = useState({ invested: 0, returns: 0, total: 0 });

  // AI Assistant State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: "Namaste! I am your AI Financial Assistant. How can I help you plan your future today?" }
  ]);
  const chatEndRef = useRef(null);

  // AI Portfolio Strategy State
  const [strategyLoading, setStrategyLoading] = useState(false);
  const [strategyResult, setStrategyResult] = useState(null);

  const testimonials = [
    {
      name: "Ramjee Panayur",
      role: "Manager IT Professional",
      content: "Very nice and experienced gentleman in the field of investments, Mutual funds. Really helps and advised right funds and right ways to invest hard earned money.",
      rating: 5,
      date: "10 Apr 2022"
    },
    {
      name: "Vineeth K",
      role: "Verified Client",
      content: "I have invested in mutual funds with the help of Mr Arumugam. The service was excellent, He understands the requirement of the customers and provides solutions. Overall customer friendly nice person.",
      rating: 5,
      date: "10 Apr 2022"
    },
    {
      name: "Priya Sundar",
      role: "Business Owner",
      content: "The insurance advisory was eye-opening. They didn't just sell me a policy; they explained the claim process and critical illness covers in detail. Highly recommended.",
      rating: 5,
      date: "Recent"
    },
    {
      name: "Ganesh Kumar",
      role: "Engineering Professional",
      content: "Fair response for clarifications and Proper guidance.. Quality, Value",
      rating: 5,
      date: "31 Dec 2021"
    }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const P = monthlyInvestment;
    const i = expectedReturn / 12 / 100;
    const n = timePeriod * 12;
    let totalValue = i === 0 ? P * n : P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    setSipResult({
      invested: Math.round(totalInvested),
      returns: Math.round(totalValue - totalInvested),
      total: Math.round(totalValue)
    });
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(val);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  // Gemini API Integration - Text Generation with Backoff
  async function callGemini(prompt, systemInstruction = "You are a professional financial advisor at 'Way To Future'. Be helpful, professional, and focus on Indian investment context.") {
    let retries = 0;
    const delays = [1000, 2000, 4000, 8000, 16000];

    while (retries < 5) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] }
          })
        });

        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (err) {
        retries++;
        if (retries === 5) throw err;
        await new Promise(resolve => setTimeout(resolve, delays[retries - 1]));
      }
    }
  }

  const handleAiChat = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setAiLoading(true);

    try {
      const response = await callGemini(userText);
      setChatHistory(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'assistant', text: "I'm sorry, I'm having trouble connecting. Please try again later." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const generateAiStrategy = async () => {
    setStrategyLoading(true);
    const prompt = `Based on a monthly SIP of ${monthlyInvestment} for ${timePeriod} years at ${expectedReturn}% return, suggest a diversified mutual fund portfolio strategy. Break it down by Large cap, Mid cap, Small cap, and Debt percentage. Explain why this fits the user's timeline.`;
    
    try {
      const result = await callGemini(prompt, "You are a financial planning AI. Provide structured investment strategies for Indian markets.");
      setStrategyResult(result);
    } catch (err) {
      setStrategyResult("Unable to generate strategy at the moment.");
    } finally {
      setStrategyLoading(false);
    }
  };

  const ServiceCard = ({ icon: Icon, color, title, desc }) => (
    <div className="group relative bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-full`}></div>
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFF] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-600">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-xl group-hover:rotate-6 transition-transform">
              W2F
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Way To Future</h1>
              <div className="flex items-center gap-1">
                <span className="h-1 w-1 bg-blue-500 rounded-full"></span>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Investment Services</p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {['Services', 'Calculator', 'Testimonials', 'Why Us'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(' ', ''))} 
                className="text-slate-600 hover:text-blue-600 font-bold text-sm transition-all relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contact')} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-0.5"
            >
              Consult Now
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-800">
            {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6 max-w-7xl mx-auto z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 animate-bounce">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-black text-slate-700 tracking-wider">AMFI & IRDAI CERTIFIED EXPERT</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Don't Just Save.<br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Multiply Wealth.</span>
            </h2>
            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
              Professional advisory driven by transparency and results. We help you invest your hard-earned money in the right way.
            </p>
            <div className="flex flex-wrap gap-5">
              <button onClick={() => scrollToSection('contact')} className="group bg-slate-900 text-white px-10 py-5 rounded-3xl font-bold text-lg hover:bg-blue-600 transition-all shadow-2xl flex items-center gap-3">
                Start Your Journey <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <div className="flex items-center gap-4 bg-white/60 backdrop-blur px-6 py-4 rounded-3xl border border-slate-100 shadow-sm">
                 <CalendarDays className="text-blue-600" size={24} />
                 <div>
                    <p className="text-sm font-black text-slate-900 leading-none">5 Years</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Track Record</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative grid grid-cols-2 gap-6">
              {[
                { icon: TrendingUp, title: "Mutual Funds", val: "15%+", label: "Target Returns", color: "from-blue-500 to-cyan-500" },
                { icon: Lock, title: "Fixed Income", val: "9%+", label: "Secured Interest", color: "from-amber-500 to-orange-500" },
                { icon: ShieldCheck, title: "Insurance", val: "100%", label: "Claim Support", color: "from-rose-500 to-pink-500" },
                { icon: Zap, title: "Tax Saving", val: "₹46k", label: "Yearly Savings", color: "from-purple-500 to-indigo-500" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-xl hover:scale-105 transition-transform duration-500">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                    <card.icon size={24} />
                  </div>
                  <h4 className="font-bold text-slate-500 text-xs uppercase tracking-widest">{card.title}</h4>
                  <p className="text-2xl font-black text-slate-900 my-1">{card.val}</p>
                  <p className="text-[10px] font-bold text-slate-400">{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h4 className="text-blue-600 font-black text-sm tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <Sparkles size={18} /> Our Expertise
              </h4>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Comprehensive Solutions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Every Financial Goal.</span></h2>
            </div>
            
            <div className="flex bg-white p-2 rounded-3xl shadow-xl border border-slate-100">
              {['Mutual Funds', 'Fixed Income', 'Insurance'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                  className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${activeTab === tab.toLowerCase().replace(' ', '-') ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-blue-600'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {activeTab === 'mutual-funds' && (
              <>
                <ServiceCard icon={TrendingUp} color="from-emerald-500 to-teal-500" title="Wealth SIP" desc="Create immense wealth by investing systematically in top-performing equity funds." />
                <ServiceCard icon={PiggyBank} color="from-blue-500 to-indigo-500" title="Tax Savers (ELSS)" desc="Save up to ₹46,800 in taxes while participating in equity market growth." />
                <ServiceCard icon={Briefcase} color="from-purple-500 to-pink-500" title="Lumpsum Growth" desc="Deploy surplus capital into curated portfolios designed for high capital appreciation." />
              </>
            )}
            {activeTab === 'fixed-income' && (
              <>
                <ServiceCard icon={Lock} color="from-amber-500 to-orange-600" title="Corporate FDs" desc="Earn up to 9.5% interest rates with AAA-rated corporate deposits and monthly payouts." />
                <ServiceCard icon={Coins} color="from-yellow-400 to-amber-600" title="Capital Gain Bonds" desc="Minimize tax on property sales through Section 54EC sovereign-backed bonds." />
                <ServiceCard icon={CheckCircle} color="from-slate-700 to-slate-900" title="Monthly Income" desc="Smart structures designed to provide a steady, predictable paycheck every month." />
              </>
            )}
            {activeTab === 'insurance' && (
              <>
                <ServiceCard icon={Umbrella} color="from-cyan-500 to-blue-600" title="Term Shield" desc="Secure your family's future with high-value term plans including critical illness cover." />
                <ServiceCard icon={HeartPulse} color="from-rose-500 to-red-600" title="Global Health" desc="Cashless hospitalization worldwide with zero room rent capping and OPD benefits." />
                <ServiceCard icon={ShieldCheck} color="from-emerald-500 to-green-600" title="Assets Protect" desc="Complete coverage for your dream home, vehicle, and business liabilities." />
              </>
            )}
          </div>
        </div>
      </section>

      {/* SIP Calculator Section */}
      <section id="calculator" className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[4rem] overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/30 rounded-full blur-[150px]"></div>
          </div>
          
          <div className="relative z-10 grid lg:grid-cols-2">
            <div className="p-12 lg:p-20 space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Wealth <span className="text-blue-400">Visualizer.</span></h2>
                <p className="text-slate-400 text-lg leading-relaxed">See how small, consistent monthly steps transform into a massive financial corpus.</p>
              </div>

              <div className="space-y-12">
                {[
                  { label: "Monthly SIP", min: 1000, max: 100000, step: 1000, val: monthlyInvestment, set: setMonthlyInvestment, prefix: "₹" },
                  { label: "Expected Return", min: 5, max: 25, step: 0.5, val: expectedReturn, set: setExpectedReturn, suffix: "%" },
                  { label: "Years to Invest", min: 1, max: 40, step: 1, val: timePeriod, set: setTimePeriod, suffix: " Years" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">{item.label}</span>
                      <span className="text-2xl font-black text-white">{item.prefix}{item.val}{item.suffix}</span>
                    </div>
                    <input 
                      type="range" min={item.min} max={item.max} step={item.step} value={item.val} 
                      onChange={(e) => item.set(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                ))}

               {/*
               <button 
                  onClick={generateAiStrategy}
                  disabled={strategyLoading}
                  className="group w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {strategyLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                  Get ✨ AI Strategy for this Plan
                </button>
                */}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-3xl p-12 lg:p-20 border-l border-white/10 flex flex-col justify-center">
              {strategyResult ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                      <Bot size={20} />
                    </div>
                    <h3 className="text-white font-black text-xl">AI Recommendations</h3>
                  </div>
                  <div className="bg-white/10 p-8 rounded-[2rem] border border-white/10 text-slate-300 leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                    {strategyResult}
                  </div>
                  <button onClick={() => setStrategyResult(null)} className="text-slate-500 font-bold text-sm hover:text-white transition-colors">← Back to Results</button>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Estimated Value</p>
                    <h3 className="text-6xl md:text-7xl font-black text-white drop-shadow-2xl">
                      {formatCurrency(sipResult.total)}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/10 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Invested</p>
                      <p className="text-2xl font-black text-white">{formatCurrency(sipResult.invested)}</p>
                    </div>
                    <div className="bg-emerald-500/10 p-8 rounded-[2rem] border border-emerald-500/20 backdrop-blur-md">
                      <p className="text-emerald-400 text-xs font-bold uppercase mb-2">Earnings</p>
                      <p className="text-2xl font-black text-emerald-400">+{formatCurrency(sipResult.returns)}</p>
                    </div>
                  </div>

                  <button onClick={() => scrollToSection('contact')} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-500 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)]">
                    Start This Plan Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h4 className="text-blue-600 font-black text-sm tracking-[0.3em] uppercase mb-4">Client Success Stories</h4>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">What Our <span className="text-blue-600">Clients Say.</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 flex flex-col justify-between hover:scale-105 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                    </div>
                    {t.date && <span className="text-[10px] font-bold text-slate-400 uppercase">{t.date}</span>}
                  </div>
                  <Quote className="text-blue-50/50 mb-4" size={32} />
                  <p className="text-slate-600 italic leading-relaxed mb-6 font-medium text-sm">"{t.content}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm leading-none mb-1">{t.name}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Drawer - Floating Toggle */}
      {/*
      <button 
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-8 right-8 z-[60] w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all animate-bounce"
      >
        <MessageSquare size={28} />
        <span className="absolute -top-2 -right-2 bg-purple-600 text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white">AI ✨</span>
      </button>
      */}

      {/* AI Chat Modal Overlay */}
{/*
      {isAiOpen && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-end p-0 sm:p-6 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
          <div className="w-full sm:w-[450px] h-[85vh] sm:h-[600px] bg-white sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-right-full duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">FutureBot AI ✨</h3>
                  <div className="flex items-center gap-1 opacity-80">
                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Active Assistant</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
              */}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-200' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-100">
              <div className="relative flex items-center gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAiChat()}
                  placeholder="Ask me anything about investing..." 
                  className="w-full bg-slate-100 py-4 px-6 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
                <button 
                  onClick={handleAiChat}
                  disabled={aiLoading}
                  className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-tighter">Powered by Gemini AI Technology</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-12 lg:p-20 text-white relative">
                <div className="relative z-10 space-y-12">
                  <h2 className="text-4xl font-black leading-tight">Start Your Future <span className="text-blue-300">Today.</span></h2>
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <Phone size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Call Us</p>
                        <p className="text-xl font-black">+91 93618 71850</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <Mail size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Email Us</p>
                        <p className="text-xl font-black text-blue-100">w2f@waytofuture.co.in</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 flex-shrink-0">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Our Office</p>
                        <p className="text-lg font-black leading-snug">
                          No.7, F2, Dwaraka Flats, Srinivasan Ist Cross Street, <br/>
                          Krishna Nagar, Nanmangalam, <br/>
                          Chennai 600 129.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12 lg:p-20">
                <form 
  action="https://formspree.io/f/mlgpkyqa"  //
  method="POST"
  className="space-y-8"
>
                  <div className="space-y-6">
                    <div className="relative group">
                      <input 
  type="text" 
  name="name"
  required
  className="w-full py-4 border-b-2 border-slate-100 focus:border-blue-600 bg-transparent outline-none transition-all font-bold text-lg peer" 
  placeholder=" " 
/>
                      <label className="absolute left-0 top-4 text-slate-400 font-bold transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">Full Name</label>
                    </div>
                    <div className="relative group">
                      <input 
  type="tel" 
  name="phone"
  required
  className="w-full py-4 border-b-2 border-slate-100 focus:border-blue-600 bg-transparent outline-none transition-all font-bold text-lg peer" 
  placeholder=" " 
/>
                      <label className="absolute left-0 top-4 text-slate-400 font-bold transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">Phone Number</label>
                    </div>
                  </div>
                  <button className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl">
                    Request a Call Back
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 lg:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">W2F</div>
                <h2 className="text-2xl font-black">Way To Future</h2>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed font-medium">
                Designing financial success stories for over 5 years. Your trusted partner in wealth creation and risk management.
              </p>
            </div>

            <div>
              <h4 className="font-black mb-8 text-blue-400 uppercase tracking-widest text-xs">Credentials</h4>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">AMFI Registered</p>
                  <p className="text-sm font-bold">ARN-182841</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">IRDAI Certified</p>
                  <div className="space-y-1">
                    <p className="text-sm font-bold">HDF 01108126</p>
                    <p className="text-sm font-bold">ILG72839</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-8">
            <p className="text-slate-600 text-xs font-medium">© 2024 Way To Future. All Investments are subject to market risks.</p>
          </div>
        </div>
      </footer>

      {/* Additional Styling for Custom Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.4);
        }
      `}</style>
    </div>
  );
}
