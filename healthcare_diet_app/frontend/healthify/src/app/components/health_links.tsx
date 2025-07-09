import React from 'react';

const healthcareLinks = [
  {
    name: 'World Health Organization (WHO)',
    url: 'https://www.who.int/',
    description: 'International public health authority providing trusted health information and resources.'
  },
  {
    name: 'Centers for Disease Control and Prevention (CDC)',
    url: 'https://www.cdc.gov/',
    description: 'US-based authority on disease control, prevention, and health education.'
  },
  {
    name: 'National Institutes of Health (NIH)',
    url: 'https://www.nih.gov/',
    description: 'Medical research agency providing health information and research updates.'
  },
  {
    name: 'Mayo Clinic',
    url: 'https://www.mayoclinic.org/',
    description: 'Trusted source for patient care, medical research, and health information.'
  },
  {
    name: 'WebMD',
    url: 'https://www.webmd.com/',
    description: 'Popular site for health news, symptom checkers, and medical information.'
  },
  {
    name: 'MedlinePlus',
    url: 'https://medlineplus.gov/',
    description: 'Reliable health information from the US National Library of Medicine.'
  },
  {
    name: 'Healthline',
    url: 'https://www.healthline.com/',
    description: 'Evidence-based health and wellness information.'
  },
  {
    name: 'Cleveland Clinic',
    url: 'https://my.clevelandclinic.org/',
    description: 'Comprehensive health information and patient care resources.'
  },
  {
    name: 'Ministry of Health and Family Welfare (MoHFW), Government of India',
    url: 'https://www.mohfw.gov.in/',
    description: 'Official government portal for health policies, updates, and resources in India.'
  },
  {
    name: 'Indian Council of Medical Research (ICMR)',
    url: 'https://www.icmr.gov.in/',
    description: 'India’s apex body for the formulation, coordination, and promotion of biomedical research.'
  },
  {
    name: 'National Health Portal of India',
    url: 'https://www.nhp.gov.in/',
    description: 'Comprehensive health information and services for Indian citizens.'
  },
  {
    name: 'AIIMS (All India Institute of Medical Sciences)',
    url: 'https://www.aiims.edu/en.html',
    description: 'Premier medical institute in India providing health information and patient care.'
  },
];

const HealthLinks: React.FC = () => (
  <div className="flex flex-col items-center w-full max-w-3xl mx-auto mt-12 mb-12">
    <h2 className="text-2xl font-bold text-white mb-6">Trusted Healthcare Resources</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {healthcareLinks.map(link => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gray-800 rounded-lg shadow-md p-5 hover:bg-blue-900 transition-colors border border-gray-700"
        >
          <div className="text-lg font-semibold text-blue-300 mb-1">{link.name}</div>
          <div className="text-gray-300 text-sm">{link.description}</div>
        </a>
      ))}
    </div>
  </div>
);

export default HealthLinks; 