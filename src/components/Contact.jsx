// Contact.jsx copied from RESUME portfolio
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import './Contact.css';
import { EMAILJS_USER_ID } from '../config/env';

export default function Contact() {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Initialise EmailJS with the public user ID from env variables
  useEffect(() => {
    if (EMAILJS_USER_ID) {
      emailjs.init(EMAILJS_USER_ID);
    } else {
      console.warn('EMAILJS_USER_ID is missing – email form will not work.');
    }
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Replace these with your actual EmailJS credentials
    emailjs.sendForm('service_m7c6oz6', 'template_vqb38mc', formRef.current, EMAILJS_USER_ID)
      .then(() => {
        setIsSubmitting(false);
        setStatusMessage('Message sent successfully! I will get back to you soon.');
        formRef.current.reset();
        setTimeout(() => setStatusMessage(''), 5000);
      }, (error) => {
        setIsSubmitting(false);
        setStatusMessage('Unable to send your message. Please try again later.');
        console.error('EmailJS Error:', error);
      });
  };

  return (
    <section id="contact" className="section-padding contact-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="contact-header"
        >
          <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
          <div className="title-underline"></div>
        </motion.div>

        <div className="contact-content">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="contact-info glass-panel"
          >
            <h3>Let's Connect</h3>
            <p>
              I'm currently looking for new opportunities. Whether you have a question
              or just want to say hi, I'll try my best to get back to you!
            </p>

            <div className="info-items">
              <div className="info-item">
                <div className="icon-box"><Mail size={20} /></div>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:saisandeepnaidu111@gmail.com" className="contact-link">saisandeepnaidu111@gmail.com</a></p>
                </div>
              </div>
              <div className="info-item">
                <div className="icon-box"><Phone size={20} /></div>
                <div>
                  <h4>Phone</h4>
                  <p><a href="tel:7989811376" className="contact-link">7989811376</a></p>
                </div>
              </div>
              <div className="info-item">
                <div className="icon-box"><MapPin size={20} /></div>
                <div>
                  <h4>Location</h4>
                  <p>
                    <a 
                      href="https://www.google.com/maps/place/Visakhapatnam,+Andhra+Pradesh/@17.7297926,83.238914,12z" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="contact-link"
                    >
                      Visakhapatnam, Andhra Pradesh, India
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="social-connect">
              <h4>Follow Me</h4>
              <div className="social-icons">
                <a href="https://github.com/saisandeepnaidu-11" target="_blank" rel="noopener noreferrer" title="GitHub">
                  <FaGithub size={24} />
                </a>
                <a href="https://www.linkedin.com/in/kavadana-sai-sandeep-naidu-826a45375" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <FaLinkedin size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
                  <FaTwitter size={24} />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="contact-form-container glass-panel"
          >
            <form ref={formRef} onSubmit={sendEmail} className="contact-form">
   <input type="hidden" name="to_email" value="saisandeepnaidu111@gmail.com" />
               <div className="form-group">
                 <input type="text" name="user_name" placeholder="Your Name" required />
               </div>
               <div className="form-group">
                 <input type="email" name="user_email" placeholder="Your Email" required />
               </div>
               <div className="form-group">
                 <input type="text" name="subject" placeholder="Subject" required />
               </div>
               <div className="form-group">
                 <textarea name="message" rows="5" placeholder="Your Message" required></textarea>
               </div>
               
               <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                 {isSubmitting ? 'Sending...' : (
                   <>
                     Send Message <Send size={18} />
                   </>
                 )}
               </button>
               
               {statusMessage && (
                 <p className="status-message success">{statusMessage}</p>
               )}
             </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

