import React, { useEffect } from 'react';
import muskan from '../../public/muskan.jpeg';
import hemlo from '../../public/hemlo.jpeg'; 
import sourav from '../../public/sourav.jpeg';
import gourav from '../../public/gourav.jpeg';

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
      <div id="team" className="max-w-6xl mx-auto px-6 mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              name: 'Muskan Panwar', 
              role: 'CEO & Founder', 
              bio: 'Visionary leader with 15+ years in tech',
              image: muskan
            },
            { 
              name: 'Hemlo', 
              role: 'CTO', 
              bio: 'Engineering expert and innovation driver',
              image: hemlo
            },
            { 
              name: 'Gaurav Sharma', 
              role: 'Design Director', 
              bio: 'Creativity meets functionality',
              image: gourav
            },
            { 
              name: 'Sourav Singh', 
              role: 'Marketing Lead', 
              bio: 'Storyteller and brand strategist',
              image: sourav
            }
          ].map((member, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden transform hover:-translate-y-2 group"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                <div className="mt-4 flex justify-center space-x-3">
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center w-12 h-12"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}

export default About;