'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, Variants, useAnimation, useInView } from 'framer-motion';
import { 
  ShieldCheckIcon, CurrencyDollarIcon, UserCircleIcon, 
  ArrowPathIcon, CheckCircleIcon, 
  BanknotesIcon, UsersIcon, SparklesIcon,
  ChartBarIcon, WalletIcon, FireIcon,
  QrCodeIcon, DevicePhoneMobileIcon, 
  ArrowRightIcon, ScissorsIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } 
  }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const iconFloat = {
  initial: { y: 0 },
  animate: { 
    y: [-5, 5, -5],
    transition: { 
      duration: 3,
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
      {[...Array(15)].map((_, i) => (
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
            opacity: [0.1, 0.2, 0.1],
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
          className="mb-8 inline-block"
          variants={iconFloat}
          initial="initial"
          animate="animate"
        >
          <div className="bg-black/30 p-4 md:p-8 rounded-3xl backdrop-blur-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-500">
            <ShieldCheckIcon className="w-16 h-16 md:w-24 md:h-24 text-green-400" />
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
          Smart, Secure Crypto Transfers With Built-in Escrow Protection
        </motion.p>

        <motion.div 
          className="flex justify-center px-4"
          variants={fadeIn}
        >
          <Link href="/transfer" passHref>
            <motion.a
              className="group relative bg-green-500 text-black px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-semibold text-lg md:text-xl transition-all duration-300 flex items-center justify-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Transfer Now</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-green-400 blur-md group-hover:opacity-70 transition-opacity opacity-0" />
            </motion.a>
          </Link>
        </motion.div>

        <motion.div 
          className="mt-8 md:mt-16 flex justify-center gap-8 md:gap-16 flex-wrap px-4"
          variants={fadeIn}
        >
          {[
            { icon: ShieldCheckIcon, text: "Funds Protected Until Claimed" },
            { icon: QrCodeIcon, text: "QR Scan & Pay" },
            { icon: ScissorsIcon, text: "Split Bills Easily" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="flex items-center space-x-2 md:space-x-3 text-sm md:text-base text-gray-400 group"
              whileHover={{ scale: 1.05 }}
            >
              <item.icon className="w-5 h-5 md:w-6 md:h-6 text-green-400 group-hover:text-green-300 transition-colors" />
              <span className="group-hover:text-green-300 transition-colors">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-green-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
    </motion.section>
  );
};

const ChainSlider = () => {
  const chains = [
    { name: 'NeoX', icon: '/chains/neox.png' },
    { name: 'EduChain', icon: '/chains/educhain.png' },
    { name: 'Ancient8', icon: '/chains/ancient8.png' },
    { name: 'Mantle', icon: '/chains/mantle.png' },
    { name: 'Kaia', icon: '/chains/kaia.png' },
    { name: 'Telos', icon: '/chains/telos.png' },
    { name: 'Linea', icon: '/chains/linea.png' },
    { name: 'Creator', icon: '/chains/creator.png' },
    { name: 'CrossFi', icon: '/chains/crossfi.png' },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-4 text-center"
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Multi-Chain Support
          </span>
        </motion.h2>
        
        <motion.p
          className="text-center text-gray-400 max-w-3xl mx-auto mb-8"
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          Send and receive funds seamlessly across multiple blockchain networks, all with the same secure interface
        </motion.p>
      </div>

      <div className="slider-container">
        <div className="slider">
          {/* First copy of logos */}
          {chains.map((chain, index) => (
            <div key={`chain-1-${index}`} className="slide">
              <div className="logo-wrapper group">
                <Image
                  src={chain.icon}
                  alt={chain.name}
                  width={80}
                  height={80}
                  className="logo-image transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="logo-name opacity-70 group-hover:opacity-100 group-hover:text-green-400">
                  {chain.name}
                </div>
              </div>
            </div>
          ))}
          
          {/* Second copy of logos (needed for seamless animation) */}
          {chains.map((chain, index) => (
            <div key={`chain-2-${index}`} className="slide">
              <div className="logo-wrapper group">
                <Image
                  src={chain.icon}
                  alt={chain.name}
                  width={80}
                  height={80}
                  className="logo-image transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="logo-name opacity-70 group-hover:opacity-100 group-hover:text-green-400">
                  {chain.name}
                </div>
              </div>
            </div>
          ))}
          
          {/* Third copy of logos (for extra buffer) */}
          {chains.map((chain, index) => (
            <div key={`chain-3-${index}`} className="slide">
              <div className="logo-wrapper group">
                <Image
                  src={chain.icon}
                  alt={chain.name}
                  width={80}
                  height={80}
                  className="logo-image transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="logo-name opacity-70 group-hover:opacity-100 group-hover:text-green-400">
                  {chain.name}
                </div>
              </div>
            </div>
          ))}
          
          {/* Fourth copy of logos (for extra buffer) */}
          {chains.map((chain, index) => (
            <div key={`chain-4-${index}`} className="slide">
              <div className="logo-wrapper group">
                <Image
                  src={chain.icon}
                  alt={chain.name}
                  width={80}
                  height={80}
                  className="logo-image transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="logo-name opacity-70 group-hover:opacity-100 group-hover:text-green-400">
                  {chain.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .slider-container {
          position: relative;
          overflow: hidden;
          padding: 20px 0;
          width: 100%;
        }
        
        .slider-container::before,
        .slider-container::after {
          content: '';
          position: absolute;
          top: 0;
          width: 200px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }
        
        .slider-container::before {
          left: 0;
          background: linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0));
        }
        
        .slider-container::after {
          right: 0;
          background: linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0));
        }
        
        .slider {
          display: flex;
          animation: scroll 40s linear infinite;
          width: fit-content;
        }
        
        .slider-container:hover .slider {
          animation-play-state: paused;
        }
        
        .slide {
          flex: 0 0 auto;
          width: 140px;
          box-sizing: border-box;
          padding: 0 10px;
        }
        
        .logo-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(128, 128, 128, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
          height: 120px;
        }
        
        .logo-wrapper:hover {
          border-color: rgba(74, 222, 128, 0.4);
          transform: translateY(-5px);
        }
        
        .logo-image {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
        
        .logo-name {
          margin-top: 8px;
          font-size: 14px;
          text-align: center;
          color: #6b7280;
          transition: all 0.3s ease;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-140px * ${chains.length} * 2));
          }
        }
      `}</style>
    </section>
  );
};

const TransferHighlight = () => {
  return (
    <motion.section
      className="py-16 md:py-24 relative overflow-hidden"
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/10 to-black" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div 
            className="order-2 lg:order-1"
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                Protected Transfers
              </span>
            </h2>
            
            <p className="text-gray-300 text-lg mb-8">
              Unlike traditional crypto payments, ProtectedPay holds your transfer in escrow until the recipient claims it. No more sending funds to the wrong address or worrying about scams.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="mt-1 p-2 bg-green-500/20 rounded-lg">
                  <QrCodeIcon className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">QR Upload & Scan</h3>
                  <p className="text-gray-400">Share payment links via QR code or scan to pay instantly on mobile. Perfect for in-person transactions.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="mt-1 p-2 bg-green-500/20 rounded-lg">
                  <ArrowPathIcon className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">Refundable Payments</h3>
                  <p className="text-gray-400">Sent to the wrong person? Get your funds back instantly if they haven't been claimed yet.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="mt-1 p-2 bg-green-500/20 rounded-lg">
                  <UserCircleIcon className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">Username Payments</h3>
                  <p className="text-gray-400">Send to memorable usernames instead of complicated wallet addresses. Simple and secure.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/transfer" passHref>
                <motion.a
                  className="inline-flex items-center space-x-2 bg-green-500 text-black px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Try Protected Transfer</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </motion.a>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2"
            variants={fadeIn}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full opacity-30" />
              <div className="relative bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-green-500/30">
                <div className="bg-black/70 rounded-xl overflow-hidden shadow-2xl">
                  <div className="p-4 bg-green-900/30 border-b border-green-500/30 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-green-400 text-sm">Protected Transfer</div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-6 text-center">
                      <motion.div
                        className="inline-block"
                        variants={iconFloat}
                        initial="initial"
                        animate="animate"
                      >
                        <ShieldCheckIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-green-400">Secure Transaction</h3>
                      <p className="text-gray-400 text-sm mt-2">Funds held in escrow until claimed</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-black/50 p-4 rounded-lg border border-green-500/20">
                        <div className="text-gray-400 text-sm mb-2">Recipient</div>
                        <div className="flex items-center justify-between">
                          <div className="text-green-400">crypto.user</div>
                          <UserCircleIcon className="w-5 h-5 text-green-400" />
                        </div>
                      </div>
                      
                      <div className="bg-black/50 p-4 rounded-lg border border-green-500/20">
                        <div className="text-gray-400 text-sm mb-2">Amount</div>
                        <div className="flex items-center justify-between">
                          <div className="text-green-400">0.5 GAS</div>
                          <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
                        </div>
                      </div>
                      
                      <div className="bg-black/50 p-4 rounded-lg border border-green-500/20">
                        <div className="text-gray-400 text-sm mb-2">Message</div>
                        <div className="text-green-400">Payment for design work</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="w-full bg-green-500 text-black py-3 rounded-lg font-semibold">
                        Confirm Transfer
                      </button>
                      <div className="mt-4 text-center text-gray-500 text-sm">
                        Refundable until claimed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

const AdditionalFeatures = () => {
  return (
    <motion.section
      className="py-16 md:py-24 relative overflow-hidden"
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/10 to-black" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              More Than Just Transfers
            </span>
          </h2>
          
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            ProtectedPay offers a complete suite of financial tools designed for the crypto ecosystem
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-green-500/20 hover:border-green-500/40 transition-all duration-500"
            variants={fadeIn}
            whileHover={{ y: -10 }}
          >
            <motion.div
              className="text-green-400 mb-6"
              variants={iconFloat}
              initial="initial"
              animate="animate"
            >
              <UsersIcon className="w-12 h-12" />
            </motion.div>
            
            <h3 className="text-2xl font-semibold text-green-400 mb-4">Split Payments</h3>
            
            <p className="text-gray-400 mb-6">
              Easily split bills, share expenses, and collect funds from multiple people. Perfect for group dinners, trips, or shared purchases.
            </p>
            
            <ul className="space-y-3">
              {[
                "Create payment pools with multiple contributors",
                "Automatic distribution when target is reached",
                "Track who has paid and who hasn't",
                "Works across all supported blockchains"
              ].map((item, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-green-500/20 hover:border-green-500/40 transition-all duration-500"
            variants={fadeIn}
            whileHover={{ y: -10 }}
          >
            <motion.div
              className="text-green-400 mb-6"
              variants={iconFloat}
              initial="initial"
              animate="animate"
            >
              <BanknotesIcon className="w-12 h-12" />
            </motion.div>
            
            <h3 className="text-2xl font-semibold text-green-400 mb-4">Savings Pots</h3>
            
            <p className="text-gray-400 mb-6">
              Create dedicated savings goals with locked funds until your target is reached. A smart way to save for future purchases or projects.
            </p>
            
            <ul className="space-y-3">
              {[
                "Set personal savings goals with target amounts",
                "Track progress with real-time updates",
                "Break the pot when needed or when goal is reached",
                "Perfect for vacation funds, emergency savings, and more"
              ].map((item, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

const CallToAction = () => {
  return (
    <motion.section 
      className="py-16 md:py-24 relative overflow-hidden"
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
        <div className="max-w-4xl mx-auto text-center bg-black/30 backdrop-blur-xl p-10 rounded-3xl border border-green-500/20">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6"
            variants={fadeIn}
          >
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              Start Using ProtectedPay Today
            </span>
          </motion.h2>

          <motion.p
            className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
            variants={fadeIn}
          >
            Experience the safest way to send and receive crypto across multiple blockchains
          </motion.p>

          <motion.div
            variants={fadeIn}
          >
            <Link href="/transfer" passHref>
              <motion.a
                className="inline-flex items-center space-x-3 bg-green-500 text-black px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShieldCheckIcon className="w-6 h-6" />
                <span>Transfer Now</span>
                <ArrowRightIcon className="w-5 h-5" />
              </motion.a>
            </Link>
            
            <p className="mt-6 text-gray-400">
              Available on NeoX, EduChain, Ancient8, and more blockchains
            </p>
          </motion.div>
        </div>
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
          <ChainSlider />
          <TransferHighlight />
          <AdditionalFeatures />
          <CallToAction />
        </div>
      </div>
    </div>
  );
}