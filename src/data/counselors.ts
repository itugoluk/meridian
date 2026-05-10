export type Counselor = {
  id: string;
  name: string;
  title: string;
  focus: string[];
  yearsExperience: number;
  avatarSeed: string;
  bio: string;
  acceptanceRecord: string;
  hourlyRate: number;
  languages: string[];
};

export const COUNSELORS: Counselor[] = [
  { id: "lalitha", name: "Lalitha Venkataraman", title: "Former Dean of Admissions, Northwestern", focus: ["Ivy+", "Pre-med", "Liberal Arts"], yearsExperience: 21, avatarSeed: "lalitha-v", bio: "Read 14,000+ applications across two decades on the admit side; now coaches families through the full arc.", acceptanceRecord: "82% admit rate to T20 schools across past three cycles", hourlyRate: 340, languages: ["English", "Tamil"] },
  { id: "soren", name: "Sören Lindqvist", title: "Oxford & Cambridge Specialist", focus: ["Oxbridge", "PPE", "Natural Sciences", "UK"], yearsExperience: 14, avatarSeed: "soren-l", bio: "Oxford PPE alumnus, mock-interviewer for 600+ UK candidates. Lives in the LNAT/TSA weeds.", acceptanceRecord: "11 admits to Oxford & 9 to Cambridge in 2024 cycle", hourlyRate: 285, languages: ["English", "Swedish", "German"] },
  { id: "amara", name: "Amara Okonkwo-Reilly", title: "Essay & Narrative Coach", focus: ["Personal essay", "Supplements", "Common App"], yearsExperience: 9, avatarSeed: "amara-o", bio: "Former New Yorker fact-checker turned essay coach. Specializes in turning quiet stories into sharp ones.", acceptanceRecord: "147 essays edited last cycle; 71% admit to first-choice", hourlyRate: 195, languages: ["English"] },
  { id: "kenji", name: "Kenji Morimoto", title: "STEM & Research Pathway Advisor", focus: ["MIT", "Caltech", "ETH", "Research"], yearsExperience: 12, avatarSeed: "kenji-m", bio: "MIT EECS PhD; mentors students on independent research projects worth writing about.", acceptanceRecord: "6 MIT admits and 4 Caltech admits in last two cycles", hourlyRate: 310, languages: ["English", "Japanese"] },
  { id: "fatima", name: "Fátima Bouhlal-Marín", title: "European Universities & Aid Strategist", focus: ["Netherlands", "Spain", "Germany", "Switzerland"], yearsExperience: 7, avatarSeed: "fatima-b", bio: "Trilingual advisor based in Barcelona. Maps the Bachillerato/IB-to-Europe path for international families.", acceptanceRecord: "Average tuition cost for clients last year: €3,400", hourlyRate: 165, languages: ["English", "Spanish", "French", "Arabic"] },
];
