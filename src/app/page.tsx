'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { 
  ShieldCheckIcon, CurrencyDollarIcon, UserCircleIcon, 
  ArrowPathIcon, CheckCircleIcon, 
  BanknotesIcon, UsersIcon, SparklesIcon,
  ChartBarIcon, WalletIcon, FireIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { FaTelegramPlane } from 'react-icons/fa';

// Animation variants
const fadeIn: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } 
  }
};

const stagger: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const iconFloat: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: { 
    y: [-5, 5, -5],
    rotate: [-5, 5, -5],
    transition: { 
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" 
    } 
  }
};

const FloatingObjects = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 md:w-8 md:h-8 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
            opacity: 0.1
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            background: `radial-gradient(circle, rgba(${Math.random() * 100 + 100}, 255, ${Math.random() * 100 + 100}, 0.3) 0%, rgba(0,255,0,0) 70%)`
          }}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const openTelegramBot = () => {
    window.open('https://t.me/protectedpay_bot', '_blank');
  };

  return (
    <motion.section
      className="relative min-h-[100vh] flex items-center justify-center text-center overflow-hidden px-4"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      <FloatingObjects />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-green-950/30 to-black" />
      
      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-6xl mx-auto">
        <motion.div
          className="mb-8 inline-block perspective-1000"
          variants={iconFloat}
          initial="initial"
          animate="animate"
        >
          <div className="bg-black/30 p-4 md:p-8 rounded-3xl backdrop-blur-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-500 transform hover:rotate-12">
            <WalletIcon className="w-16 h-16 md:w-24 md:h-24 text-green-400" />
          </div>
        </motion.div>

        <motion.h1 
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 tracking-tight"
          variants={fadeIn}
        >
          <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 text-transparent bg-clip-text">
            ProtectedPay
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8 md:mb-12 text-gray-300 max-w-3xl mx-auto font-light px-4"
          variants={fadeIn}
        >
          Secure Crypto Transfers, Group Payments, and Smart Savings on Multiple Chains
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 px-4"
          variants={fadeIn}
        >
          <motion.button
            onClick={openTelegramBot}
            className="group relative bg-[#229ED9] text-white px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-semibold text-lg md:text-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <FaTelegramPlane className="w-6 h-6" />
              <span>Open in Telegram</span>
            </span>
            <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-[#0088cc] blur-xl group-hover:opacity-75 transition-opacity opacity-0" />
          </motion.button>
            <motion.button
            onClick={() => window.open('https://github.com/Spydiecy/ProtectedPay/blob/main/README.md', '_blank')}
            className="group relative bg-black/40 backdrop-blur-xl border border-green-500/20 text-green-400 px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-semibold text-lg md:text-xl hover:border-green-500/40 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            <span className="relative z-10">Documentation</span>
            <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-green-500/5 blur-xl group-hover:opacity-75 transition-opacity opacity-0" />
            </motion.button>
        </motion.div>

        <motion.div 
          className="mt-8 md:mt-16 flex justify-center gap-6 md:gap-12 flex-wrap px-4"
          variants={fadeIn}
        >
          {[
            { icon: ShieldCheckIcon, text: "Secure & Protected" },
            { icon: SparklesIcon, text: "Username Support" },
            { icon: UsersIcon, text: "Group Payments" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="flex items-center space-x-2 md:space-x-3 text-sm md:text-base text-gray-400 group"
              whileHover={{ scale: 1.05 }}
            >
              <item.icon className="w-4 h-4 md:w-6 md:h-6 text-green-400 group-hover:text-green-300 transition-colors" />
              <span className="group-hover:text-green-300 transition-colors">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-green-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-32 h-32 md:w-64 md:h-64 bg-green-400/10 rounded-full blur-[80px] animate-pulse delay-500" />
    </motion.section>
  );
};

const Features = () => (
  <motion.section
    className="py-12 md:py-20 relative overflow-hidden"
    variants={stagger}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, amount: 0.3 }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/10 to-black" />
    <div className="container mx-auto px-4 relative z-10">
      <motion.h2 
        className="text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-center"
        variants={fadeIn}
      >
        <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Powerful Features
        </span>
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/* First row focuses on core features */}
        <FeatureCard
          icon={<ShieldCheckIcon className="w-10 h-10 md:w-12 md:h-12" />}
          title="Protected Transfers"
          description="Send funds securely with escrow-like protection until the recipient claims them. Cancel unclaimed transfers anytime."
        />
        <FeatureCard
          icon={<UsersIcon className="w-10 h-10 md:w-12 md:h-12" />}
          title="Group Payments"
          description="Create shared payment pools with automatic distribution when target is met. Perfect for splitting bills and expenses."
        />
        <FeatureCard
          icon={<BanknotesIcon className="w-10 h-10 md:w-12 md:h-12" />}
          title="Savings Pots"
          description="Set personal savings goals with locked funds until your target is reached. Track progress and earn rewards."
        />
        {/* Second row highlights unique features */}
        <FeatureCard
          icon={<ArrowPathIcon className="w-10 h-10 md:w-12 md:h-12" />}
          title="Multi-Chain Support"
          description="Seamlessly use the same features across NeoX, Educhain, Flow etc. One interface, multiple chains."
        />
        <FeatureCard
          icon={<UserCircleIcon className="w-10 h-10 md:w-12 md:h-12" />}
          title="Username Payments"
          description="Send funds using memorable usernames instead of complex addresses. Usernames work across all supported chains."
        />
        <FeatureCard
          icon={<ChartBarIcon className="w-10 h-10 md:w-12 md:h-12" />}
          title="Telegram Integration"
          description="Access all features directly through Telegram. Send, receive, and manage your funds with simple commands."
        />
      </div>
    </div>
  </motion.section>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description
}) => (
  <motion.div
    className="relative group perspective-1000"
    variants={fadeIn}
    whileHover={{ scale: 1.02, rotateY: 5 }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl md:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-xl md:rounded-2xl border border-green-500/20 group-hover:border-green-500/40 transition-all duration-500 h-full">
      <motion.div 
        className="text-green-400 mb-4 md:mb-6 group-hover:text-green-300 transition-colors"
        variants={iconFloat}
        initial="initial"
        animate="animate"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-green-400 group-hover:text-green-300 transition-colors">{title}</h3>
      <p className="text-sm md:text-base text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{description}</p>
    </div>
  </motion.div>
);

const EnhancedStepCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  step: number 
}> = ({
  icon,
  title,
  description,
  step
}) => (
  <motion.div
    className="relative group perspective-1000"
    variants={fadeIn}
    whileHover={{ scale: 1.02, rotateY: 5 }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-xl border border-green-500/20 group-hover:border-green-500/40 transition-all duration-500">
      <motion.div 
        className="text-green-400 mb-4 md:mb-6 group-hover:text-green-300 transition-colors relative"
        variants={iconFloat}
      >
        <div className="absolute inset-0 bg-green-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {icon}
      </motion.div>
      
      <h4 className="text-xl md:text-2xl font-semibold mb-3 text-green-400 group-hover:text-green-300 transition-colors">{title}</h4>
      <p className="text-sm md:text-base text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{description}</p>
      
      <div className="absolute -top-3 -right-3 transform group-hover:scale-110 transition-all duration-300">
        <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-lg opacity-50" />
          <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-black font-bold px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm">
            Step {step}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  const processes = [
    {
      title: "Protected Transfers",
      subtitle: "Send funds securely across chains",
      steps: [
        {
          icon: <WalletIcon className="w-8 h-8 md:w-12 md:h-12" />,
          title: "Connect Wallet",
          description: "Connect your wallet and select your preferred blockchain network."
        },
        {
          icon: <ArrowPathIcon className="w-8 h-8 md:w-12 md:h-12" />,
          title: "Choose Recipient",
          description: "Enter username or wallet address. Recipients can be on any supported chain."
        },
        {
          icon: <CheckCircleIcon className="w-8 h-8 md:w-12 md:h-12" />,
          title: "Secure Transfer",
          description: "Funds are securely held until claimed. Unclaimed transfers can be refunded."
        }
      ]
    },
    {
      title: "Group Payments",
      subtitle: "Split expenses with friends",
      steps: [
        {
          icon: <UsersIcon className="w-8 h-8 md:w-12 md:h-12" />,
          title: "Create Pool",
          description: "Set the total amount needed and invite participants to contribute."
        },
        {
          icon: <CurrencyDollarIcon className="w-8 h-8 md:w-12 md:h-12" />,
          title: "Share Link",
          description: "Share payment link through Telegram or copy pool ID for contributors."
        },
        {
          icon: <ArrowPathIcon className="w-8 h-8 md:w-12 md:h-12" />,
          title: "Auto Distribution",
          description: "Once target is met, funds are automatically sent to the recipient."
        }
      ]
    },
    {
      title: "Savings Pots",
      subtitle: "Achieve your savings goals",
      steps: [
        {
          icon: <BanknotesIcon className="w-8 h-8 md:w-12 md:h-12" />,
          title: "Set Goal",
          description: "Create a savings pot with your target amount and timeframe."
        },
        {
          icon: <SparklesIcon className="w-8 h-8 md:w-12 md:h-12" />,
          title: "Regular Savings",
          description: "Add funds whenever you want, track progress with real-time updates."
        },
        {
          icon: <FireIcon className="w-8 h-8 md:w-12 md:h-12" />,
          title: "Break Pot",
          description: "Withdraw your savings anytime or wait until target is reached."
        }
      ]
    }
  ];

  return (
    <motion.section
      ref={sectionRef}
      className="py-16 md:py-32 relative overflow-hidden"
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/10 to-black" />
      
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-green-500/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-emerald-500/10 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div 
        className="container mx-auto px-4 relative z-10"
        style={{ opacity, scale }}
      >
        <motion.h2 
          className="text-3xl md:text-6xl font-bold mb-12 md:mb-24 text-center"
          variants={fadeIn}
        >
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            How It Works
          </span>
        </motion.h2>

        <div className="max-w-5xl mx-auto space-y-16 md:space-y-32">
          {processes.map((process, processIndex) => (
            <motion.div
              key={processIndex}
              variants={fadeIn}
              className="relative"
            >
              {processIndex < processes.length - 1 && (
                <div className="absolute left-1/2 bottom-0 w-px h-16 md:h-32 -mb-16 md:-mb-32 bg-gradient-to-b from-green-500/40 to-transparent" />
              )}
              
              <div className="text-center mb-8 md:mb-16">
                <h3 className="text-2xl md:text-4xl font-bold text-green-400 mb-2 md:mb-4">{process.title}</h3>
                <p className="text-lg md:text-xl text-gray-400">{process.subtitle}</p>
                <div className="h-1 w-24 md:w-32 mx-auto mt-4 md:mt-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {process.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="relative">
                    {stepIndex < process.steps.length - 1 && (
                      <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-green-500/40 to-transparent -mr-4" />
                    )}
                    
                    <EnhancedStepCard
                      icon={step.icon}
                      title={step.title}
                      description={step.description}
                      step={stepIndex + 1}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

const CallToAction = () => {
  const openTelegramBot = () => {
    window.open('https://t.me/protectedpay_bot', '_blank');
  };

  return (
    <motion.section 
      className="py-12 md:py-20 relative overflow-hidden"
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/10 to-black" />

      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-4 md:mb-8"
            variants={fadeIn}
          >
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              Start Using ProtectedPay Today
            </span>
          </motion.h2>

          <motion.p
            className="text-base md:text-xl mb-8 md:mb-12 text-gray-300 px-4"
            variants={fadeIn}
          >
            Join the future of secure, cross-chain payments. Available now on multiple chains.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6"
            variants={fadeIn}
          >
            <motion.button
              onClick={openTelegramBot}
              className="group relative bg-[#229ED9] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 hover:brightness-110 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTelegramPlane className="w-6 h-6" />
              <span>Open in Telegram</span>
            </motion.button>

            <motion.a
              href="https://github.com/Spydiecy/ProtectedPay/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-black/40 backdrop-blur-xl border border-green-500/20 text-green-400 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:border-green-500/40 transition-all duration-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <DocumentIcon className="w-6 h-6" />
              <span>Read Documentation</span>
            </motion.a>
          </motion.div>

          {/* Network badges */}
          <motion.div 
            className="mt-8 flex justify-center items-center gap-4 flex-wrap"
            variants={fadeIn}
          >
            <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full border border-green-500/20">
              <Image
                src="/chains/neox.png"
                alt="NeoX"
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-gray-400 text-sm">NeoX Mainet & Testnet</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full border border-green-500/20">
              <Image
                src="/chains/educhain.png"
                alt="EDU Chain"
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-gray-400 text-sm">EDU Chain</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full border border-green-500/20">
              <Image
                src="/chains/flow.png"
                alt="Flow Chain"
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-gray-400 text-sm">Flow Chain</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full border border-green-500/20">
              <Image
                src="/chains/kaia.png"
                alt="Flow Chain"
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-gray-400 text-sm">Kaia Chain</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-full border border-green-500/20">
              <Image
                src="/chains/telos.png"
                alt="Telos Chain"
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-gray-400 text-sm">Telos Chain</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

const SupportedChains = () => {
  const chains = [
    { name: 'NeoX Mainnet & Testnet', icon: '/chains/neox.png', description: 'High-performance Neo VM chain', status: 'Live' },
    { name: 'EDU Chain', icon: '/chains/educhain.png', description: 'Educational blockchain', status: 'Live' },
    { name: 'Flow Chain', icon: '/chains/flow.png', description: 'Scalable blockchain used by NBA, NFL, Disney', status: 'Live' },
    { name: 'Kaia Chain', icon: '/chains/kaia.png', description: 'AI-driven blockchain', status: 'Live' },
    { name: 'Telos Chain', icon: '/chains/telos.png', description: 'Scalable utility blockchain', status: 'Live' }
  ];

  return (
    <motion.section
      className="py-12 relative overflow-hidden"
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-center"
          variants={fadeIn}
        >
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Supported Chains
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {chains.map((chain) => (
            <motion.div
              key={chain.name}
              className="relative group"
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative bg-black/40 backdrop-blur-xl p-6 rounded-xl border border-green-500/20 group-hover:border-green-500/40 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative w-12 h-12">
                    <Image
                      src={chain.icon}
                      alt={chain.name}
                      fill
                      className="rounded-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-400">{chain.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                      {chain.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{chain.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-8 text-gray-400"
          variants={fadeIn}
        >
          More chains coming soon...
        </motion.div>
      </div>
    </motion.section>
  );
};

export default function ProtectedPayLandingPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black" />
        <div className="relative">
          <Hero />
          <SupportedChains />
          <Features />
          <HowItWorks />
          <CallToAction />
        </div>
      </div>
    </div>
  );
}