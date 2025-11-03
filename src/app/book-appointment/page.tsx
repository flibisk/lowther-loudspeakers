'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';

export default function BookAppointmentPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    location: 'norfolk',
    interest: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative h-[60vh] overflow-hidden">
        <Image
          src="/images/speakers/hegeman/gallery/Hegeman - Detail Shot.jpg"
          alt="Book an Appointment"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">VISIT US</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Book an Appointment
          </h1>
          
          <p className="text-xl leading-relaxed">
            Experience Lowther in person at our Norfolk atelier or London listening room.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section data-surface="light" className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-6 text-center">
              <h2 className="font-display text-3xl md:text-4xl leading-tight" style={{ color: '#c59862' }}>
                Visit Our Listening Rooms
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  We invite you to experience the legendary Lowther sound firsthand. Whether you're considering a purchase, seeking advice on a custom build, or simply wish to hear our instruments in person, we'd be delighted to welcome you.
                </p>
                <p>
                  Our Norfolk workshop offers an intimate setting to explore our complete range, while our London listening room provides a convenient city location for demonstrations.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Form Section */}
      <section data-surface="light" className="py-16 md:py-24 bg-[#fafaf8]">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="norfolk">Norfolk Workshop</option>
                      <option value="london">London Listening Room</option>
                    </select>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      required
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Select a time</option>
                      <option value="morning">Morning (9:00 - 12:00)</option>
                      <option value="afternoon">Afternoon (12:00 - 17:00)</option>
                      <option value="evening">Evening (17:00 - 19:00)</option>
                    </select>
                  </div>
                </div>

                {/* Interest */}
                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
                    What are you interested in?
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Please select</option>
                    <option value="loudspeakers">Loudspeakers</option>
                    <option value="drive-units">Drive Units</option>
                    <option value="custom-build">Custom Build Consultation</option>
                    <option value="repairs">Vintage Repairs</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please tell us a bit more about your visit..."
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 px-12 py-6 uppercase"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <svg
                    className="w-16 h-16 mx-auto text-[#c59862]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-display text-3xl mb-4" style={{ color: '#c59862' }}>
                  Thank You
                </h3>
                <p className="text-lg text-gray-700 mb-8">
                  We've received your appointment request. A member of our team will be in touch shortly to confirm your visit.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-white text-black hover:bg-[#c59862] hover:text-white border border-black font-sarabun text-xs tracking-[3px] transition-all duration-300 px-8 py-4 uppercase"
                >
                  Submit Another Request
                </Button>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* Location Information */}
      <section data-surface="light" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Norfolk */}
            <ScrollReveal animation="fade-up">
              <div>
                <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
                  Norfolk Workshop
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Address:</strong><br />
                    Lowther Loudspeaker Systems Ltd.<br />
                    Norfolk, United Kingdom
                  </p>
                  <p>
                    <strong>Phone:</strong> +44 20 8300 9166
                  </p>
                  <p>
                    <strong>Email:</strong> info@lowtherloudspeakers.com
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    Our Norfolk workshop is where all Lowther drive units and loudspeakers are handcrafted. Experience the full range of our instruments and meet the craftsmen who build them.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* London */}
            <ScrollReveal animation="fade-up">
              <div>
                <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
                  London Listening Room
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Address:</strong><br />
                    Central London<br />
                    (Exact address provided upon booking)
                  </p>
                  <p>
                    <strong>Phone:</strong> +44 20 8300 9166
                  </p>
                  <p>
                    <strong>Email:</strong> info@lowtherloudspeakers.com
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    Our London listening room offers a convenient city location for private demonstrations of select Lowther loudspeakers and drive units.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}




