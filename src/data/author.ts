import { Author } from '../types';

export const authorMuhammad: Author = {
  id: 'author-muhammad',
  name: 'Muhammad Harpal',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  bio: 'Allotment holder and organic kitchen gardener with 15+ years of practical cultivation experience across Surrey and Greater London. Founder of Green Gardan.',
  role: 'Founder & Head Horticultural Editor'
};

export const authorFiona: Author = {
  id: 'author-fiona',
  name: 'Fiona Campbell',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  bio: 'RHS-certified Master Horticulturist and allotment keeper with 18+ years of organic cultivation experience across Somerset and Greater London.',
  role: 'Senior Horticultural Editor (RHS Master)'
};

export const authorEleanor: Author = {
  id: 'author-eleanor',
  name: 'Eleanor Vance',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bio: 'Plant ecologist and native flora specialist based in Devon, leading Green Gardan’s wildlife gardening, pollinator habitats, and biodiversity conservation.',
  role: 'Native Flora & Biodiversity Lead'
};

export const authorAlistair: Author = {
  id: 'author-alistair',
  name: 'Dr. Alistair Ross',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  bio: 'PhD in Environmental Soil Science (Univ. of Edinburgh). Advises Green Gardan on compost microbiology, regenerative cultivation, and peat-free soil management.',
  role: 'Soil Science & Organic Cultivation Advisor'
};

export const defaultAuthor: Author = authorMuhammad;

export const allAuthors: Author[] = [
  authorMuhammad,
  authorFiona,
  authorEleanor,
  authorAlistair
];
