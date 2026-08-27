/**
 * מיפוי הנכסים החזותיים לתפקיד שלהם בדף.
 * alt נכתב לקורא מסך, לא לקידום.
 */

export const images = {
  /** גרסה חתוכה ושקופה — לשימוש בדף. logoOriginal נשמר כמקור. */
  logo: {
    src: "/images/logo-nashima-mark.png",
    alt: "סטודיו נשימה",
    width: 631,
    height: 605,
  },
  /**
   * הסימן בלבד, בלי המילה "נשימה" שמתחתיו — נחתך מ-logo-nashima-mark.
   * לשימוש במקומות עגולים וקטנים שבהם המילה לא הייתה נקראת בכל מקרה.
   */
  logoGlyph: {
    src: "/images/logo-nashima-glyph.png",
    alt: "סטודיו נשימה",
    width: 584,
    height: 411,
  },
  logoOriginal: {
    src: "/images/logo-nashima.png",
    alt: "סטודיו נשימה",
  },
  studioEmpty: {
    src: "/images/studio-room-empty.png",
    alt: "חדר האימון של סטודיו נשימה, מזרנים פרושים ואור טבעי מהחלונות",
  },
  groupSideStretch: {
    src: "/images/studio-group-side-stretch.png",
    alt: "קבוצת מתאמנים בישיבה מבצעת מתיחת צד בהנחיית נטע",
  },
  groupBridge: {
    src: "/images/studio-group-bridge-pose.png",
    alt: "קבוצת מתאמנים שוכבת על מזרנים בתרגיל גשר, נטע מדגימה",
  },
  oneOnOne: {
    src: "/images/neta-one-on-one-training.png",
    alt: "נטע מלווה מתאמנת בתרגיל על המזרן",
  },
  netaTeaching: {
    src: "/images/neta-teaching-gesture.png",
    alt: "נטע מסבירה תרגיל לקבוצה",
  },
  netaPortrait: {
    src: "/images/neta-portrait-seated-mat.png",
    alt: "נטע שגיב, מדריכה ובעלת סטודיו נשימה",
  },
  netaStanding: {
    src: "/images/neta-portrait-standing-full.png",
    alt: "נטע שגיב עומדת בסטודיו",
  },
  netaCloseup: {
    src: "/images/neta-portrait-closeup.png",
    alt: "נטע שגיב",
  },
  netaCrossedArms: {
    src: "/images/neta-portrait-standing-crossed-arms.png",
    alt: "נטע שגיב",
  },
  equipmentFloor: {
    src: "/images/studio-equipment-flatlay-floor.png",
    alt: "מזרן נפרש לצד טבעת פילאטיס, כדור, בלוקים, רצועה וגרבי אחיזה",
  },
  equipmentTable: {
    src: "/images/studio-equipment-flatlay-table.png",
    alt: "ציוד הסטודיו מסודר על שולחן הכניסה",
  },
} as const;

/** רקע נע ב-Hero — דסקטופ בלבד, עם תמונה חלופית במובייל. */
export const heroVideo = {
  src: "/video/studio-class-loop.mp4",
  poster: images.studioEmpty.src,
} as const;
