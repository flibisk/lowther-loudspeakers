/**
 * Product Narratives
 * Contains product stories and descriptions for abandoned cart emails
 */

export type ProductNarrative = {
  id: string;
  name: string;
  collection: 'Concert' | 'Sinfonia' | 'Philharmonic' | 'Electronics' | 'Accessory';
  rangePosition: string;
  soundCharacter: string;
  cabinetMatches: string;
};

export const PRODUCT_NARRATIVES: ProductNarrative[] = [
  // CONCERT COLLECTION – DX SERIES
  {
    id: 'dx2-concert',
    name: 'DX2 Concert',
    collection: 'Concert',
    rangePosition:
      'Within the Concert collection, the DX2 is the lightest neodymium motor. It is the most approachable entry into the modern Lowther sound.',
    soundCharacter:
      'The DX2 favours speed and openness, with a lively midband and a clear, articulate top end at sensible listening levels.',
    cabinetMatches:
      'Best suited to compact Voigt horns, quarter wave and reflex designs in small to medium rooms, and to lower power valve amplifiers.'
  },
  {
    id: 'dx3-concert',
    name: 'DX3 Concert',
    collection: 'Concert',
    rangePosition:
      'The DX3 Concert sits between the DX2 and DX4 in magnet strength and control. It is the mid powered neodymium option in the range.',
    soundCharacter:
      'Compared with DX2 it adds weight, grip and presence, yet remains quick and direct, with the classic Lowther immediacy.',
    cabinetMatches:
      'Well matched with traditional Lowther horns and quarter wave enclosures where you want more drive and authority without losing finesse.'
  },
  {
    id: 'dx4-concert',
    name: 'DX4 Concert',
    collection: 'Concert',
    rangePosition:
      'The DX4 Concert is the most powerful neodymium motor in the DX family within the Concert collection.',
    soundCharacter:
      'It offers maximum control, dynamic contrast and focus, rewarding careful system matching and set up.',
    cabinetMatches:
      'Best in larger horns and high efficiency enclosures, driven by high quality valve or solid state amplifiers in dedicated listening rooms.'
  },

  // CONCERT COLLECTION – EX SERIES
  {
    id: 'ex2-concert',
    name: 'EX2 Concert',
    collection: 'Concert',
    rangePosition:
      'The EX2 Concert is the starting point of the EX neodymium line, sharing much with DX2 but tuned for a slightly smoother balance.',
    soundCharacter:
      'Fast and open, with a touch more ease and warmth compared to the sharper edge of the DX units.',
    cabinetMatches:
      'Ideal for compact horns and slim floorstanders where you want the Lowther presence with a more relaxed overall balance.'
  },
  {
    id: 'ex3-concert',
    name: 'EX3 Concert',
    collection: 'Concert',
    rangePosition:
      'The EX3 Concert occupies the centre of the EX range, combining higher motor strength with a balanced tonal presentation.',
    soundCharacter:
      'It offers a firm, tuneful bass, vivid midrange and a clean top end that suits a wide range of material.',
    cabinetMatches:
      'A strong match for classic Lowther cabinets and custom designs where you want a single full range solution without a subwoofer.'
  },
  {
    id: 'ex4-concert',
    name: 'EX4 Concert',
    collection: 'Concert',
    rangePosition:
      'At the top of the EX line, the EX4 Concert delivers the highest control and efficiency of the series.',
    soundCharacter:
      'It produces a very precise, immediate presentation with strong dynamics, suited to experienced listeners who enjoy critical listening.',
    cabinetMatches:
      'Best with larger horns and carefully designed quarter wave or folded lines, ideally in treated or dedicated rooms.'
  },

  // CONCERT COLLECTION – PM SERIES
  {
    id: 'pm2a-concert',
    name: 'PM2A Concert',
    collection: 'Concert',
    rangePosition:
      'The PM2A Concert is the entry point to the classic PM Alnico style within the Concert collection.',
    soundCharacter:
      'It brings a natural, flowing midrange with good presence and an easy musical quality at domestic listening levels.',
    cabinetMatches:
      'Well suited to traditional Lowther horns and compact corner or wall loaded designs in small to medium sized rooms.'
  },
  {
    id: 'pm3a-concert',
    name: 'PM3A Concert',
    collection: 'Concert',
    rangePosition:
      'The PM3A Concert sits between PM2A and PM4A, offering more motor strength and authority than PM2A.',
    soundCharacter:
      'It adds firmer bass and greater dynamic swing, while retaining the natural tone and immediacy of the PM family.',
    cabinetMatches:
      'A good choice for full height Lowther cabinets and custom designs where you want more drive without moving to the extremes of PM4A.'
  },
  {
    id: 'pm4a-concert',
    name: 'PM4A Concert',
    collection: 'Concert',
    rangePosition:
      'The PM4A Concert is the high flux reference of the PM line in the Concert collection.',
    soundCharacter:
      'It delivers maximum detail, speed and articulation, with a presentation that is clear and revealing of every part of the chain.',
    cabinetMatches:
      'Best suited to large horns and serious systems where the room, amplification and placement have been carefully considered.'
  },
  {
    id: 'pm5a-concert',
    name: 'PM5A Concert',
    collection: 'Concert',
    rangePosition:
      'The PM5A Concert extends the PM concept with a motor optimised for scale and control.',
    soundCharacter:
      'It offers strong image stability, solid bass lines and a refined midband that works well with complex music.',
    cabinetMatches:
      'Ideal for substantial floorstanding horns and quarter wave enclosures in medium to larger rooms.'
  },
  {
    id: 'pm6a-concert',
    name: 'PM6A Concert',
    collection: 'Concert',
    rangePosition:
      'The PM6A Concert is voiced as a balanced all rounder within the PM family.',
    soundCharacter:
      'It blends good bass reach, a natural midrange and a clean, extended treble that does not draw attention to itself.',
    cabinetMatches:
      'Suitable for a wide range of classic and modern horn and transmission line designs, including many existing Lowther cabinets.'
  },
  {
    id: 'pm7a-concert',
    name: 'PM7A Concert',
    collection: 'Concert',
    rangePosition:
      'The PM7A Concert is the top Concert PM option, offering the greatest sense of scale and authority in this family.',
    soundCharacter:
      'It presents music with strong dynamics, a stable soundstage and a confident, unforced top end.',
    cabinetMatches:
      'Best in full size horns and large quarter wave designs where the room and amplifier can show its full capability.'
  },

  // SINFONIA COLLECTION – DX SERIES
  {
    id: 'dx2-sinfonia',
    name: 'DX2 Sinfonia',
    collection: 'Sinfonia',
    rangePosition:
      'Within the Sinfonia collection, the DX2 is the most accessible neodymium motor, tuned for refinement as well as efficiency.',
    soundCharacter:
      'It keeps the speed of the Concert DX2 but adds a touch more body and ease, suiting longer listening sessions.',
    cabinetMatches:
      'Well matched to Sinfonia level horns and wall loaded designs in modest to medium rooms, with quality valve amplification.'
  },
  {
    id: 'dx3-sinfonia',
    name: 'DX3 Sinfonia',
    collection: 'Sinfonia',
    rangePosition:
      'The DX3 Sinfonia is the central neodymium choice in the Sinfonia range, between DX2 and DX4.',
    soundCharacter:
      'It offers a stronger low end foundation, a more solid image and greater drive, while remaining agile and transparent.',
    cabinetMatches:
      'Ideal for Sinfonia level horns and quarter wave enclosures where you want a single unit to cover the full range convincingly.'
  },
  {
    id: 'dx4-sinfonia',
    name: 'DX4 Sinfonia',
    collection: 'Sinfonia',
    rangePosition:
      'The DX4 Sinfonia is the most powerful DX motor in this collection.',
    soundCharacter:
      'It provides high efficiency, firm control and a precise, revealing presentation that rewards careful partnering.',
    cabinetMatches:
      'Best used in larger horns and carefully tuned lines, where room size and placement allow it to breathe.'
  },

  // SINFONIA COLLECTION – PM SERIES
  {
    id: 'pm2a-sinfonia',
    name: 'PM2A Sinfonia',
    collection: 'Sinfonia',
    rangePosition:
      'The PM2A Sinfonia is the entry to the Sinfonia PM family, bringing classic Lowther tone with upgraded construction.',
    soundCharacter:
      'It gives a natural, unforced midrange with good presence and a slightly fuller balance than the Concert version.',
    cabinetMatches:
      'Suited to Sinfonia level horns and compact corner designs where musical flow matters more than ultimate level.'
  },
  {
    id: 'pm3a-sinfonia',
    name: 'PM3A Sinfonia',
    collection: 'Sinfonia',
    rangePosition:
      'The PM3A Sinfonia sits in the middle of the Sinfonia PM range, balancing power and poise.',
    soundCharacter:
      'It adds stronger bass lines, greater dynamic contrast and image focus compared with PM2A, while remaining smooth and communicative.',
    cabinetMatches:
      'A strong option for full height Sinfonia horns and high quality custom enclosures in medium rooms.'
  },
  {
    id: 'pm4a-sinfonia',
    name: 'PM4A Sinfonia',
    collection: 'Sinfonia',
    rangePosition:
      'The PM4A Sinfonia is the reference permanent magnet unit in the Sinfonia collection.',
    soundCharacter:
      'It offers high resolution, excellent timing and a very clear midband, suited to listeners who want to hear deep into a recording.',
    cabinetMatches:
      'Best partnered with large horns and well damped rooms where its resolution can be fully appreciated.'
  },
  {
    id: 'pm5a-sinfonia',
    name: 'PM5A Sinfonia',
    collection: 'Sinfonia',
    rangePosition:
      'The PM5A Sinfonia builds on the PM concept with a motor set up for scale and composure.',
    soundCharacter:
      'It combines firm bass control with a composed midrange that handles complex orchestral or amplified music with ease.',
    cabinetMatches:
      'Well suited to substantial Sinfonia horns and floorstanding designs in medium to larger rooms.'
  },
  {
    id: 'pm6a-sinfonia',
    name: 'PM6A Sinfonia',
    collection: 'Sinfonia',
    rangePosition:
      'The PM6A Sinfonia is voiced as a flexible all rounder within the Sinfonia PM family.',
    soundCharacter:
      'It offers a balanced mix of reach, tone and clarity, making it a good match for a wide spread of systems and rooms.',
    cabinetMatches:
      'Suitable for many Sinfonia horns, quarter wave and transmission line designs, including upgrades of existing Lowther cabinets.'
  },
  {
    id: 'pm7a-sinfonia',
    name: 'PM7A Sinfonia',
    collection: 'Sinfonia',
    rangePosition:
      'The PM7A Sinfonia is the top Sinfonia PM unit, intended for serious systems and dedicated rooms.',
    soundCharacter:
      'It delivers strong dynamics, stable imaging and a confident, full range presentation with very low coloration.',
    cabinetMatches:
      'Best used in full size horns and large, well braced enclosures with high quality amplification.'
  },

  // PHILHARMONIC COLLECTION
  {
    id: 'pm7a-philharmonic',
    name: 'PM7A Philharmonic',
    collection: 'Philharmonic',
    rangePosition:
      'The PM7A Philharmonic is a flagship permanent magnet unit in the Philharmonic collection.',
    soundCharacter:
      'It offers a large, authoritative sound with high resolution and control, aimed at reference level systems.',
    cabinetMatches:
      'Designed for our largest horns and statement enclosures, in rooms that can support realistic scale.'
  },
  {
    id: 'pm4a-philharmonic',
    name: 'PM4A Philharmonic',
    collection: 'Philharmonic',
    rangePosition:
      'The PM4A Philharmonic is the reference for ultimate permanent magnet detail in the Philharmonic line.',
    soundCharacter:
      'It gives the most finely etched, time accurate presentation of the permanent magnet range, with exceptional midband clarity.',
    cabinetMatches:
      'Best with top tier horns and carefully controlled rooms where every small change in the system can be heard.'
  },
  {
    id: 'field-coil-philharmonic',
    name: 'Field Coil Philharmonic',
    collection: 'Philharmonic',
    rangePosition:
      'The Field Coil Philharmonic is the ultimate expression of the Lowther full range concept, using an energised field coil motor.',
    soundCharacter:
      'It combines effortless dynamics, lifelike tone and a sense of ease that comes from the very high control of the field coil system.',
    cabinetMatches:
      'Intended for reference installations with dedicated power supplies, serious horns and carefully built rooms, where it can be set up and adjusted with care.'
  },

  // ELECTRONICS – PX4 AMPLIFIER
  {
    id: 'px4-amplifier',
    name: 'PX4 Valve Amplifier',
    collection: 'Electronics',
    rangePosition:
      'The PX4 valve amplifier is our reference push pull design, built around the classic British PX4 direct heated triode and voiced specifically for high efficiency Lowther systems.',
    soundCharacter:
      'Delivering 10 watts of pure class A power, it focuses on signal purity rather than volume, giving a quiet background, strong timing and a natural, unforced presentation even at low levels.',
    cabinetMatches:
      'Designed to partner Lowther full range drivers in horns, quarter wave and other high efficiency enclosures, where its control and low noise allow the drivers to perform at their best.'
  },

  // ELECTRONICS – REFERENCE CABLES
  {
    id: 'reference-cables',
    name: 'Reference Cables',
    collection: 'Electronics',
    rangePosition:
      'Our Reference Cables sit at the top of the Lowther cable range and are built to preserve the full capability of our drive units and amplifiers.',
    soundCharacter:
      'They use a purist construction to minimise resistance and stored energy, helping to maintain dynamic range, tonal integrity and timing from amplifier to driver.',
    cabinetMatches:
      'Recommended wherever you want the connection between PX4 amplifier and Lowther loudspeakers to be as transparent as possible, in both domestic and studio systems.'
  },

  // ACCESSORIES – STANDARD DOME
  {
    id: 'standard-dome',
    name: 'Standard Dome',
    collection: 'Accessory',
    rangePosition:
      'The Standard Dome is our classic phase plug that has been fitted to Lowther drive units for decades.',
    soundCharacter:
      'It offers the familiar, direct Lowther presentation, controlling central cone behaviour and helping the driver to integrate its mid and high frequencies cleanly.',
    cabinetMatches:
      'A good choice for listeners who enjoy the traditional Lowther sound in existing horns and quarter wave enclosures and want to retain that character.'
  },

  // ACCESSORIES – PHASE EQUALISER
  {
    id: 'phase-equaliser',
    name: 'Phase Equaliser',
    collection: 'Accessory',
    rangePosition:
      'The Phase Equaliser is our modern phase plug, developed to replace the classic stabiliser with a more advanced internal structure.',
    soundCharacter:
      'It improves phase behaviour and pressure control inside the driver, reducing resonances and cancellations and giving greater transparency, stability and tonal balance, especially through the mid and high frequencies.',
    cabinetMatches:
      'Ideal as an upgrade for existing Lowther drivers in any cabinet where you want a clearer, more even presentation without changing the core character of the system.'
  },

  // ACCESSORIES – SOUND DIFFUSER
  {
    id: 'sound-diffuser',
    name: 'Sound Diffuser',
    collection: 'Accessory',
    rangePosition:
      'The Sound Diffuser is a rounded phase plug profile, often referred to as the "door knob", designed for use in our larger drive units.',
    soundCharacter:
      'It spreads and smooths the output from the inner cone, helping to minimise resonances and giving a more even, natural sound that many listeners find especially comfortable over long sessions.',
    cabinetMatches:
      'A strong option for larger Lowther drivers in horns and wall loaded cabinets where you want to soften and aim for a calmer, more diffuse top end.'
  }
];

