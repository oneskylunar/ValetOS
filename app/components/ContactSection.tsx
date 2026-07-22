"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, fadeUpScale, staggerContainer, fadeIn } from "@/app/lib/motion";
import { useScrollReveal } from "@/app/hooks/useScrollReveal";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const { ref, isInView } = useScrollReveal<HTMLElement>({ once: true });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <motion.section 
      id="contact-us" 
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative bg-bg0 text-dark py-24 px-6 z-30 border-t border-dark/10"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Section Divider Line */}
        <motion.div variants={fadeUp} className="w-full h-[1px] bg-dark/20 mb-8" />

        {/* Main Header */}
        <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold text-dark text-center leading-tight tracking-tight max-w-2xl mx-auto py-2">
          Ready To Transform Your<br />Valet Operations?
        </motion.h2>
        <motion.p variants={fadeUp} className="text-base md:text-lg text-fg0 font-medium text-center mt-3 max-w-lg">
          Get in touch with our team for a personalized demo, enterprise pricing, or custom venue integration.
        </motion.p>

        {/* Section Divider Line */}
        <motion.div variants={fadeUp} className="w-full h-[1px] bg-dark/20 mt-8 mb-14" />

        {/* Contact Grid: Info Cards + Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-left">
          {/* Info Side Cards */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <motion.div variants={fadeUpScale} className="p-6 bg-bg1/10 border border-dark/15 backdrop-blur-sm flex flex-col gap-2">
              <span className="text-2xl">📧</span>
              <span className="text-xs font-mono font-bold text-fg0 uppercase">Email Us</span>
              <span className="text-base font-bold text-dark">contact@valetos.com</span>
            </motion.div>

            <motion.div variants={fadeUpScale} className="p-6 bg-bg1/10 border border-dark/15 backdrop-blur-sm flex flex-col gap-2">
              <span className="text-2xl">📞</span>
              <span className="text-xs font-mono font-bold text-fg0 uppercase">Call / WhatsApp</span>
              <span className="text-base font-bold text-dark">+1 (800) 555-VALET</span>
            </motion.div>

            <motion.div variants={fadeUpScale} className="p-6 bg-bg1/10 border border-dark/15 backdrop-blur-sm flex flex-col gap-2">
              <span className="text-2xl">📍</span>
              <span className="text-xs font-mono font-bold text-fg0 uppercase">Headquarters</span>
              <span className="text-base font-bold text-dark">San Francisco, CA</span>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div variants={fadeUp} className="p-6 md:p-8 bg-bg1/10 border border-dark/15 backdrop-blur-md md:col-span-2">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeIn}
                  className="py-12 flex flex-col items-center justify-center text-center"
                >
                  <span className="text-4xl mb-3">✅</span>
                  <h3 className="text-2xl font-bold text-dark mb-2">Thank You!</h3>
                  <p className="text-sm font-medium text-fg0">
                    Your message has been received. Our team will reach out within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeIn}
                  onSubmit={handleSubmit} 
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-dark uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-bg0/60 border border-dark/20 text-dark placeholder-fg0/50 focus:outline-none focus:border-bg1/50 focus:shadow-[inset_0_0_0_1px_rgba(18,35,36,0.3)] text-sm font-medium transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-dark uppercase tracking-wider">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 bg-bg0/60 border border-dark/20 text-dark placeholder-fg0/50 focus:outline-none focus:border-bg1/50 focus:shadow-[inset_0_0_0_1px_rgba(18,35,36,0.3)] text-sm font-medium transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-dark uppercase tracking-wider">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 bg-bg0/60 border border-dark/20 text-dark placeholder-fg0/50 focus:outline-none focus:border-bg1/50 focus:shadow-[inset_0_0_0_1px_rgba(18,35,36,0.3)] text-sm font-medium transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-dark uppercase tracking-wider">
                      Facility / Venue Type
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-bg0/60 border border-dark/20 text-dark focus:outline-none focus:border-bg1/50 focus:shadow-[inset_0_0_0_1px_rgba(18,35,36,0.3)] text-sm font-medium transition-colors"
                    >
                      <option>Hotel & Resort</option>
                      <option>Airport & Transit Hub</option>
                      <option>Event Venue & Stadium</option>
                      <option>Shopping Center / Mall</option>
                      <option>Commercial Real Estate</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-dark uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your valet operations and requirements..."
                      className="w-full px-4 py-3 bg-bg0/60 border border-dark/20 text-dark placeholder-fg0/50 focus:outline-none focus:border-bg1/50 focus:shadow-[inset_0_0_0_1px_rgba(18,35,36,0.3)] text-sm font-medium transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 mt-2 text-base font-bold text-bg0 bg-bg1 hover:bg-fg1 hover:text-bg0 transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(18,35,36,0.3)] active:scale-[0.98]"
                  >
                    Send Inquiry →
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
