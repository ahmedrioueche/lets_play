import { contacts } from '@/data/contact';
import useTranslator from '@/hooks/useTranslator';
import { Clock, HelpCircle, Mail, MessageSquare, Phone, Send, X } from 'lucide-react';
import { useState } from 'react';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactSupportModal: React.FC<ContactSupportModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'contact'>('form');
  const t = useTranslator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      // Success
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: t.landing?.contact_support_email_title || 'Email Support',
      description: t.landing?.contact_support_email_description || 'Get a response within 24 hours',
      action: `mailto:${contacts.email}?subject=Support Request`,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: MessageSquare,
      title: t.landing?.contact_support_live_chat_title || 'Live Chat',
      description:
        t.landing?.contact_support_live_chat_description || 'Available during business hours',
      action: '#',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Phone,
      title: t.landing?.contact_support_phone_title || 'Phone Support',
      description: t.landing?.contact_support_phone_description || 'Call us directly',
      action: 'tel:+1234567890',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in'>
      <div className='relative w-full max-w-4xl max-h-screen bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-modal-in flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 flex-shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
              <HelpCircle className='w-6 h-6 text-white' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                {t.landing?.contact_support_title}
              </h2>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                {t.landing?.contact_support_description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className='flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0'>
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
              activeTab === 'form'
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t.landing?.contact_support_send_message}
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
              activeTab === 'contact'
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t.landing?.contact_support_other_ways}
          </button>
        </div>

        {/* Content */}
        <div className='p-8 overflow-y-auto flex-1'>
          <div
            className={`transition-all duration-300 ${activeTab === 'form' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute'}`}
          >
            {success ? (
              <div className='text-center py-12 animate-fade-in-scale'>
                <div className='w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-green-600 dark:text-green-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                  {t.landing?.contact_support_success_title}
                </h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  {t.landing?.contact_support_success_message}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-6'>
                {error && (
                  <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in-up'>
                    <p className='text-red-600 dark:text-red-400 text-sm'>{error}</p>
                  </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Name */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      {t.landing?.contact_support_name_label}
                    </label>
                    <input
                      type='text'
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                      placeholder={t.landing?.contact_support_name_placeholder}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      {t.landing?.contact_support_email_label}
                    </label>
                    <input
                      type='email'
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                      placeholder={t.landing?.contact_support_email_placeholder}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    {t.landing?.contact_support_subject_label}
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                    placeholder={t.landing?.contact_support_subject_placeholder}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    {t.landing?.contact_support_message_label}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none'
                    placeholder={t.landing?.contact_support_message_placeholder}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 active:scale-98'
                >
                  {isSubmitting ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      {t.landing?.contact_support_sending}
                    </>
                  ) : (
                    <>
                      <Send className='w-5 h-5' />
                      {t.landing?.contact_support_send_button}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div
            className={`transition-all duration-300 ${activeTab === 'contact' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute'}`}
          >
            <div className='space-y-6'>
              {/* Contact Methods */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={method.title}
                      href={method.action}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='block p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1'
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className='w-6 h-6 text-white' />
                      </div>
                      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                        {method.title}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-300'>
                        {method.description}
                      </p>
                    </a>
                  );
                })}
              </div>

              {/* Additional Info */}
              <div className='bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-purple-200 dark:border-purple-700'>
                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0'>
                    <Clock className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                      {t.landing?.contact_support_response_time_title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 mb-3'>
                      {t.landing?.contact_support_response_time_description}
                    </p>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      <p>
                        <strong>{t.landing?.contact_support_business_hours}</strong>{' '}
                        {t.landing?.contact_support_business_hours_time}
                      </p>
                      <p>
                        <strong>{t.landing?.contact_support_emergency_support}</strong>{' '}
                        {t.landing?.contact_support_emergency_description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-modal-in {
          animation: modalIn 0.3s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out;
        }

        .scale-102 {
          transform: scale(1.02);
        }

        .scale-98 {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default ContactSupportModal;
