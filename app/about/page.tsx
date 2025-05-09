'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const runtime = "edge";

function AboutPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '10px',
        padding: '40px',
        backgroundColor: '#1a1a1a',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <Image src="/images/whoami.png" alt="Mission" width={300} height={200} style={{
          borderRadius: '10px',
          width: '100%',
          maxWidth: '250px',
          height: 'auto',
        }} />
        <div style={{
          flex: 1,
          padding: '0 20px',
        }}>
          <h2 style={{
            fontSize: '32px',
            marginBottom: '20px',
            fontFamily: 'Crete Round, serif',
            color: 'white',
          }}>WHO AM I?</h2>
          <p style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#d1d1d1',
          }}>
            We are a dedicated team of fire safety professionals committed to protecting lives and property through innovative solutions and cutting-edge technology. Our journey began with a simple mission: to make fire safety accessible and effective for everyone.
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '10px',
        padding: '40px',
        backgroundColor: '#1a1a1a',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          flex: 1,
          padding: '0 20px',
        }}>
          <h2 style={{
            fontSize: '32px',
            marginBottom: '20px',
            fontFamily: 'Crete Round, serif',
            color: 'white',
          }}>Experience</h2>
          <p style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#d1d1d1',
          }}>
            With years of experience in fire safety and emergency management, we have developed comprehensive solutions that have been implemented across numerous facilities. Our team combines technical expertise with practical knowledge to deliver the most effective fire safety systems.
          </p>
        </div>
        <Image src="/images/EXPERIENCE.png" alt="Experience" width={280} height={330} style={{
          borderRadius: '10px',
          width: '100%',
          maxWidth: '250px',
          height: 'auto',
        }} />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '10px',
        padding: '40px',
        backgroundColor: '#1a1a1a',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <Image src="/images/EDCC.png" alt="Education" width={280} height={330} style={{
          borderRadius: '10px',
          width: '100%',
          maxWidth: '250px',
          height: 'auto',
        }} />
        <div style={{
          flex: 1,
          padding: '0 20px',
        }}>
          <h2 style={{
            fontSize: '32px',
            marginBottom: '20px',
            fontFamily: 'Crete Round, serif',
            color: 'white',
          }}>Education</h2>
          <p style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#d1d1d1',
          }}>
            Our team consists of certified professionals with backgrounds in fire safety engineering, emergency management, and technology development. We continuously invest in training and education to stay at the forefront of fire safety innovation.
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '10px',
        padding: '40px',
        backgroundColor: '#1a1a1a',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          flex: 1,
          padding: '0 20px',
        }}>
          <h2 style={{
            fontSize: '32px',
            marginBottom: '20px',
            fontFamily: 'Crete Round, serif',
            color: 'white',
          }}>Certifications</h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <p>
              <Link href="#" style={{
                fontSize: '18px',
                color: '#d1d1d1',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }} onMouseOver={(e) => e.currentTarget.style.color = '#ee9105'} 
                 onMouseOut={(e) => e.currentTarget.style.color = '#d1d1d1'}>
                NFPA Certified Fire Safety Professional
              </Link>
            </p>
            <p>
              <Link href="#" style={{
                fontSize: '18px',
                color: '#d1d1d1',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }} onMouseOver={(e) => e.currentTarget.style.color = '#ee9105'} 
                 onMouseOut={(e) => e.currentTarget.style.color = '#d1d1d1'}>
                ISO 9001:2015 Quality Management
              </Link>
            </p>
            <p>
              <Link href="#" style={{
                fontSize: '18px',
                color: '#d1d1d1',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }} onMouseOver={(e) => e.currentTarget.style.color = '#ee9105'} 
                 onMouseOut={(e) => e.currentTarget.style.color = '#d1d1d1'}>
                Emergency Response Team Certification
              </Link>
            </p>
            <p>
              <Link href="#" style={{
                fontSize: '18px',
                color: '#d1d1d1',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }} onMouseOver={(e) => e.currentTarget.style.color = '#ee9105'} 
                 onMouseOut={(e) => e.currentTarget.style.color = '#d1d1d1'}>
                Fire Safety Technology Specialist
              </Link>
            </p>
          </div>
        </div>
        <Image src="/images/certificatess.png" alt="Certificates" width={280} height={330} style={{
          borderRadius: '10px',
          width: '100%',
          maxWidth: '250px',
          height: 'auto',
        }} />
      </div>
    </div>
  );
}

export default AboutPage; 