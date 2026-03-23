import { ArrowRight, Check, Globe, Zap, Lock, TrendingDown, Wallet, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import HowItWorksAnimation from "@/components/HowItWorksAnimation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import WireframeGlobe from "@/components/WireframeGlobe";


/**
 * Euge Landing Page - Redesigned
 * Design: Dark navy (#171f20) with lime green (#c0ff80) accents
 * Typography: Outfit (main), Plein (secondary)
 * Background: Greyish tone
 * Header: Dark navy to showcase logo
 * Features: Animated Euge environment visualization
 */

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [monthlyVolume, setMonthlyVolume] = useState(1000000);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    email: '',
    phone: '',
    companyName: '',
    remarks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showAcknowledgment, setShowAcknowledgment] = useState(true);

  // Calculator logic
  const traditionalRate = 0.03; // 3%
  const eugeRate = 0.003; // 0.3% achievable rate through smart routing
  const traditionalCost = monthlyVolume * traditionalRate;
  const eugeCost = monthlyVolume * eugeRate;
  const monthlySavings = traditionalCost - eugeCost;
  const annualSavings = monthlySavings * 12;
  const savingsPercentage = ((traditionalCost - eugeCost) / traditionalCost) * 100;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Acknowledgment popup - show on first page load
  useEffect(() => {
    const acknowledged = localStorage.getItem('euge-acknowledged');
    if (acknowledged) {
      setShowAcknowledgment(false);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem('euge-acknowledged', 'true');
    setShowAcknowledgment(false);
  };

  // Scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const teamMembers = [
    {
      name: "Randy Tan",
      title: "Founder, Board Director & Chief Executive Officer",
      bio: "Founder with two successful exits, including the sale of a payments company R&N to Visa and the acquisition of Red Dot Payment by PayU for USD 65 million. Founded and scaled Red Dot Payment from USD 89 million to over USD 1 billion in annual transaction volume. Former executive at Visa and Citibank.",
      color: "from-accent to-primary",
      image: "/images/team-randy.png"
    },
    {
      name: "David Lee",
      title: "Board Director",
      bio: "Over 35 years of senior leadership experience in global payments, including key roles at Visa Inc. such as CFO, COO (Asia Pacific), and Regional President. Former Special Advisor to China UnionPay and Director at UnionPay International. Independent Non-Executive Director of Maybank Singapore Ltd.",
      color: "from-primary to-accent",
      image: "/images/team-david.png"
    },
    {
      name: "Johnny Chee",
      title: "Chief Strategy Officer, Board Director",
      bio: "20+ years of experience across payments, banking, hospitality, and commercial real estate. Leads hospitality investments and merging operating insight with structured deal execution across the sector.",
      color: "from-accent to-secondary",
      image: "/images/team-johnny.png"
    },

    {
      name: "Paul Kuo",
      title: "Legal Advisor",
      bio: "20+ years of global legal experience across fintech, payments, capital markets, and cross-border transactions.",
      color: "from-primary to-secondary",
      image: "/images/team-paul.png"
    },
    {
      name: "Thomas Teo",
      title: "Chief Technology Officer",
      bio: "Served as CTO at Zheng He Capital Management and CIO at Banking Computer Services. Led technology operations at United Overseas Bank as SVP and managed banking applications at Julius Baer across 6+ years.",
      color: "from-accent to-secondary",
      image: "/images/team-thomas.png"
    },
    {
      name: "Allexandra Sammy",
      title: "Growth and Communication",
      bio: "5+ years driving branding and marketing across sectors, building strategic partnerships that amplify growth. Expertise in brand strategy and market positioning.",
      color: "from-secondary to-accent",
      image: "/images/team-allexandra.png"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation - Dark Header */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-primary shadow-2xl" : "bg-primary"
        }`}
      >
        <div className="container flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2">
            <img src="/images/euge-logo.png" alt="Euge" className="h-8" style={{ width: "100px", height: "30px", objectFit: "contain" }} />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#products"
              className="text-sm font-medium text-white/80 hover:text-accent transition"
            >
              Our Platform
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-white/80 hover:text-accent transition"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-white/80 hover:text-accent transition"
            >
              How It Works
            </a>
            <a
              href="#team"
              className="text-sm font-medium text-white/80 hover:text-accent transition"
            >
              Team
            </a>
          </div>
          <Button className="bg-accent text-primary hover:bg-accent/90 font-bold" onClick={() => setShowContactForm(true)}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section with Side-by-Side Layout */}
      <section className="relative min-h-[700px] flex items-center overflow-hidden" style={{ backgroundColor: '#c7c7c7' }}>
        {/* Moving gradient blobs - faded */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>

        <div className="relative z-10 w-full h-full">
          <div className="container flex items-center justify-between gap-8 relative" style={{height: '600px'}}>
            {/* Text Content - Left Side */}
            <div className="flex-1 max-w-xl">
              <div className="p-8 md:p-12">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up text-primary">
                  <span className="text-accent">Smart Routing Engine</span> for Global Settlements.
                </h1>
                <p className="text-lg text-foreground/50 mb-8 animate-fade-in-up animate-stagger-1">
                  Optimal settlement path for hospitality and trade industries.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-stagger-2">
                  <Button
                    size="lg"
                    className="bg-primary text-white hover:bg-primary/90 gap-2 text-base font-bold px-8"
                    onClick={() => setShowContactForm(true)}
                  >
                    Talk to Our Team <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 3D Wireframe Globe - Right Side Absolute */}
            <WireframeGlobe
              className="absolute hidden lg:block animate-fade-in"
              style={{ right: '-10%', top: '-10%', width: '75%', height: '120%' }}
            />
          </div>
        </div>
      </section>

      {/* About Euge Section */}
      <section id="about" className="py-20" style={{
        backgroundColor: "#e1e3e1",
        color: "#171f20"
      }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">About Euge</h2>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                We are a technology company building intelligent settlement infrastructure for hospitality and international trading enterprises powered by our proprietary Smart Routing Engine.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-400/30 flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#181d1e'}}>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#c0ff80" strokeWidth="2">
                    <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4M5 21V10.87M19 21V10.87" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Built for Hospitality & Trade</h3>
                  <p className="text-foreground/70">
                    Purpose-built for hotel groups, property management companies, and international trading enterprises with deep industry integration.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-400/30 flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#181d1e'}}>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#c0ff80" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Institutional Workflow & Security</h3>
                  <p className="text-foreground/70">
                    Enterprise-grade controls with maker-checker approval, role-based access, and full audit trail for every transaction.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-400/30 flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#181d1e'}}>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#c0ff80" strokeWidth="2">
                    <polyline points="16 3 21 3 21 8" />
                    <line x1="4" y1="20" x2="21" y2="3" />
                    <polyline points="21 16 21 21 16 21" />
                    <line x1="15" y1="15" x2="21" y2="21" />
                    <line x1="4" y1="4" x2="9" y2="9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Smart Routing Engine</h3>
                  <p className="text-foreground/70">
                    Our proprietary engine identifies the most efficient path for every transaction — optimised for speed and cost.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Euge Deliver Radical Efficiency Gains
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Unlocking millions in efficiency gains for global businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/70 rounded-xl p-8 hover:shadow-lg transition-shadow border border-border/50 scroll-animate">
              <div className="w-12 h-12 rounded-full bg-gray-400/30 flex items-center justify-center mb-6" style={{backgroundColor: '#171d1e'}}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#c0ff80" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Near Instant Processing</h3>
              <p className="text-foreground/70">
                Eliminate lengthy processing windows. Our Smart Routing Engine enables near-instant value transfer, accelerating your business cycle.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/70 rounded-xl p-8 hover:shadow-lg transition-shadow border border-border/50 scroll-animate">
              <div className="w-12 h-12 rounded-full bg-gray-400/30 flex items-center justify-center mb-6" style={{backgroundColor: '#171d1e'}}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#c0ff80" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Up to 90% Lower Costs</h3>
              <p className="text-foreground/70">
                Dramatically reduce costs. Smart Routing identifies the most cost-efficient path for every transaction.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/70 rounded-xl p-8 hover:shadow-lg transition-shadow border border-border/50 scroll-animate">
              <div className="w-12 h-12 rounded-full bg-gray-400/30 flex items-center justify-center mb-6" style={{backgroundColor: '#171d1e'}}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#c0ff80" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Real-Time Transparency</h3>
              <p className="text-foreground/70">
                Full visibility into every stage of the transaction lifecycle. Track status and confirmation in real time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/70 rounded-xl p-8 hover:shadow-lg transition-shadow border border-border/50 scroll-animate">
              <div className="w-12 h-12 rounded-full bg-gray-400/30 flex items-center justify-center mb-6" style={{backgroundColor: '#171d1e'}}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#c0ff80" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Streamlined Operations</h3>
              <p className="text-foreground/70">
                Automated reconciliation and reporting reduce manual intervention, minimising errors and freeing your team to focus on growth.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/70 rounded-xl p-8 hover:shadow-lg transition-shadow border border-border/50 scroll-animate">
              <div className="w-12 h-12 rounded-full bg-gray-400/30 flex items-center justify-center mb-6" style={{backgroundColor: '#171d1e'}}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#c0ff80" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Global Reach</h3>
              <p className="text-foreground/70">
                Connect to corridors across key markets. Our infrastructure expands your reach without the complexity.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/70 rounded-xl p-8 hover:shadow-lg transition-shadow border border-border/50 scroll-animate">
              <div className="w-12 h-12 rounded-full bg-gray-400/30 flex items-center justify-center mb-6" style={{backgroundColor: '#171d1e'}}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#c0ff80" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Optimised Working Capital</h3>
              <p className="text-foreground/70">
                Faster processing cycles mean less capital locked in transit. Improve cash flow efficiency and redeploy resources where they matter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Nium Style */}
      <section id="products" className="py-20" style={{ backgroundColor: '#f5f6f5' }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Platform</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Enterprise-grade interfaces designed for security, control, and operational efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product Card 1 - Make Payments */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group scroll-animate">
              <div className="h-64 overflow-hidden rounded-t-2xl" style={{background: 'linear-gradient(to bottom right, rgba(192, 255, 128, 0.15), rgba(23, 31, 32, 0.08))'}}>
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663206037536/CLilUWBdYBCMXerI.png"
                  alt="Make Payments Interface"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#181d1e'}}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#c0ff80" strokeWidth="2">
                      <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold">Make Payments</h3>
                </div>
                <p className="text-foreground/70 text-sm mb-4">
                  Initiate B2B transactions with Smart Routing selecting the optimal path for every operation.
                </p>
              </div>
            </div>

            {/* Product Card 2 - 4-Eye Approval */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group scroll-animate">
              <div className="h-64 overflow-hidden rounded-t-2xl" style={{background: 'linear-gradient(to bottom right, rgba(192, 255, 128, 0.15), rgba(23, 31, 32, 0.08))'}}>
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663206037536/pawWgYJKrqUDgQbP.png"
                  alt="4-Eye Approval Interface"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#181d1e'}}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#c0ff80" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold">4-Eye Approval</h3>
                </div>
                <p className="text-foreground/70 text-sm mb-4">
                  Enterprise-grade maker-checker workflow . One user initiates, another approves before execution for maximum security.
                </p>
              </div>
            </div>

            {/* Product Card 3 - Manage & Reconcile */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group scroll-animate">
              <div className="h-64 overflow-hidden rounded-t-2xl" style={{background: 'linear-gradient(to bottom right, rgba(192, 255, 128, 0.15), rgba(23, 31, 32, 0.08))'}}>
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663206037536/xLInRFmncGjXzcUN.png"
                  alt="Manage & Reconcile Interface"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#181d1e'}}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#c0ff80" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold">Manage & Reconcile</h3>
                </div>
                <p className="text-foreground/70 text-sm mb-4">
                  Dashboard for transaction monitoring, automated reconciliation, and comprehensive reporting across all corridors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Savings Calculator Section */}
      <section id="calculator" className="py-16 bg-gradient-to-b from-secondary to-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">See Your Savings in Real-Time</h2>
              <p className="text-base text-foreground/70">
                Calculate how much your business can save with Euge Smart Routing
              </p>
            </div>

            <div className="bg-white/70 rounded-xl p-6 md:p-8 border border-border/50 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold mb-3 uppercase tracking-wide">Monthly Transaction Volume</label>
                    <input
                      type="range"
                      min="100000"
                      max="100000000"
                      step="100000"
                      value={monthlyVolume}
                      onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                    <div className="mt-3 text-center">
                      <input
                        type="text"
                        value={`$${monthlyVolume.toLocaleString('en-US')}`}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, '');
                          if (raw) setMonthlyVolume(Number(raw));
                        }}
                        className="w-full text-2xl font-bold text-primary text-center bg-transparent border-b-2 border-accent pb-1"
                      />
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div>
                    <p className="text-xs font-bold mb-2 uppercase tracking-wide">Quick Presets:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "$1M", value: 1000000 },
                        { label: "$5M", value: 5000000 },
                        { label: "$10M", value: 10000000 },
                        { label: "$50M", value: 50000000 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setMonthlyVolume(preset.value)}
                          className={`py-1.5 px-2 text-sm rounded-lg font-semibold transition-all ${
                            monthlyVolume === preset.value
                              ? "bg-accent text-primary"
                              : "bg-gray-100 text-foreground hover:bg-gray-200"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20" style={{backgroundColor: '#171f20'}}>
                    <p className="text-xs text-foreground/70 mb-1" style={{color: '#c0ff80'}}>Monthly Savings</p>
                    <p className="text-3xl font-bold text-accent">{formatCurrency(monthlySavings)}</p>
                  </div>

                  <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg p-4 border border-accent/20">
                    <p className="text-xs text-foreground/70 mb-1">Annual Savings</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(annualSavings)}</p>
                  </div>


                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-8 pt-8 border-t border-border/50">
                <p className="text-xs text-foreground/60 leading-relaxed"><strong>Disclaimer & Calculation Logic:</strong> This calculator compares traditional methods (estimated at 3% transaction cost) against an achievable rate through Smart Routing (0.3%). Monthly savings are calculated as: (Monthly Volume × 3%) − (Monthly Volume × 0.3%). Annual savings multiply monthly savings by 12. Actual savings may vary based on transaction type, corridor, volume, and specific terms. Please contact our team for a tailored assessment.</p>
              </div>

              {/* Comparison Table */}

            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20" style={{ backgroundColor: "#171f20" }}>
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">How Euge Works</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Steps Column */}
            <div className="space-y-8">
              {[
                {
                  num: 1,
                  title: "Define your Payment Parameters",
                  desc: "Upload your instructions on the EUGE platform.",
                },
                {
                  num: 2,
                  title: "Smart Routing",
                  desc: "Our smart routing engine finds the fastest, most cost-efficient path to move value to the destination.",
                },
                {
                  num: 3,
                  title: "Beneficiary Gets Paid",
                  desc: "Value arrives at the beneficiary's account with full compliance and real-time tracking.",
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent text-primary font-bold text-lg">
                      {step.num}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">{step.title}</h3>
                    <p className="text-white/70">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Animation Column */}
            <div className="relative h-96 lg:h-[500px] hidden lg:block rounded-lg overflow-hidden">
              <HowItWorksAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Founder & Team Section */}
      <section id="team" className="py-24" style={{ backgroundColor: '#e1e3e1' }}>
        <div className="container">
          <div className="mb-16 scroll-animate">
            <h2 className="text-5xl font-bold mb-4 text-primary">Founder & Team</h2>
            <p className="text-lg text-foreground/60 max-w-3xl">
              Led by executives with deep experience building and scaling enterprise platforms
            </p>
          </div>

          {/* Founder - Featured Card */}
          <div className="mb-14 scroll-animate">
            <div className="team-card flex flex-col md:flex-row items-center gap-8 bg-white/60 rounded-2xl p-8 md:p-10">
              <img 
                src={teamMembers[0].image} 
                alt={teamMembers[0].name} 
                className="w-28 h-28 rounded-full object-cover flex-shrink-0"
              />
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-primary mb-1">{teamMembers[0].name}</h3>
                <p className="text-sm font-semibold mb-3" style={{ color: '#506a6e' }}>{teamMembers[0].title}</p>
                <p className="text-foreground/60 text-sm leading-relaxed max-w-2xl">
                  {teamMembers[0].bio}
                </p>
              </div>
            </div>
          </div>

          {/* Rest of Team - Compact Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {teamMembers.slice(1).map((member, index) => (
              <div key={member.name} className="team-card group scroll-animate text-center">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-sm font-bold text-primary mb-1">{member.name}</h3>
                <p className="text-xs font-medium mb-3 leading-snug" style={{ color: '#506a6e' }}>{member.title}</p>
                <p className="text-foreground/50 text-xs leading-relaxed line-clamp-none sm:line-clamp-3 sm:group-hover:line-clamp-none transition-all">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white border-t border-white/10">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-base font-bold"
              onClick={() => setShowContactForm(true)}
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white/70 py-12 border-t border-white/10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/images/euge-logo.png" alt="Euge" style={{ width: "100px", height: "30px", objectFit: "contain" }} />
              </div>

            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#products" className="hover:text-accent transition">
                    Platform
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-accent transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#calculator" className="hover:text-accent transition">
                    Savings Calculator
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="hover:text-accent transition">
                    About
                  </a>
                </li>


              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-accent transition cursor-pointer bg-none border-none p-0">
                    Privacy
                  </button>
                </li>

                <li>
                  <button onClick={() => setShowContactForm(true)} className="hover:text-accent transition cursor-pointer bg-none border-none p-0">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm">
            <p>&copy; 2025 Euge. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-primary">Contact Us</h2>
              <button onClick={() => setShowContactForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              setSubmitMessage('');
              try {
                const response = await fetch('https://formspree.io/f/xkonnqpv', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: contactForm.email,
                    phone: contactForm.phone,
                    company: contactForm.companyName,
                    remarks: contactForm.remarks,
                    _to: 'admin@euge.io'
                  })
                });
                if (response.ok) {
                  setSubmitMessage('Thank you! We will contact you soon.');
                  setContactForm({ email: '', phone: '', companyName: '', remarks: '' });
                  setTimeout(() => setShowContactForm(false), 2000);
                } else {
                  setSubmitMessage('Error sending message. Please try again.');
                }
              } catch (error) {
                setSubmitMessage('Error sending message. Please try again.');
              }
              setIsSubmitting(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input type="email" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="your@email.com" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input type="tel" required value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <Input type="text" required value={contactForm.companyName} onChange={(e) => setContactForm({ ...contactForm, companyName: e.target.value })} placeholder="Your Company" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <Textarea value={contactForm.remarks} onChange={(e) => setContactForm({ ...contactForm, remarks: e.target.value })} placeholder="Tell us about your needs..." className="w-full" rows={4} />
              </div>
              {submitMessage && <div className={`text-sm p-3 rounded ${submitMessage.includes('Thank') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{submitMessage}</div>}
              <Button type="submit" disabled={isSubmitting} className="w-full bg-accent text-primary hover:bg-accent/90 font-bold">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-primary">Privacy & Compliance</h2>
              <button onClick={() => setShowPrivacyPolicy(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <section>
                <h3 className="text-lg font-bold text-primary mb-3">Regulatory Compliance</h3>
                <p className="text-gray-700 leading-relaxed">
                  Euge operates exclusively with licensed and regulated institutions. We maintain strict adherence to all applicable regulations across all jurisdictions where we operate.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-primary mb-3">Data Privacy & Security</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your information is protected in accordance with GDPR and regional privacy laws. We use industry-standard encryption and do not share your data with third parties without consent, except as required by law.
                </p>
              </section>


              <Button
                onClick={() => setShowPrivacyPolicy(false)}
                className="w-full bg-accent text-primary hover:bg-accent/90 font-bold"
              >
                I Understand
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Acknowledgment Modal - Shows on first page load */}
      {showAcknowledgment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold text-primary">Important Notice</h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                The information presented on this website is intended solely for general informational purposes and does not constitute an offer, solicitation, or recommendation of any kind. Euge works exclusively with licensed and regulated institutional partners. For detailed enquiries regarding our services, partnerships, or compliance framework, please contact our team directly. By continuing to browse this site, you acknowledge that website content is subject to change and should not be relied upon as the sole basis for any business decision.
              </p>
              <Button
                onClick={handleAcknowledge}
                className="w-full bg-accent text-primary hover:bg-accent/90 font-bold"
              >
                I Acknowledge
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
