"use client";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [activeTab, setActiveTab] = useState('general');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const faqs = [
    {
      question: "What are your business hours?",
      answer: "We're open Monday through Friday, 9:00 AM to 6:00 PM (EST)."
    },
    {
      question: "How long does it take to get a response?",
      answer: "We typically respond to all inquiries within 24-48 business hours."
    },
    {
      question: "Do you offer emergency support?",
      answer: "Yes, we provide 24/7 emergency support for critical issues."
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        {/* Hero Section */}
        <motion.div 
          className={styles.heroSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </motion.div>

        {/* Contact Information Cards */}
        <motion.div 
          className={styles.contactInfoSection}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className={styles.infoCard} variants={itemVariants}>
            <div className={styles.iconWrapper}>
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <h3>Visit Us</h3>
            <p>123 Business Avenue</p>
            <p>New York, NY 10001</p>
          </motion.div>

          <motion.div className={styles.infoCard} variants={itemVariants}>
            <div className={styles.iconWrapper}>
              <i className="fas fa-phone"></i>
            </div>
            <h3>Call Us</h3>
            <p>+1 (555) 123-4567</p>
            <p>Mon-Fri, 9am-6pm EST</p>
          </motion.div>

          <motion.div className={styles.infoCard} variants={itemVariants}>
            <div className={styles.iconWrapper}>
              <i className="fas fa-envelope"></i>
            </div>
            <h3>Email Us</h3>
            <p>info@yourcompany.com</p>
            <p>support@yourcompany.com</p>
          </motion.div>
        </motion.div>

        {/* Contact Form Section */}
        <motion.div 
          className={styles.contactContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.formWrapper}>
            <motion.form 
              className={styles.form}
              onSubmit={handleSubmit}
              variants={containerVariants}
            >
              <div className={styles.formHeader}>
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you shortly.</p>
              </div>

              <motion.div className={styles.inputGroup} variants={itemVariants}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </motion.div>

              <motion.div className={styles.inputGroup} variants={itemVariants}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </motion.div>

              <motion.div className={styles.inputGroup} variants={itemVariants}>
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Opportunity</option>
                </select>
              </motion.div>

              <motion.div className={styles.inputGroup} variants={itemVariants}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Type your message here..."
                />
              </motion.div>

              <motion.button
                type="submit"
                className={styles.submitButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                Send Message
              </motion.button>
            </motion.form>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className={styles.faqSection}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className={styles.faqCard}
                variants={itemVariants}
              >
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Map Section */}
        <div className={styles.mapSection}>
          <h2>Our Location</h2>
          <div className={styles.mapWrapper}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596079786!2d-74.25986652089843!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1656241234567!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}