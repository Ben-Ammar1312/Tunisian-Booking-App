// *** USE THE SAME INDICES THE LabelEncoder PRODUCED ***
// --- example order below ---
export const locationMap: Record<string, number> = {
  'Ariana': 0, 'Beja': 1, 'Ben Arous': 2, 'Bizerte': 3,
  'Gabes': 4, 'Gafsa': 5, 'Jendouba': 6, 'Kairouan': 7,
  'Kasserine': 8, 'Kebili': 9, 'Kef': 10, 'Mahdia': 11,
  'Manouba': 12, 'Medenine': 13, 'Monastir': 14, 'Nabeul': 15,
  'Sfax': 16, 'Sidi Bouzid': 17, 'Siliana': 18, 'Sousse': 19,
  'Tataouine': 20, 'Tozeur': 21, 'Zaghouan': 22, 'Tunis': 23
};

export const typeMap: Record<string, number> = {
  'Appartement': 0,
  'Maison':      1,
  'Condo':       2,
  'Villa':       3
};
