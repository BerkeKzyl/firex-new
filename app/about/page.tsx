'use client';

import React from 'react';

export const runtime = "edge";

function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-600 mb-4" style={{ fontFamily: "var(--font-wallpoet)" }}>
            About FireX
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We are a team of passionate engineers dedicated to creating innovative solutions for fire detection and prevention.
          </p>
        </div>

        {/* Team Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Team</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-orange-700">Taha Kabakcı</h3>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-700">Computer Engineering Student</p>
                  <p className="text-orange-600 font-medium">Istanbul Okan University</p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Full-stack developer with expertise in web and mobile development. Passionate about creating efficient and user-friendly applications that make a difference.
                </p>
                <div className="pt-4 flex gap-3">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">Web Development</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">Mobile Apps</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">UI/UX</span>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-orange-700">M. Berke Kuzeyli</h3>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-700">Computer Engineering Student</p>
                  <p className="text-orange-600 font-medium">Istanbul Okan University</p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Backend developer specializing in fire detection systems. Focused on creating robust and scalable solutions for real-time monitoring and data analysis.
                </p>
                <div className="pt-4 flex gap-3">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">Backend</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">Fire Detection</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">Data Analysis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At FireX, we are committed to leveraging technology to create safer environments through innovative fire detection and prevention solutions. Our goal is to make fire safety more accessible and effective for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage; 