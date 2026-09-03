/**
 * מיפוי הנכסים החזותיים לתפקיד שלהם בדף.
 * alt נכתב לקורא מסך, לא לקידום.
 */

export const images = {
  /** גרסה חתוכה ושקופה — לשימוש בדף. logoOriginal נשמר כמקור. */
  logo: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345420/nashima-studio/brand/logo-nashima-mark.png",
    alt: "סטודיו נשימה",
    width: 631,
    height: 605,
  },
  /**
   * הסימן בלבד, בלי המילה "נשימה" שמתחתיו — נחתך מ-logo-nashima-mark.
   * לשימוש במקומות עגולים וקטנים שבהם המילה לא הייתה נקראת בכל מקרה.
   */
  logoGlyph: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345418/nashima-studio/brand/logo-nashima-glyph.png",
    alt: "סטודיו נשימה",
    width: 584,
    height: 411,
  },
  logoOriginal: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345423/nashima-studio/brand/logo-nashima.png",
    alt: "סטודיו נשימה",
  },
  studioEmpty: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345427/nashima-studio/studio/studio-room-empty.png",
    alt: "חדר האימון של סטודיו נשימה, מזרנים פרושים ואור טבעי מהחלונות",
  },
  groupSideStretch: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345462/nashima-studio/studio/studio-group-side-stretch.png",
    alt: "קבוצת מתאמנים בישיבה מבצעת מתיחת צד בהנחיית נועה",
  },
  groupBridge: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345457/nashima-studio/studio/studio-group-bridge-pose.png",
    alt: "קבוצת מתאמנים שוכבת על מזרנים בתרגיל גשר, נועה מדגימה",
  },
  oneOnOne: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345468/nashima-studio/neta/neta-one-on-one-training.png",
    alt: "נועה מלווה מתאמנת בתרגיל על המזרן",
  },
  netaTeaching: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345497/nashima-studio/neta/neta-teaching-gesture.png",
    alt: "נועה מסבירה תרגיל לקבוצה",
  },
  netaPortrait: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345483/nashima-studio/neta/neta-portrait-seated-mat.png",
    alt: "נועה שגב, מדריכה ובעלת סטודיו נשימה",
  },
  netaStanding: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345492/nashima-studio/neta/neta-portrait-standing-full.png",
    alt: "נועה שגב עומדת בסטודיו",
  },
  netaCloseup: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345486/nashima-studio/neta/neta-portrait-closeup.png",
    alt: "נועה שגב",
  },
  netaCrossedArms: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345494/nashima-studio/neta/neta-portrait-standing-crossed-arms.png",
    alt: "נועה שגב",
  },
  equipmentFloor: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345445/nashima-studio/studio/studio-equipment-flatlay-floor.png",
    alt: "מזרן נפרש לצד טבעת פילאטיס, כדור, בלוקים, רצועה וגרבי אחיזה",
  },
  equipmentTable: {
    src: "https://res.cloudinary.com/qxawzkp2/image/upload/v1788345450/nashima-studio/studio/studio-equipment-flatlay-table.png",
    alt: "ציוד הסטודיו מסודר על שולחן הכניסה",
  },
} as const;
