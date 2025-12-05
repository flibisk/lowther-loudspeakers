/**
 * Speakers Data Module
 * 
 * This module provides TypeScript types and helper functions for accessing
 * speaker data throughout the application. The data structure is optimized
 * for AEO (Answer Engine Optimization) and includes comprehensive metadata.
 */

// Type definitions based on the expected JSON structure
export interface SpeakerImages {
  base?: string;
  hero?: string;
  gallery?: string;
  details?: string;
  technical?: string;
}

export interface SpeakerTechnical {
  colour_options?: string;
  horn_type?: string;
  driver_size?: string;
  recommended_driver?: string;
  alternative_drivers?: string[];
  sensitivity?: string;
  impedance?: string;
  frequency_response?: string;
  dimensions_mm?: {
    height?: number;
    width?: number;
    depth?: number;
  };
  weight?: number | string;
  enclosure_type?: string;
  materials?: {
    cabinet?: string;
    finish?: string;
    internal_bracing?: string;
  };
  power_handling?: string;
}

export interface SpeakerDesign {
  designer?: string;
  year_launched?: string;
  design_philosophy?: string;
  unique_features?: string[];
  target_room_size?: string;
  placement?: string;
}

export interface SpeakerMarket {
  price_tier?: string;
  target_audience?: string;
  positioning?: string;
  competitors?: string[];
}

export interface SpeakerSEO {
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
}

export interface SpeakerContent {
  short_description?: string;
  long_description?: string;
  seo?: SpeakerSEO;
  key_benefits?: string[];
  use_cases?: string[];
  design_philosophy?: string;
  unique_features?: string[];
  target_room_size?: string;
  placement?: string;
  target_audience?: string;
  positioning?: string;
  competitors?: string[];
}

export interface Speaker {
  id: string;
  title: string;
  slug: string;
  feeling?: string;
  image?: string;
  href: string;
  images?: SpeakerImages;
  technical?: SpeakerTechnical;
  design?: SpeakerDesign;
  market?: SpeakerMarket;
  content?: SpeakerContent;
  seo?: SpeakerSEO;
}

// Speakers data - single source of truth for all loudspeaker products
export const SPEAKERS: Record<string, Speaker> = {
  "acousta-quarter-wave": {
    "id": "acousta-quarter-wave",
    "title": "Acousta QW",
    "slug": "acousta-quarter-wave",
    "feeling": "Hidden Presence",
    "href": "/loudspeakers/acousta-quarter-wave",
    "image": "/images/card-images/card-image-acousta-quarter-wave.webp",
    "images": {
      "base": "/images/speakers/acousta-quarter-wave/",
      "hero": "hero/",
      "gallery": "gallery/",
      "details": "details/",
      "technical": "technical/"
    },
    "technical": {
      "colour_options": "Bespoke real wood veneer, hand matched pairs",
      "horn_type": "Voigt horn",
      "driver_size": "8\" full range",
      "recommended_driver": "PM7A Philharmonic",
      "alternative_drivers": [
        "PM6A Sinfonia",
        "DX3 Sinfonia"
      ],
      "sensitivity": "Approx. 98 dB / 1W / 1m (with PM7A)",
      "impedance": "Nominal 8 Ω",
      "frequency_response": "Approx. 40 Hz to 20 kHz in room",
      "dimensions_mm": {
        "height": 1055,
        "width": 820,
        "depth": 600
      },
      "weight": 45,
      "enclosure_type": "Acousta Quarter Wave Cabinet Enclosure",
      "materials": {
        "cabinet": "Real wood veneer over Baltic Birch plywood",
        "finish": "Bespoke hand finished veneer"
      }
    },
    "design": {
      "designer": "Lowther Loudspeakers",
      "year_launched": "1950s heritage concept, current revision 2010s",
      "design_philosophy": "Lowther single driver philosophy in a corner firing Voigt quarter wave horn that can disappear visually while filling the room with natural sound.",
      "unique_features": [
        "Corner firing folded quarter wave horn that can sit behind furniture and still load the room correctly.",
        "Single full range Lowther driver with no crossover in the audio band for phase coherent reproduction.",
        "Cabinet geometry based on Paul Voigt principles, refined with modern materials for stability and long term reliability."
      ],
      "target_room_size": "20 m2+",
      "placement": "Anywhere where there is a wall, even behind furniture."
    },
    "market": {
      "price_tier": "£8,000+",
      "target_audience": "Age 40 to 65. Upper middle income households £120k to £250k. Senior managers, engineers, academics, architects, IT professionals and creative freelancers who want to step into serious horn loaded loudspeakers and value British craftsmanship and a simple upgrade path.",
      "positioning": "Quarter wave accuracy for music lovers who want real horn character at home.",
      "competitors": [
        "Focal",
        "DALI",
        "Acapella Audio Arts",
        "Oswalds Mill Audio",
        "Klipsch Heritage Series"
      ]
    },
    "content": {
      "short_description": "Corner firing Voigt quarter wave horn that hides against the wall yet delivers full scale Lowther performance.",
      "long_description": "The Acousta Quarter Wave was created for listeners who want true horn performance without letting the loudspeaker dominate the room. Firing at a precise angle into the corner, the folded Voigt quarter wave horn uses the surrounding walls to develop clean, tight bass and the natural midrange that defines the Lowther sound.\n\nWith a single 8 inch Lowther driver working without a complex crossover, timing and presence remain intact, giving voices and instruments an uncanny realism even at modest levels. Placed behind furniture or tight to the wall, the Acousta QW turns a living room or office into a discreet listening space where music takes centre stage rather than the cabinet.",
      "seo": {
        "meta_title": "Lowther Acousta QW Corner Horn Loudspeaker",
        "meta_description": "Corner firing Voigt quarter wave horn that hides against the wall yet delivers full scale Lowther single driver performance.",
        "keywords": [
          "Lowther Acousta QW",
          "corner horn loudspeaker",
          "Voigt quarter wave",
          "single driver speaker",
          "British high end audio"
        ]
      }
    }
  },
  "acousta-117": {
    "id": "acousta-117",
    "title": "Acousta 117",
    "slug": "acousta-117",
    "feeling": "Timeless Classic",
    "href": "/loudspeakers/acousta-117",
    "image": "/images/card-images/card-image-acousta-117.webp",
    "images": {
      "base": "/images/speakers/acousta-117/",
      "hero": "hero/",
      "gallery": "gallery/",
      "details": "details/",
      "technical": "technical/"
    },
    "technical": {
      "colour_options": "Bespoke real wood veneer, hand matched pairs",
      "horn_type": "Voigt horn",
      "driver_size": "8\" full range",
      "recommended_driver": "PM6A Philharmonic",
      "alternative_drivers": [
        "PM7A Philharmonic",
        "DX3 Sinfonia"
      ],
      "sensitivity": "Approx. 98 dB / 1W / 1m (with PM6A)",
      "impedance": "Nominal 8 Ω",
      "frequency_response": "Approx. 40 Hz to 20 kHz in room",
      "dimensions_mm": {
        "height": 905,
        "width": 470,
        "depth": 375
      },
      "weight": 35,
      "enclosure_type": "Acousta 117 Cabinet Enclosure",
      "materials": {
        "cabinet": "18 mm Baltic Birch plywood with real wood veneer, 12 mm internal labyrinth",
        "finish": "Bespoke hand finished veneer with removable cloth grilles"
      }
    },
    "design": {
      "designer": "Lowther Loudspeakers",
      "year_launched": "1950s heritage concept, current 117 revision 2000s",
      "design_philosophy": "Lowther single driver philosophy in a front firing folded Voigt horn that works in real rooms without needing corners.",
      "unique_features": [
        "Front loaded folded horn evolved from the classic 115 and 116 designs.",
        "High quality Baltic Birch construction with increased panel thickness and refined internal labyrinth.",
        "Designed for a wide range of 8 inch Lowther drive units, giving owners long term upgrade flexibility."
      ],
      "target_room_size": "20 m2+",
      "placement": "Front Stereo"
    },
    "market": {
      "price_tier": "£8,000+",
      "target_audience": "Age 40 to 65. Upper middle income households £120k to £250k. Senior managers, engineers, academics and creative professionals who want to enter serious horn loaded audio.",
      "positioning": "Serious horn performance for listeners stepping into high end audio.",
      "competitors": [
        "Focal",
        "DALI",
        "Acapella Audio Arts",
        "Oswalds Mill Audio",
        "Klipsch Heritage Series"
      ]
    },
    "content": {
      "short_description": "Front loaded Voigt horn classic that brings the full Lowther experience into real world rooms.",
      "long_description": "The Acousta 117 is the latest development of Lowther's most recognised folded horn design. Built from thick Baltic Birch and refined with modern damping and adhesives, it offers rigidity and clean bass performance while preserving the immediacy that defines the Lowther sound.\n\nPaired with a PM6A or PM7A driver, the 117 is easy to place and suits a wide range of musical preferences, making it one of the most versatile entry points into high efficiency horn loudspeakers.",
      "seo": {
        "meta_title": "Lowther Acousta 117 Front Loaded Horn Loudspeaker",
        "meta_description": "The classic Lowther front loaded Voigt horn, refined with modern materials to deliver natural, room filling single driver sound.",
        "keywords": [
          "Lowther Acousta 117",
          "front horn loudspeaker",
          "single driver high efficiency",
          "British hi fi speakers",
          "folded Voigt horn"
        ]
      }
    }
  },
  "almira": {
    "id": "almira",
    "title": "Almira",
    "slug": "almira",
    "feeling": "Refined Presence",
    "href": "/loudspeakers/almira",
    "image": "/images/card-images/card-image-almira.webp",
    "images": {
      "base": "/images/speakers/almira/",
      "hero": "hero/",
      "gallery": "gallery/",
      "details": "details/",
      "technical": "technical/"
    },
    "technical": {
      "colour_options": "Bespoke real wood veneer, hand matched pairs",
      "horn_type": "Voigt horn",
      "driver_size": "8\" full range with horn loaded supertweeter",
      "recommended_driver": "DX3 Sinfonia",
      "alternative_drivers": [],
      "sensitivity": "Approx. 96 dB / 1W / 1m",
      "impedance": "Nominal 8 Ω",
      "frequency_response": "Approx. 45 Hz to 22 kHz in room",
      "dimensions_mm": {
        "height": 1200,
        "width": 300,
        "depth": 330
      },
      "weight": 27,
      "enclosure_type": "Almira Cabinet Enclosure",
      "materials": {
        "cabinet": "Baltic Birch plywood Voigt pipe with bespoke veneer",
        "finish": "Hand finished veneer with optional top cover grilles"
      }
    },
    "design": {
      "designer": "Lowther Loudspeakers",
      "year_launched": "2010s",
      "design_philosophy": "A refined, slender quarter wave horn built for modern interiors without sacrificing Lowther clarity and immediacy.",
      "unique_features": [
        "2.3 metre single folded Voigt horn with downward firing exit for smooth room loading.",
        "DX3 driver paired with an integrated horn loaded supertweeter for extended high frequency detail.",
        "Linear room response design for reduced listener fatigue in modest spaces."
      ],
      "target_room_size": "20 m2+",
      "placement": "Front Stereo"
    },
    "market": {
      "price_tier": "£15,000+",
      "target_audience": "Age 45 to 70. Household income £200k to £400k. Directors, consultants, tech founders and medical specialists who want a refined horn that suits elegant interiors.",
      "positioning": "A refined horn for design conscious listeners who want presence without scale.",
      "competitors": [
        "Acapella Audio Arts",
        "Oswalds Mill Audio",
        "Focal",
        "DALI",
        "Klipsch Heritage Series"
      ]
    },
    "content": {
      "short_description": "Slender quarter wave Voigt horn that brings Lowther dynamics into design led living spaces.",
      "long_description": "Almira was created as Lowther's first new loudspeaker design in many years. Its tall narrow cabinet hides a long folded Voigt horn that vents at the floor, giving scale and weight unexpected from its compact footprint.\n\nThe DX3 full range driver works without a crossover, supported by a horn loaded supertweeter that integrates seamlessly. Designed for modern living spaces, Almira offers clarity and naturalness without overwhelming the room.",
      "seo": {
        "meta_title": "Lowther Almira Quarter Wave Horn Loudspeaker",
        "meta_description": "Slender quarter wave Voigt horn for design conscious listeners who want Lowther presence without overpowering the room.",
        "keywords": [
          "Lowther Almira",
          "quarter wave horn speaker",
          "DX3 full range",
          "British luxury audio",
          "high end loudspeaker"
        ]
      }
    }
  },
  "edilia": {
    "id": "edilia",
    "title": "Edilia",
    "slug": "edilia",
    "feeling": "Compact Authority",
    "href": "/loudspeakers/edilia",
    "image": "/images/card-images/card-image-edilia.webp",
    "images": {
      "base": "/images/speakers/edilia/",
      "hero": "hero/",
      "gallery": "gallery/",
      "details": "details/",
      "technical": "technical/"
    },
    "technical": {
      "colour_options": "Bespoke real wood veneer, hand matched pairs",
      "horn_type": "Voigt horn",
      "driver_size": "Dual 8\" drivers (full range and tapped bass)",
      "recommended_driver": "PM7A Philharmonic with DX2 Sinfonia tapped bass",
      "alternative_drivers": [],
      "sensitivity": "Approx. 96 dB / 1W / 1m",
      "impedance": "Nominal 6 Ω",
      "frequency_response": "Approx. 35 Hz to 22 kHz in room",
      "dimensions_mm": {
        "height": 1200,
        "width": 300,
        "depth": 330
      },
      "weight": 30,
      "enclosure_type": "Edilia Cabinet Enclosure",
      "materials": {
        "cabinet": "Baltic Birch plywood Voigt pipe with bespoke veneer",
        "finish": "Hand finished veneer with double grille panels"
      }
    },
    "design": {
      "designer": "Lowther Loudspeakers",
      "year_launched": "2010s",
      "design_philosophy": "A more flexible evolution of Almira with adjustable bass behaviour to match a wider range of rooms and equipment.",
      "unique_features": [
        "Tapped DX2 bass driver with an adjustable L Pad network for room matching.",
        "PM7A full range driver running without a crossover for coherence.",
        "Shares Almira's 2.3 metre Voigt horn but offers greater bass authority and tonal shaping."
      ],
      "target_room_size": "20 m2+",
      "placement": "Front Stereo"
    },
    "market": {
      "price_tier": "£19,000+",
      "target_audience": "Age 45 to 70. Household income £250k to £500k. Entrepreneurs, senior executives and collectors who want commanding sound and fine detail in a smaller space.",
      "positioning": "Compact authority for listeners who want detail and reach in real rooms.",
      "competitors": [
        "Acapella Audio Arts",
        "Oswalds Mill Audio",
        "Magico",
        "Wilson Audio",
        "Klipsch Heritage Series"
      ]
    },
    "content": {
      "short_description": "Dual driver quarter wave horn that delivers adjustable bass weight and full Lowther clarity from a compact footprint.",
      "long_description": "Edilia expands the Almira concept for listeners who want more control over bass behaviour. A modified DX2 driver acts as a tapped bass unit with an adjustable network that adapts the cabinet to the room.\n\nThe PM7A full range driver remains free of crossovers, giving Edilia the same immediacy and coherence as other Lowther designs, while offering more authority and tunability for challenging rooms.",
      "seo": {
        "meta_title": "Lowther Edilia Adjustable Bass Quarter Wave Loudspeaker",
        "meta_description": "Compact dual driver Voigt horn with adjustable tapped bass, created for listeners who want precision and reach in real rooms.",
        "keywords": [
          "Lowther Edilia",
          "tapped bass horn",
          "quarter wave loudspeaker",
          "PM7A full range",
          "luxury hi fi speaker"
        ]
      }
    }
  },
  "tp2": {
    "id": "tp2",
    "title": "TP2",
    "slug": "tp2",
    "feeling": "Corner Concert",
    "href": "/loudspeakers/tp2",
    "image": "/images/card-images/card-image-tp2.webp",
    "images": {
      "base": "/images/speakers/tp2/",
      "hero": "hero/",
      "gallery": "gallery/",
      "details": "details/",
      "technical": "technical/"
    },
    "technical": {
      "colour_options": "Bespoke real wood veneer, hand matched pairs",
      "horn_type": "Voigt horn",
      "driver_size": "8\" full range",
      "recommended_driver": "PM4A Philharmonic or Field Coil Grand Opera",
      "alternative_drivers": [
        "PM6A Sinfonia",
        "PM2A Sinfonia"
      ],
      "sensitivity": "Approx. 99 to 100 dB / 1W / 1m",
      "impedance": "Nominal 8 Ω",
      "frequency_response": "Approx. 30 Hz to 20 kHz in room",
      "dimensions_mm": {
        "height": 1110,
        "width": 820,
        "depth": 600
      },
      "weight": 70,
      "enclosure_type": "TP2 Cabinet Enclosure",
      "materials": {
        "cabinet": "18 mm Baltic Birch plywood with vacuum laminated horn curves",
        "finish": "Bespoke hand finished veneer with removable cloth grilles"
      }
    },
    "design": {
      "designer": "Lowther Loudspeakers",
      "year_launched": "1950s TP origins, modern TP2 revision",
      "design_philosophy": "A dual loaded corner horn that uses room boundaries as an active part of the instrument.",
      "unique_features": [
        "Dual loaded horn principle that loads both sides of the diaphragm using carefully shaped horns.",
        "Corner placement boosts scale and efficiency, creating a concert like presentation.",
        "Pre wired for field coil supplies and includes horn loaded supertweeters for extended treble."
      ],
      "target_room_size": "25 m2+",
      "placement": "Corner Horn"
    },
    "market": {
      "price_tier": "£21,000+",
      "target_audience": "Age 40 to 70. Household income £200k to £500k. Long term audiophiles, engineers, aviation professionals and film sound mixers who appreciate engineering depth.",
      "positioning": "True quarter wave depth for listeners who value engineering and scale.",
      "competitors": [
        "Focal",
        "DALI",
        "Acapella Audio Arts",
        "Oswalds Mill Audio",
        "Klipsch Heritage Series"
      ]
    },
    "content": {
      "short_description": "Dual loaded corner horn that turns room corners into part of a concert scale Lowther instrument.",
      "long_description": "The TP2 develops Lowther's historic corner horn concept using modern materials and refined horn geometry. The dual loaded system drives both top and bottom horns, creating dynamic scale and high efficiency in large rooms.\n\nWhen paired with PM4A or field coil drivers, the TP2 produces an impressive sense of space and realism, making it ideal for listening rooms, hospitality venues and performance based installations.",
      "seo": {
        "meta_title": "Lowther TP2 Dual Loaded Corner Horn Loudspeaker",
        "meta_description": "Dual loaded corner horn loudspeaker that uses room boundaries to create concert scale sound with a single Lowther driver.",
        "keywords": [
          "Lowther TP2",
          "corner horn speaker",
          "dual loaded horn",
          "high efficiency loudspeaker",
          "listening bar speakers"
        ]
      }
    }
  },
  "audiovector": {
    "id": "audiovector",
    "title": "AudioVector",
    "slug": "audiovector",
    "feeling": "Grand Scale",
    "href": "/loudspeakers/audiovector",
    "image": "/images/card-images/card-image-audiovector.webp",
    "images": {
      "base": "/images/speakers/audiovector/",
      "hero": "hero/",
      "gallery": "gallery/",
      "details": "details/",
      "technical": "technical/"
    },
    "technical": {
      "colour_options": "Bespoke real wood veneer, hand matched pairs",
      "horn_type": "Voigt horn",
      "driver_size": "Dual 8\" full range drivers",
      "recommended_driver": "PM4A Philharmonic top horn with PM2A Sinfonia front driver",
      "alternative_drivers": [
        "Field Coil Grand Opera (mono builds)"
      ],
      "sensitivity": "Approx. 99 dB / 1W / 1m",
      "impedance": "Nominal 8 Ω",
      "frequency_response": "Approx. 30 Hz to 22 kHz in room",
      "dimensions_mm": {
        "height": 1380,
        "width": 685,
        "depth": 600
      },
      "weight": 60,
      "enclosure_type": "AudioVector Cabinet Enclosure",
      "materials": {
        "cabinet": "Baltic Birch plywood with tractrix inspired horn geometry",
        "finish": "Bespoke veneer with textured internal finishes"
      }
    },
    "design": {
      "designer": "Lowther Loudspeakers",
      "year_launched": "2019",
      "design_philosophy": "A dual driver top dispersal horn for very large rooms and statement systems.",
      "unique_features": [
        "PM4A driver feeding the top horn, paired with a PM2A front driver to create a vast soundstage.",
        "Adjustable top reflectors for room tuning.",
        "Modern reinterpretation of a classic Lowther concept with improved materials and geometry."
      ],
      "target_room_size": "30 m2+",
      "placement": "Front Stereo"
    },
    "market": {
      "price_tier": "£25,000+",
      "target_audience": "Age 45 to 75. Household income £300k to £750k+. Business owners, surgeons, senior finance and legal professionals, aerospace engineers and collectors.",
      "positioning": "A landmark full range horn for collectors who want impact and realism.",
      "competitors": [
        "Acapella Audio Arts",
        "Oswalds Mill Audio",
        "Magico",
        "Wilson Audio",
        "Klipsch Heritage Series"
      ]
    },
    "content": {
      "short_description": "Dual driver top dispersal horn loudspeaker created to fill large rooms with an immersive, sculptural Lowther soundstage.",
      "long_description": "AudioVector represents Lowther's return to grand scale cabinet making. Its dual driver configuration and top dispersal horn create an expansive and immersive soundstage suitable for large rooms and dedicated listening spaces.\n\nHand built with refined proportions and modernised horn geometry, each pair is created for clients who want both visual presence and true Lowther immediacy.",
      "seo": {
        "meta_title": "Lowther AudioVector Dual Driver Horn Loudspeaker",
        "meta_description": "Dual driver top dispersal horn loudspeaker for large spaces, combining classic Lowther speed with a vast, adjustable soundstage.",
        "keywords": [
          "Lowther AudioVector",
          "dual driver horn speaker",
          "top dispersal horn",
          "statement loudspeaker",
          "large room hi fi"
        ]
      }
    }
  },
  "voigt-horn": {
    "id": "voigt-horn",
    "title": "Voigt Horn",
    "slug": "voigt-horn",
    "feeling": "Pure Legacy",
    "href": "/loudspeakers/voigt-horn",
    "image": "/images/card-images/card-image-voigt-horn.webp",
    "images": {
      "base": "/images/speakers/voigt-horn/",
      "hero": "hero/",
      "gallery": "gallery/",
      "details": "details/",
      "technical": "technical/"
    },
    "technical": {
      "colour_options": "Bespoke real wood veneer, hand matched pairs",
      "horn_type": "Voigt horn",
      "driver_size": "8\" full range",
      "recommended_driver": "Field Coil Grand Opera",
      "alternative_drivers": [
        "PM4A Grand Opera",
        "PM7A Grand Opera"
      ],
      "sensitivity": "Approx. 100 dB / 1W / 1m",
      "impedance": "Nominal 8 Ω",
      "frequency_response": "Approx. 25 Hz to 20 kHz in room",
      "dimensions_mm": {
        "height": 1140,
        "width": 1130,
        "depth": 600
      },
      "weight": 80,
      "enclosure_type": "Voigt Horn Cabinet Enclosure",
      "materials": {
        "cabinet": "Precision bent plywood tractrix horn with veneered interior",
        "finish": "Bespoke veneer options and industrial influenced exterior"
      }
    },
    "design": {
      "designer": "Lowther Loudspeakers",
      "year_launched": "Original 1920s Voigt design, modern Lowther edition 2020s",
      "design_philosophy": "To recreate Paul Voigt's original tractrix cinema horn as a domestic instrument of exceptional scale and purity.",
      "unique_features": [
        "Full scale tractrix horn recreated from original Voigt mathematics.",
        "Interior fully veneered while keeping historical industrial exterior cues.",
        "Optimised for Lowther's highest grade field coil and Grand Opera drivers."
      ],
      "target_room_size": "30 m2+",
      "placement": "Front Stereo"
    },
    "market": {
      "price_tier": "£70,000+",
      "target_audience": "Age 50 to 80. High net worth collectors with interest in British heritage and historically significant audio designs.",
      "positioning": "The definitive Voigt experience for high net worth collectors who want a statement of heritage.",
      "competitors": [
        "Wilson Audio",
        "Backes & Müller",
        "California Audio Technology",
        "Magico",
        "Klipsch Heritage Series"
      ]
    },
    "content": {
      "short_description": "Full scale recreation of Paul Voigt's original tractrix horn, built as a domestic instrument for the most demanding collectors.",
      "long_description": "The Voigt Horn revives one of audio's earliest and most important innovations. Using Paul Voigt's exact tractrix calculations, Lowther has created the first domestic stereo pair of these monumental horns, crafted with modern materials and veneered interiors.\n\nPaired with Lowther's Grand Opera or field coil drivers, the Voigt Horn delivers a level of immediacy and presence rarely encountered, making it a pinnacle piece for collectors.",
      "seo": {
        "meta_title": "Lowther Voigt Horn Tractrix Loudspeaker",
        "meta_description": "Full scale 4 foot Voigt tractrix horn recreated for stereo, built for collectors who want the closest link to Paul Voigt's original vision.",
        "keywords": [
          "Lowther Voigt Horn",
          "tractrix horn speaker",
          "Paul Voigt design",
          "field coil loudspeaker",
          "statement hi fi"
        ]
      }
    }
  },
  "hegeman": {
    "id": "hegeman",
    "title": "Hegeman",
    "slug": "hegeman",
    "feeling": "Legend Reborn",
    "href": "/loudspeakers/hegeman",
    "image": "/images/card-images/card-image-hegeman.webp",
    "images": {
      "base": "/images/speakers/hegeman/",
      "hero": "hero/",
      "gallery": "gallery/",
      "details": "details/",
      "technical": "technical/"
    },
    "technical": {
      "colour_options": "Bespoke real wood veneer, hand matched pairs",
      "horn_type": "Voigt horn",
      "driver_size": "8\" full range",
      "recommended_driver": "Field Coil Grand Opera or PM4A Philharmonic",
      "alternative_drivers": [
        "PM4A Grand Opera",
        "PM7A Grand Opera"
      ],
      "sensitivity": "Approx. 99 to 100 dB / 1W / 1m",
      "impedance": "Nominal 8 Ω",
      "frequency_response": "Approx. 25 Hz to 20 kHz in room",
      "dimensions_mm": {
        "height": 1140,
        "width": 1130,
        "depth": 600
      },
      "weight": 90,
      "enclosure_type": "Hegeman Cabinet Enclosure",
      "materials": {
        "cabinet": "Meticulously crafted wooden reconstruction of the original plaster Hegeman horn",
        "finish": "Bespoke veneer with refined exterior surfaces"
      }
    },
    "design": {
      "designer": "Lowther Loudspeakers",
      "year_launched": "Original 1954 Hegeman Reproducer, Lowther modern reissue 2020s",
      "design_philosophy": "To honour the Stewart Hegeman and Donald Chave collaboration with a higher performance and more durable wooden horn.",
      "unique_features": [
        "Wooden re creation of the original plaster Hegeman horn for improved longevity and acoustics.",
        "Built to accept Lowther's finest field coil and Philharmonic drivers.",
        "Produced in extremely limited numbers with specialist installation."
      ],
      "target_room_size": "30 m2+",
      "placement": "Front Stereo"
    },
    "market": {
      "price_tier": "£70,000+",
      "target_audience": "Age 50 to 80. High net worth collectors who value vintage audio heritage, industrial design and modern precision engineering.",
      "positioning": "A historic design rebuilt for listeners who want scale with minimal footprint.",
      "competitors": [
        "Wilson Audio",
        "Backes & Müller",
        "California Audio Technology",
        "Magico",
        "Klipsch Heritage Series"
      ]
    },
    "content": {
      "short_description": "Modern wooden realisation of the classic Lowther Hegeman horn, created in very limited numbers for serious collectors.",
      "long_description": "The Hegeman reissue revives one of Lowther's most intriguing historic designs. Replacing the fragile plaster construction of the original, the new Hegeman uses a precisely crafted wooden structure that refines the acoustic behaviour and brings new life to the concept.\n\nCreated to partner with Lowther's highest grade drivers, each pair is handmade to order and installed by Lowther specialists, making it one of the rarest and most exclusive expressions of the Lowther sound.",
      "seo": {
        "meta_title": "Lowther Hegeman Historic Horn Loudspeaker",
        "meta_description": "Modern wooden revival of the classic Hegeman horn, hand built in very limited numbers for collectors of vintage inspired high end audio.",
        "keywords": [
          "Lowther Hegeman",
          "historic horn speaker",
          "Stewart Hegeman design",
          "field coil horn",
          "ultra luxury loudspeaker"
        ]
      }
    }
  }
};

/**
 * Get a speaker by its slug
 * @param slug - The URL slug of the speaker
 * @returns The speaker object or undefined if not found
 */
export function getSpeakerBySlug(slug: string): Speaker | undefined {
  // First try direct match
  if (SPEAKERS[slug]) {
    return SPEAKERS[slug];
  }

  // Then try to find by slug property
  return Object.values(SPEAKERS).find(
    (speaker) => speaker.slug === slug || speaker.href?.includes(slug)
  );
}

/**
 * Get all speakers as an array
 * @returns Array of all speakers
 */
export function getAllSpeakers(): Speaker[] {
  return Object.values(SPEAKERS);
}

/**
 * Get all speaker slugs
 * @returns Array of speaker slugs
 */
export function getSpeakerSlugs(): string[] {
  return Object.values(SPEAKERS).map((speaker) => speaker.slug || speaker.id);
}

/**
 * Get the main hero image URL for a speaker
 * @param speaker - The speaker object
 * @returns The hero image URL or a default
 */
export function getSpeakerHeroImage(speaker: Speaker): string {
  if (speaker.images?.base && speaker.images?.hero) {
    return `${speaker.images.base}${speaker.images.hero}`;
  }
  if (speaker.image) {
    return speaker.image;
  }
  return '/images/og/default.jpg';
}

/**
 * Get the canonical URL for a speaker
 * @param speaker - The speaker object
 * @returns The canonical URL
 */
export function getSpeakerUrl(speaker: Speaker): string {
  if (speaker.href) {
    return speaker.href;
  }
  return `/loudspeakers/${speaker.slug || speaker.id}`;
}

