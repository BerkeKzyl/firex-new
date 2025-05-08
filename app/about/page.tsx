'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const runtime = "edge";

function AboutPage() {
  return (
    <div className="flex flex-col gap-10 p-5">
      <div className="flex items-center justify-between rounded-lg p-10 bg-[#1a1a1a] shadow-lg">
        <Image src="/images/whoami.png" alt="Mission" width={300} height={200} className="rounded-lg w-full max-w-[250px] h-auto" />
        <div className="flex-1 px-5">
          <h2 className="text-3xl mb-5 font-crete text-white">WHO AM I?</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            We are a dedicated team of fire safety professionals committed to protecting lives and property through innovative solutions and cutting-edge technology. Our journey began with a simple mission: to make fire safety accessible and effective for everyone.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg p-10 bg-[#1a1a1a] shadow-lg">
        <div className="flex-1 px-5">
          <h2 className="text-3xl mb-5 font-crete text-white">Experience</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            With years of experience in fire safety and emergency management, we have developed comprehensive solutions that have been implemented across numerous facilities. Our team combines technical expertise with practical knowledge to deliver the most effective fire safety systems.
          </p>
        </div>
        <Image src="/images/EXPERIENCE.png" alt="Experience" width={280} height={330} className="rounded-lg w-full max-w-[250px] h-auto" />
      </div>

      <div className="flex items-center justify-between rounded-lg p-10 bg-[#1a1a1a] shadow-lg">
        <Image src="/images/EDCC.png" alt="Education" width={280} height={330} className="rounded-lg w-full max-w-[250px] h-auto" />
        <div className="flex-1 px-5">
          <h2 className="text-3xl mb-5 font-crete text-white">Education</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            Our team consists of certified professionals with backgrounds in fire safety engineering, emergency management, and technology development. We continuously invest in training and education to stay at the forefront of fire safety innovation.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg p-10 bg-[#1a1a1a] shadow-lg">
        <div className="flex-1 px-5">
          <h2 className="text-3xl mb-5 font-crete text-white">Certifications</h2>
          <div className="space-y-2">
            <p>
              <Link href="#" className="text-lg text-gray-300 hover:text-[#ee9105] transition-colors duration-300">
                NFPA Certified Fire Safety Professional
              </Link>
            </p>
            <p>
              <Link href="#" className="text-lg text-gray-300 hover:text-[#ee9105] transition-colors duration-300">
                ISO 9001:2015 Quality Management
              </Link>
            </p>
            <p>
              <Link href="#" className="text-lg text-gray-300 hover:text-[#ee9105] transition-colors duration-300">
                Emergency Response Team Certification
              </Link>
            </p>
            <p>
              <Link href="#" className="text-lg text-gray-300 hover:text-[#ee9105] transition-colors duration-300">
                Fire Safety Technology Specialist
              </Link>
            </p>
          </div>
        </div>
        <Image src="/images/certificatess.png" alt="Certificates" width={280} height={330} className="rounded-lg w-full max-w-[250px] h-auto" />
      </div>
    </div>
  );
}

export default AboutPage; 