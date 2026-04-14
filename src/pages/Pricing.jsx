import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import MainLayout from '../components/MainLayout';

const Pricing = () => {
  const tiers = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for small schools getting started.',
      features: ['Up to 100 students', 'Basic real-time attendance alerts', 'Email support', 'Standard parent portal'],
      buttonText: 'Get Started',
      buttonVariant: 'outline',
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Pro',
      price: '$49',
      interval: '/month',
      description: 'Ideal for growing institutions needing more power.',
      features: ['Up to 1000 students', 'Automated test results', 'Priority SMS & Email', 'Performance analytics dashboard'],
      buttonText: 'Start Free Trial',
      buttonVariant: 'solid',
      popular: true,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Dedicated support and infrastructure for large networks.',
      features: ['Unlimited students', 'Custom integrations', '24/7 Phone Support', 'Dedicated account manager'],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <MainLayout>
      <section className="py-16 bg-gradient-to-b from-white to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              <span className="block">Simple, Transparent</span>
              <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Pricing Plans
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Choose the perfect plan for your institution. No hidden fees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 md:gap-12 lg:gap-8 max-w-lg mx-auto lg:max-w-none">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className={`relative flex flex-col bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border ${tier.popular ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'} overflow-hidden p-8`}
              >
                {tier.popular && (
                  <div className="absolute top-0 inset-x-0 flex justify-center translate-y-[-50%] mt-4">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent mb-2`}>
                    {tier.name}
                  </h3>
                  <p className="text-gray-500">{tier.description}</p>
                </div>
                
                <div className="mb-6 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">{tier.price}</span>
                  {tier.interval && <span className="ml-1 text-xl font-medium text-gray-500">{tier.interval}</span>}
                </div>
                
                <ul className="flex-1 space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0">
                        <FiCheck className="h-6 w-6 text-blue-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`mt-auto w-full py-3 px-4 rounded-xl font-semibold transition-all hover:-translate-y-0.5 ${
                    tier.buttonVariant === 'solid' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700' 
                    : 'bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {tier.buttonText}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Pricing FAQ Section */}
          <div className="mt-24 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequent Pricing Questions</h2>
            <div className="space-y-6">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">Can I switch plans later?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Prorated charges will be applied automatically if you upgrade mid-billing cycle.</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">Are there any setup fees?</h3>
                <p className="text-gray-600">No! All our self-serve plans (Basic and Pro) come with zero setup fees. Enterprise implementations may have custom onboarding costs depending on data migration complexity.</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">Do you offer discounts for non-profits or public schools?</h3>
                <p className="text-gray-600">Absolutely. We offer a 20% discount on all annual Pro plans for registered educational non-profits and public school districts. Contact our sales team to verify your status.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Pricing;
