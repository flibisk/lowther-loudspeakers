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




