const testWords = [
  'Directeur(trice) Commercial(e)',
  'Masseur(se) professionnel(le)',
  // ----
  "Maitre(sse) d'accueil",
  'Aide-soignant(e)',
  'Aide familal(e)',
  'Spa praticien(ne) de bien-être',
  'Chanteur(euse)',
  'Aide-soignant(e)',
  'Infirmier(ère)',
  'Nettoyeur(se)',
  'Agent(e)',
  "Hôte(sse) d'accueil",
  'Réalisateur(rice)',
  'Manipulateur(trice)',
  'Electrien(ne)',
  // ----
  "Maitre/sse d'accueil",
  'Chanteur/euse',
  'Chanteur/se',
  'Aide-soignant/e',
  'Aide familal/e',
  'Agent/e',
  "Hôte/sse d'accueil",
  'Réalisateur/rice',
  'Manipulateur/trice',
  'Electrien/ne',
  // ----
  'Agent/Agente',
  'Gouvernante/gouvernant',
  'Aide-soignant/Aide-soignante',
  "Hôte/Hôtesse d'accueil",
  'Femme/homme de service',
  'Valet/femme de chambre',
  'Homme/ Femme de chambre',
];

const buildFeminine = (masculine, suffix) => {
  let word = `${masculine}`;
  switch (suffix) {
    case 'euse': {
    	// la fin du masculin est "eur"
      word = word.substring(0, word.length - 3) + suffix;
      break;
    }
    case 'se': {
      if (word.substring(word.length - 3) === 'eur') {
        word = word.substring(0, word.length - 1) + suffix;
      }
      break;
    }
    case 'ère': {
    	// la fin du masculin est "er"
      word = word.substring(0, word.length - 2) + suffix;
      break;
    }
    case 'rice': {
    	// la fin du masculin est "eur"
      word = word.substring(0, word.length - 3) + suffix;
      break;
    }
    case 'trice': {
    	// la fin du masculin est "teur"
      word = word.substring(0, word.length - 4) + suffix;
      break;
    }
    case 'esse': {
    	// la fin du masculin est "e"
      word = word.substring(0, word.length - 1) + suffix;
      break;
    }
    case 'sse':
    case 'nne':
    case 'ne':
    case 'le':
    case 'e': {
      word = `${word}${suffix}`;
      break;
    }
  }
  return word;
};

const parseGenderWords = (words) => {
  const hasParenthesisOrSlash = words.filter(
    w => w.indexOf('(') > -1 || w.indexOf('/') > -1,
  );
  if (hasParenthesisOrSlash.length === 0) {
    return words;
  }
  const wordsWithFeminine = [];
  for (const w of words) {
    let hasGender = false;
    let mVersion = null;
    let fVersion = null;
    for (const match of w.matchAll(
        /([\wà-üÀ-Ü\ \-\']+)\((euse|e|esse|le|ère|sse|se|ne|trice|rice)\)(\ [\wà-üÀ-Ü\ \-\']+)+\((euse|e|esse|le|ère|sse|se|ne|trice|rice)\)/gm,
      )) {
      const mVersionPart1 = match[1];
      const mVersionPart2 = match[3];
      const fVersionPart1Suffix = match[2];
      const fVersionPart2Suffix = match[4];
      mVersion = null;
      fVersion = null;
      if (mVersionPart1 && mVersionPart1.length > 0 && mVersionPart2 && mVersionPart2.length > 0 && fVersionPart1Suffix && fVersionPart1Suffix.length > 0 && fVersionPart2Suffix && fVersionPart2Suffix.length > 0) {
        fVersion = `${buildFeminine(mVersionPart1, fVersionPart1Suffix)}${buildFeminine(mVersionPart2, fVersionPart2Suffix)}`;
        mVersion = `${mVersionPart1}${mVersionPart2}`;
        hasGender = true;
      }
    }
    if (!hasGender) {
      for (const match of w.matchAll(
          /([\wà-üÀ-Ü\ \-\']+)\((euse|e|esse|le|ère|sse|se|ne|trice|rice)\)($|(\ [\wà-üÀ-Ü\-\']+)+)/gm,
        )) {
        mVersion = match[1];
        const fSuffix = match[2];
        fVersion = null;
        if (
          mVersion &&
          mVersion.length > 0 &&
          fSuffix &&
          fSuffix.length > 0
        ) {
          fVersion = `${buildFeminine(mVersion, fSuffix)}${match[3]}`;
          mVersion = `${mVersion}${match[3]}`;
          hasGender = true;
        }
      }
    }
    if (!hasGender) {
      for (const match of w.matchAll(
          /([\wà-üÀ-Ü\ \-\']+)\/(euse|e|esse|le|ère|sse|se|ne|trice|rice)($|(\ [\wà-üÀ-Ü\-\']+)+)/gm,
        )) {
        mVersion = match[1];
        const fSuffix = match[2];
        fVersion = null;
        if (
          mVersion &&
          mVersion.length > 0 &&
          fSuffix &&
          fSuffix.length > 0
        ) {
          fVersion = `${buildFeminine(mVersion, fSuffix)}${match[3]}`;
          mVersion = `${mVersion}${match[3]}`;
          hasGender = true;
        }
      }
    }
    if (!hasGender) {
      for (const match of w.matchAll(
          /([\wà-üÀ-Ü\-\']+)\/(\ {0,1}[\wà-üÀ-Ü\-\']+)($|(\ [\wà-üÀ-Ü\-\']+)+)/gm,
        )) {
        mVersion = match[1] ? match[1].trim() : ''; // le debut avant le slash
        fVersion = match[2] ? match[2].trim() : ''; // après le slash, jusqu'à avant un espace
        if (
          mVersion &&
          mVersion.length > 2 &&
          fVersion &&
          fVersion.length > 2
        ) {
          fVersion = fVersion.charAt(0).toUpperCase() + fVersion.slice(1);

          if (
            fVersion.toLowerCase().substring(0, 4) ==
            mVersion.toLowerCase().substring(0, 4) ||
            fVersion.toLowerCase().substring(0, 5) == 'femme' ||
            fVersion.toLowerCase().substring(0, 5) == 'homme'
          ) {
            mVersion += match[3];
            fVersion += match[3];
            hasGender = true;
          }
        }
      }
    }
    if (hasGender) {
      wordsWithFeminine.push(mVersion);
      wordsWithFeminine.push(fVersion);
      if (fVersion.toLowerCase().substring(0, 5) == 'chefe') {
        wordsWithFeminine.push(
          fVersion.replace('Chefe', 'Cheffe').replace('chefe', 'cheffe'),
        );
      }
    } else {
      wordsWithFeminine.push(w);
    }
  }
  return wordsWithFeminine;
}



const splitHF = parseGenderWords(testWords);

console.log(splitHF);

