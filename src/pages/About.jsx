import React, { useEffect } from 'react';

function About() {
  useEffect(() => {
    // Smooth scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-20" style={{ backgroundColor: '#f9fbfa' }}>
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
          About <span className="text-blue-600">Us</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto animate-fade-in-up">
          We are a team of passionate professionals dedicated to creating exceptional digital experiences that make a difference.
        </p>
        <button 
          onClick={() => document.getElementById('story').scrollIntoView({ behavior: 'smooth' })}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 animate-bounce"
        >
          Discover Our Story
        </button>
      </div>
      
      {/* Our Story Section */}
      <div id="story" className="max-w-4xl mx-auto px-6 mb-16 scroll-mt-20">
        <div className="bg-white p-8 rounded-xl shadow-sm transform transition hover:scale-[1.01] duration-300">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-600">
                Founded in 2020, our company began with a simple idea: to create technology that empowers people and businesses.
              </p>
              <p className="text-gray-600">
                What started as a small team working in a garage has grown into an innovative company serving clients worldwide.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                We've consistently pushed boundaries and challenged the status quo to deliver solutions that truly matter.
              </p>
              <p className="text-gray-600">
                Our journey continues as we explore new frontiers in technology and design.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <button 
              onClick={() => document.getElementById('team').scrollIntoView({ behavior: 'smooth' })}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center mx-auto"
            >
              Meet Our Team
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div id="team" className="max-w-4xl mx-auto px-6 mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Alex Johnson', role: 'CEO & Founder', bio: 'Visionary leader with 15+ years in tech' },
            { name: 'Sarah Chen', role: 'CTO', bio: 'Engineering expert and innovation driver' },
            { name: 'Michael Brown', role: 'Design Director', bio: 'Creativity meets functionality' },
            { name: 'Emily Wilson', role: 'Marketing Lead', bio: 'Storyteller and brand strategist' }
          ].map((member, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 text-center transform hover:-translate-y-1"
            >
              <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 transition duration-300 hover:bg-blue-200">
                <span className="text-blue-600 text-2xl font-bold">{member.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-2">{member.role}</p>
              <p className="text-gray-500 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}

export default About;