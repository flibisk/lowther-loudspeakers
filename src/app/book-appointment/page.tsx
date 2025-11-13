'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollReveal } from '@/components/scroll-reveal';

type AppointmentType = 'phone' | 'visit';

interface AppointmentFormState {
  appointmentType: AppointmentType;
  name: string;
  phone: string;
  email: string;
  country: string;
  date: string;
  time: string;
  message: string;
}

export default function BookAppointmentPage() {
  const [formData, setFormData] = useState<AppointmentFormState>({
    appointmentType: 'phone',
    name: '',
    phone: '',
    email: '',
    country: '',
    date: '',
    time: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const updateForm = (field: keyof AppointmentFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    const location = formData.appointmentType === 'visit' ? 'norfolk' : 'phone_call';
    const interest =
      formData.appointmentType === 'visit' ? 'Listening Room Visit' : 'Phone Consultation';

    const messageSegments = [];
    if (formData.country) {
      messageSegments.push(`Country: ${formData.country}`);
    }
    if (formData.message) {
      messageSegments.push(formData.message);
    }

    const apiPayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      preferredDate: formData.date,
      preferredTime: formData.time,
      location,
      interest,
      message: messageSegments.join('\n\n'),
    };

    try {
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Your appointment request has been sent successfully!',
        });
        setFormData({
          appointmentType: 'phone',
          name: '',
          phone: '',
          email: '',
          country: '',
          date: '',
          time: '',
          message: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to send appointment request. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again or contact us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative h-[60vh] overflow-hidden">
        <Image
          src="/images/listening-rooms/hero/Edilia-in-a-listening-room.webp"
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
            Experience Lowther in person or chat to a Lowther expert about finding your perfect speaker.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section data-surface="light" className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-4 text-center">
              <h2 className="font-display text-3xl md:text-4xl leading-tight" style={{ color: '#c59862' }}>
                Book some Lowther Time
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Visit one of our listening rooms or arrange a time to chat about your perfect Lowther speaker.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Form Section */}
      <section data-surface="light" className="py-16 md:py-24 bg-[#fafaf8]">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-10 shadow-sm rounded-sm">
                {/* Appointment Type */}
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-3">
                    I would like to:
                  </span>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                    <label className="flex items-center text-sm text-gray-700">
                      <input
                        type="radio"
                        name="appointmentType"
                        value="phone"
                        checked={formData.appointmentType === 'phone'}
                        onChange={(e) => updateForm('appointmentType', e.target.value)}
                        className="mr-2 h-4 w-4"
                      />
                      Schedule a phone call
                    </label>
                    <label className="flex items-center text-sm text-gray-700">
                      <input
                        type="radio"
                        name="appointmentType"
                        value="visit"
                        checked={formData.appointmentType === 'visit'}
                        onChange={(e) => updateForm('appointmentType', e.target.value)}
                        className="mr-2 h-4 w-4"
                      />
                      Arrange a listening room visit
                    </label>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <Input
                      id="country"
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => updateForm('country', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => updateForm('date', e.target.value)}
                      className="w-full [color-scheme:light]"
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <Input
                      id="time"
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => updateForm('time', e.target.value)}
                      className="w-full [color-scheme:light]"
                    />
                  </div>
                </div>

                {/* Additional Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => updateForm('message', e.target.value)}
                    placeholder="Tell us about the system you're building, the music you love, or anything you'd like us to prepare for."
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Status */}
                {submitStatus.type && (
                  <div
                    className={`p-4 rounded ${
                      submitStatus.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="black"
                    size="lowther"
                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Appointment Request'}
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
                  We've received your appointment request. A member of the team will be in touch shortly to confirm the details.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setSubmitStatus({ type: null, message: '' });
                  }}
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
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-3xl md:text-4xl mb-6 text-center" style={{ color: '#c59862' }}>
              Where you can listen
            </h2>
            <p className="text-center text-gray-700 mb-16 max-w-3xl mx-auto">
              Two dedicated spaces that showcase almost a century of Lowther innovation, each with its own story and set of instruments ready to play.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Lowther Listening Room */}
            <ScrollReveal animation="fade-up" delay={0.1}>
              <div className="bg-[#fafaf8] rounded-sm overflow-hidden shadow-sm flex flex-col h-full">
                <div className="relative h-64 w-full flex-shrink-0">
                  <Image
                    src="/images/listening-rooms/gallery/Lowther-Listening-Room.webp"
                    alt="The Lowther Listening Room"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
                    The Lowther Listening Room
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Visit our exclusive listening room above the historic Phipps Brewery in Northampton. Hear the latest Lowther loudspeakers, explore ongoing projects, and enjoy music in a relaxed setting.
                  </p>
                  
                  <div className="space-y-3 mt-auto">
                    <a 
                      href="https://maps.google.com/?q=1+Foundry+Street,+Northampton,+NN1+1PN" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4s-3 1.567-3 3.5S10.343 11 12 11z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7-7.5 11.5-7.5 11.5s-7.5-4.5-7.5-11.5A7.5 7.5 0 0112 3a7.5 7.5 0 017.5 7.5z" />
                      </svg>
                      <span>1 Foundry Street, Northampton, NN1 1PN</span>
                    </a>
                    <a 
                      href="mailto:hello@lowtherloudspeakers.com"
                      className="flex items-center text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4 4m0 0l-4-4m4 4V8" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z" />
                      </svg>
                      <span>hello@lowtherloudspeakers.com</span>
                    </a>
                    <a 
                      href="tel:+442083009166"
                      className="flex items-center text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h1.28a1 1 0 01.948.684l1.144 3.431a1 1 0 01-.502 1.21l-1.276.638a11.042 11.042 0 005.516 5.516l.638-1.276a1 1 0 011.21-.502l3.431 1.144a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C8.82 21 3 15.18 3 8V7a2 2 0 012-2z" />
                      </svg>
                      <span>+44 20 8300 9166</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* The Lowther Voigt Museum */}
            <ScrollReveal animation="fade-up" delay={0.2}>
              <div className="bg-[#fafaf8] rounded-sm overflow-hidden shadow-sm flex flex-col h-full">
                <div className="relative h-64 w-full flex-shrink-0">
                  <Image
                    src="/images/listening-rooms/gallery/Lowther-voigt-museum-listening-room.webp"
                    alt="The Lowther Voigt Museum"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
                    The Lowther Voigt Museum <span className="text-sm font-normal text-gray-600">(by invitation)</span>
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    A rare opportunity to hear Lowther’s latest creations alongside historic pieces from our archives.
                    Availability is limited, but we can arrange a visit when the schedule allows.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    “Not a retailer but the ultimate place to discover Lowther’s heritage. Currently, it’s also the only space where you can experience the new Lowther Hegemans.”
                  </p>
                  
                  <div className="space-y-3 mt-auto">
                    <a 
                      href="mailto:hello@lowtherloudspeakers.com"
                      className="flex items-center text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4 4m0 0l-4-4m4 4V8" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z" />
                      </svg>
                      <span>hello@lowtherloudspeakers.com</span>
                    </a>
                    <a 
                      href="tel:+442083009166"
                      className="flex items-center text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h1.28a1 1 0 01.948.684l1.144 3.431a1 1 0 01-.502 1.21l-1.276.638a11.042 11.042 0 005.516 5.516l.638-1.276a1 1 0 011.21-.502l3.431 1.144a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C8.82 21 3 15.18 3 8V7a2 2 0 012-2z" />
                      </svg>
                      <span>+44 20 8300 9166</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}




