import { SpeakerProfile } from '@/types/podcast';

export const SPEAKER_PROFILES: SpeakerProfile[] = [
  {
    id: 0,
    name: "Mai Lan",
    gender: "Female",
    age: 20,
    mc_guidelines: "+ Explanatory \n+ Comparative\n+ Reflective",
    speed: 1.0 // Default speed
  },
  {
    id: 1,
    name: "Minh Tú",
    gender: "Male",
    age: 30,
    mc_guidelines: "+ Formal \n+ Informative \n+ Descriptive \n+ Objective",
    speed: 1.0 // Default speed
  }
];
