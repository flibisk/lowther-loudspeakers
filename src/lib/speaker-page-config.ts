// Speaker-specific page configuration
// This file contains images, craftsmanship content, and customer quotes for each speaker

export interface SpeakerPageConfig {
  heroImage: string;
  heroVideo?: string;
  mobileHeroImage?: string;
  galleryImages: Array<{ src: string; alt: string }>;
  specsImage: string;
  specsImages?: Array<string>;
  craftsmanshipContent: Array<{
    title: string;
    description: string;
    image: string;
  }>;
  customerQuotes: Array<{ quote: string; author?: string }>;
  lifestyleHeading: string;
  lifestyleImages: Array<{ src: string; alt: string }>;
  showGenericCraftsmanship?: boolean;
  genericCraftsmanshipHeading?: string;
  speakerCraftsmanshipHeading?: string;
  speakerVideo?: {
    title: string;
    thumbnail: string;
    videoUrl: string;
    loopVideo?: string;
  };
  speakerVideos?: Array<{
    title: string;
    thumbnail: string;
    videoUrl: string;
    loopVideo?: string;
  }>;
  remakingVideo?: {
    heading: string;
    description: string;
    title: string;
    thumbnail: string;
    videoUrl: string;
    loopVideo?: string;
  };
  pressReviews?: Array<{
    logo: string;
    quote: string;
    author: string;
    publication: string;
    link: string;
  }>;
}

export const speakerPageConfigs: { [key: string]: SpeakerPageConfig } = {
  // Quarter Wave Configuration
  quarterwave: {
    heroImage: '/images/speakers/quarter-wave/hero/quarter-wave-hero1.avif',
    mobileHeroImage: '/images/speakers/quarter-wave/gallery/quarterwave_pair_front_angle_in_room.avif',
    specsImage: '/images/speakers/quarter-wave/technical/quarter-wave-dimensions.svg',
    lifestyleHeading: 'The most adaptable horn speaker',
    galleryImages: [
      {
        src: '/images/speakers/quarter-wave/gallery/quarterwave_PM7A_philharmonic_driver_closeup.avif',
        alt: 'PM7A Philharmonic driver detail'
      },
      {
        src: '/images/speakers/quarter-wave/gallery/quarterwave_driver_detail_PM7A_grille_removed.avif',
        alt: 'Driver detail'
      },
      {
        src: '/images/speakers/quarter-wave/gallery/quarterwave_rear_horn_port_detail.avif',
        alt: 'Rear horn port detail'
      },
      {
        src: '/images/speakers/quarter-wave/gallery/quarterwave_single_speaker_side_profile.avif',
        alt: 'Side profile'
      },
      {
        src: '/images/speakers/quarter-wave/gallery/quarterwave_pair_front_angle_in_room.avif',
        alt: 'Pair in room'
      },
      {
        src: '/images/speakers/quarter-wave/gallery/quarterwave_pair_with_furniture_interior_view.avif',
        alt: 'Pair with furniture'
      }
    ],
    lifestyleImages: [
      {
        src: '/images/speakers/quarter-wave/gallery/quarterwave_single_speaker_side_profile.avif',
        alt: 'Quarter Wave detail'
      },
      {
        src: '/images/speakers/quarter-wave/gallery/quarterwave_pair_with_furniture_interior_view.avif',
        alt: 'Quarter Wave in room'
      }
    ],
    craftsmanshipContent: [
      {
        title: 'The PM7A Philharmonic',
        description: 'The Quarter Wave is designed around the PM7A Philharmonic driver, renowned for its warmth, speed, and natural detail. This driver delivers exceptional clarity across the frequency range, making every note feel immediate and alive.',
        image: '/images/speakers/quarter-wave/gallery/quarterwave_PM7A_philharmonic_driver_closeup.avif'
      },
      {
        title: 'Rear-Loaded Quarter-Wave Horn',
        description: 'Utilizing a rear-loaded quarter-wave Voigt horn design, the Quarter Wave produces clean, articulate bass with signature Lowther clarity. The horn loading allows placement flexibility, even behind furniture, without compromising sound quality.',
        image: '/images/speakers/quarter-wave/gallery/quarterwave_rear_horn_port_detail.avif'
      },
      {
        title: 'Adaptable Design',
        description: 'Engineered to perform anywhere in the room, the Quarter Wave adapts to your space without dominating it. Its compact footprint and flexible placement make it the most versatile horn speaker we offer, perfect for modern living spaces.',
        image: '/images/speakers/quarter-wave/gallery/quarterwave_pair_with_furniture_interior_view.avif'
      }
    ],
    customerQuotes: [
      { quote: 'They make my small room sound bigger, like the walls just disappear.' },
      { quote: 'I still can\'t work out how they reach that deep in the bass and stay so clear.' },
      { quote: 'Every time I sit down I end up listening for hours without realising.' },
      { quote: 'Voices sound so real it feels like the singer is right in front of me.' },
      { quote: 'They don\'t shout or show off, they just let the music breathe.' },
      { quote: 'I\'ve never heard guitars sound this natural, every string has life.' },
      { quote: 'It\'s hard to believe this much sound comes from a single driver.' },
      { quote: 'They fill the room with warmth but the detail is still razor sharp.' },
      { quote: 'I thought I knew these records until I played them through the Acoustas.' },
      { quote: 'They make me want to listen to everything all over again.' },
      { quote: 'These speakers continue to produce witchcraft. How do they get so low in bass and also keep that sweet mid and highs?' }
    ]
  },

  // Acousta 117 Configuration
  'acousta-117': {
    heroImage: '/images/speakers/acousta-117/hero/Acousta-hero.webp',
    specsImage: '/images/speakers/acousta-117/technical/Acousta Measurements.svg',
    lifestyleHeading: 'A heritage design for the modern listener',
    galleryImages: [
      {
        src: '/images/speakers/acousta-117/gallery/Acousta 117 - PM6A Philharmonic.jpg',
        alt: 'Acousta 117 with PM6A Philharmonic driver'
      },
      {
        src: '/images/speakers/acousta-117/gallery/Acousta 117 - Phase plugs.jpg',
        alt: 'Acousta 117 phase plugs detail'
      },
      {
        src: '/images/speakers/acousta-117/gallery/Acousta 117 - in a home.jpg',
        alt: 'Acousta 117 in a home setting'
      },
      {
        src: '/images/speakers/acousta-117/gallery/Acousta 117 - in a lounge.jpg',
        alt: 'Acousta 117 in a lounge'
      },
      {
        src: '/images/speakers/acousta-117/gallery/Acousta 117 - PX4 Amplifier.jpg',
        alt: 'Acousta 117 with PX4 amplifier'
      },
      {
        src: '/images/speakers/acousta-117/gallery/Acousta 117 - vinyl.jpg',
        alt: 'Acousta 117 with vinyl setup'
      },
      {
        src: '/images/speakers/acousta-117/gallery/Acousta 117 - with speaker fabric.jpg',
        alt: 'Acousta 117 with speaker fabric'
      },
      {
        src: '/images/speakers/acousta-117/gallery/Acousta 117 - beachside-listening space.jpg',
        alt: 'Acousta 117 in beachside listening space'
      },
      {
        src: '/images/speakers/acousta-117/gallery/Acousta 117 - beachside-listening space from the seat.jpg',
        alt: 'Acousta 117 beachside view from listening position'
      }
    ],
    lifestyleImages: [
      {
        src: '/images/speakers/acousta-117/gallery/Acousta 117 - Oak in a old british manor house.jpg',
        alt: 'Acousta 117 in oak finish in manor house'
      },
      {
        src: '/images/speakers/acousta-117/gallery/Acousta 117 - beachside-listening space portrait.jpg',
        alt: 'Acousta 117 in beachside listening space'
      }
    ],
    craftsmanshipContent: [
      {
        title: 'The PM6A',
        description: 'The PM6A (with Voigt\'s whizzer cone design) produces a wide dispersion and an airy, spacious soundstage. Combined with the alnico magnet, the Voigt folded spatial diaphragm reproduces music with a detailed yet balanced midrange and tight, well-controlled bass. The PM6A offers an authentic musical listening experience, perfectly showcasing jazz, classical and acoustic recordings with its clean, natural timbre and ability to resolve fine inner details. The end result is an engaging yet uncoloured presentation that gets out of the way so the music can shine through.',
        image: '/images/speakers/acousta-117/gallery/Acousta 117 - PM6A Philharmonic.jpg'
      },
      {
        title: 'Front facing Voigt horn',
        description: 'The Voigt horn plays a key role in extending the Lowther Acousta\'s frequency response down into the bass region, while maintaining a high standard of clarity, precision and blend with the rest of the frequency range. The horn flares at the front and aims to provide a natural, unfatiguing low frequency response that blends seamlessly and reinforces (rather than overwhelm) the midrange.',
        image: '/images/speakers/acousta-117/gallery/Acousta 117 - labarinth.jpg'
      },
      {
        title: 'Pair with Anything',
        description: 'Whether you prefer the warm tones of a tube amplifier, the precision of a solid-state amp, or the efficiency of a class D amplifier, like all our loudspeakers, the Lowther Acousta will flawlessly integrate with your amplifier of choice. The Acousta will also house almost all 8" Lowther drive units, giving you the ultimate flexibility for your own personal musical taste.',
        image: '/images/speakers/acousta-117/gallery/Acousta 117 - PX4 Amplifier.jpg'
      }
    ],
    customerQuotes: [
      { quote: 'The 117s surprised me from the first note, they just sound effortless.' },
      { quote: 'They fill the room with music that feels alive, not just loud.' },
      { quote: 'I never realised how much texture there was in a double bass until now.' },
      { quote: 'Every instrument has its place, nothing gets in the way.' },
      { quote: 'They sound rich at low volume, I don\'t need to turn them up to feel it.' },
      { quote: 'I can hear details I didn\'t know existed on albums I\'ve loved for years.' },
      { quote: 'They have that perfect balance of warmth and precision.' },
      { quote: 'It\'s the kind of sound that makes you sit still and just listen.' },
      { quote: 'Even after months, they still surprise me with how open they sound.' },
      { quote: 'Owning a pair feels like having a piece of music history in my home.' }
    ]
  },

  // Edilia Configuration
  'edilia': {
    heroImage: '/images/speakers/edilia/hero/Edilia at the Aidobarn.jpg',
    specsImage: '/images/speakers/edilia/technical/Edilia-specs.svg',
    lifestyleHeading: 'Refined elegance for the modern listener',
    galleryImages: [
      {
        src: '/images/speakers/edilia/gallery/Edilia_Oak_PM7A-Philharmonic.jpg',
        alt: 'Edilia in oak with PM7A Philharmonic driver'
      },
      {
        src: '/images/speakers/edilia/gallery/Edilia_Oak_DX-Bass.jpg',
        alt: 'Edilia oak with DX bass driver'
      },
      {
        src: '/images/speakers/edilia/gallery/Edilia_Oak_top.jpg',
        alt: 'Edilia oak top view'
      },
      {
        src: '/images/speakers/edilia/gallery/Edilia-PX4-listening-room.jpg',
        alt: 'Edilia with PX4 in listening room'
      },
      {
        src: '/images/speakers/edilia/gallery/Edilia-Mid-Century-with PX4.jpg',
        alt: 'Edilia in mid-century setting with PX4'
      },
      {
        src: '/images/speakers/edilia/gallery/Edilia at the Aidobarn.jpg',
        alt: 'Edilia at the Aidobarn'
      },
      {
        src: '/images/speakers/edilia/gallery/Edilia-Piano-Room.jpg',
        alt: 'Edilia in piano room'
      },
      {
        src: '/images/speakers/edilia/gallery/Edilia-Piano-Room2.jpg',
        alt: 'Edilia in piano room angle 2'
      },
      {
        src: '/images/speakers/edilia/gallery/Edilia-Piano-Room3.jpg',
        alt: 'Edilia in piano room angle 3'
      }
    ],
    lifestyleImages: [
      {
        src: '/images/speakers/edilia/gallery/Edilia-Mid-Century-with PX4.jpg',
        alt: 'Edilia in mid-century interior'
      },
      {
        src: '/images/speakers/edilia/gallery/Edilia-Piano-Room.jpg',
        alt: 'Edilia in elegant piano room'
      }
    ],
    craftsmanshipContent: [
      {
        title: 'The PM7A and DX3',
        description: 'The PM7A Philharmonic delivers the full-range Lowther sound with exceptional clarity and detail, while the DX3 bass driver provides controlled low-frequency extension. Together, they create a seamless, coherent presentation that brings music to life with natural warmth and precision.',
        image: '/images/speakers/edilia/gallery/Edilia_Oak_PM7A-Philharmonic.jpg'
      },
      {
        title: 'Tunable Bass Control',
        description: 'Edilia features a unique tunable bass system that allows you to adjust the low-frequency response to perfectly match your room and personal preference. This passive control system ensures optimal integration without compromising the purity of the Lowther sound.',
        image: '/images/speakers/edilia/gallery/Edilia_Oak_DX-Bass.jpg'
      },
      {
        title: 'Elegant Design',
        description: 'With its slender profile and refined proportions, Edilia brings understated elegance to any space. The hybrid quarter-wave enclosure is crafted from Baltic Birch and finished in your choice of matched veneers, making each pair a unique work of functional art.',
        image: '/images/speakers/edilia/gallery/Edilia_Oak_top.jpg'
      }
    ],
    customerQuotes: [
      { quote: 'The Edilias just disappear, I can sit hear for hours.' },
      { quote: 'They have a calm, confident sound that fills the room without ever pushing.' },
      { quote: 'I can feel the depth of the bass but it never overwhelms the mids.' },
      { quote: 'The balance is beautiful, smooth and full from top to bottom.' },
      { quote: 'Even at low volume they bring so much emotion into the room.' },
      { quote: 'They look like a piece of high quality wood furniture but sound like a live performance.' },
      { quote: 'The vocals are so clear it\'s like the singer has stepped forward just for me.' },
      { quote: 'They make long listening sessions feel amazing.' },
      { quote: 'The Edilias are the most complete speakers I\'ve ever owned.' }
    ]
  },

  // Almira Configuration
  'almira': {
    heroImage: '/images/speakers/almira/hero/Almira-hero.jpg',
    specsImage: '/images/speakers/almira/technical/Almira Specs.svg',
    lifestyleHeading: 'Refined elegance for the modern listener',
    galleryImages: [
      {
        src: '/images/speakers/almira/gallery/Almira - from above.webp',
        alt: 'Almira from above showing elegant top design'
      },
      {
        src: '/images/speakers/almira/gallery/Almira - high view of the speakers and the amplifiers..webp',
        alt: 'Almira with amplifiers in listening room'
      },
      {
        src: '/images/speakers/almira/gallery/Almira-and-amps-front-view.webp.jpg',
        alt: 'Almira front view with amplifiers'
      },
      {
        src: '/images/speakers/almira/gallery/Almira-hero.webp.webp',
        alt: 'Almira in elegant setting'
      },
      {
        src: '/images/speakers/almira/gallery/Almira-top showing the DX4 instrument.webp',
        alt: 'Almira top showing DX3 driver detail'
      }
    ],
    lifestyleImages: [
      {
        src: '/images/speakers/almira/gallery/Almira-and-amps-front-view.webp.jpg',
        alt: 'Almira in elegant listening room'
      },
      {
        src: '/images/speakers/almira/gallery/Almira - high view of the speakers and the amplifiers..webp',
        alt: 'Almira paired with premium amplification'
      }
    ],
    craftsmanshipContent: [
      {
        title: 'Voigt Flared Pipe',
        description: 'The Almira utilises a Voigt flared pipe and 270-degree bottom port that act as a hybrid quarter wave horn and transmission line for a natural, clean bass extension. Carefully arranged interior panels, laminated curves and composite ply/foam divisions create a smooth 2.3m horn expansion optimal for the DX3 driver.',
        image: '/images/speakers/almira/gallery/Almira - from above.webp'
      },
      {
        title: 'Integrated Super-Tweeter',
        description: 'To complement the legendary full-range performance of the DX3, the Almira incorporates a super-tweeter for added high-frequency detail. This 20mm dome with a small loading cavity matches the efficiency of the Lowther driver. Handmade horns are built into sealed chambers within the cabinet, extending response beyond the DX3\'s natural roll-off.',
        image: '/images/speakers/almira/gallery/Almira-and-amps-front-view.webp.jpg'
      },
      {
        title: 'Compact Elegance',
        description: 'The Almira\'s slender profile and refined proportions make it ideal for modern homes where space is at a premium. Despite its compact footprint, it delivers the full-scale Lowther experience, proving that exceptional sound need not dominate your living space.',
        image: '/images/speakers/almira/gallery/Almira - high view of the speakers and the amplifiers..webp'
      }
    ],
    customerQuotes: [
      { quote: 'The Almira has the ability to connect the music to the listener on an emotional level as well. The pathos of the piano sonatas, the anguish in Belinda\'s dying aria, the heartache in so many of Adele\'s songs, the list goes on, they\'re gin-clear.' },
      { quote: 'This is no pipe and slippers box like some Lowther\'s from the 50\'s. This looks truly 21st century and sounds just as present-day when placed carefully in any medium-sized living room.' },
      { quote: 'The sound is very open and transparent - extremely fast and sharp... Playing Bob Downes Open Music... I was impressed by the sheer effervescence of the sound and its\' amazing attack.' },
      { quote: 'The Almiras remind me why I fell in love with music in the first place.' },
      { quote: 'Even at low levels they fill the space with warmth and balance.' },
      { quote: 'They make late-night listening feel intimate and alive.' },
      { quote: 'I can hear the texture of the instruments as if they were right in front of me.' },
      { quote: 'There\'s a calm confidence to the sound that makes you forget about the speakers.' }
    ]
  },

  // TP2 Configuration
  'tp2': {
    heroImage: '/images/speakers/tp2/hero/TP2 - Hereo.webp.webp',
    specsImage: '/images/speakers/tp2/technical/TP2 Specs.svg',
    lifestyleHeading: 'The pinnacle of corner horn design',
    galleryImages: [
      {
        src: '/images/speakers/tp2/gallery/TP2 - in a corner of old english apartment..webp',
        alt: 'TP2 in elegant corner setting'
      },
      {
        src: '/images/speakers/tp2/gallery/TP2 - Top view of the best corner horn.webp',
        alt: 'TP2 top view showing dual-loaded horn design'
      },
      {
        src: '/images/speakers/tp2/gallery/TP2 - Close up of lowther logo.webp',
        alt: 'TP2 Lowther logo detail'
      }
    ],
    lifestyleImages: [
      {
        src: '/images/speakers/tp2/gallery/TP2 - in a corner of old english apartment..webp',
        alt: 'TP2 in elegant interior'
      },
      {
        src: '/images/speakers/tp2/gallery/TP2 - Top view of the best corner horn.webp',
        alt: 'TP2 craftsmanship detail'
      }
    ],
    craftsmanshipContent: [
      {
        title: 'Dual-Loaded Horn Design',
        description: 'The TP2 employs a sophisticated dual-loaded horn principle that applies balanced loading to both sides of the diaphragm. This innovative design delivers exceptional efficiency and a rich, full sound quality that captures the full emotional range of every performance.',
        image: '/images/speakers/tp2/gallery/TP2 - Top view of the best corner horn.webp'
      },
      {
        title: 'Corner Horn Optimization',
        description: 'Designed to work in harmony with room boundaries, the TP2 leverages corner placement to unlock its full horn gain potential. This acoustic coupling with the room creates a sense of scale and presence that few loudspeakers can match, delivering concert-hall dynamics in your home.',
        image: '/images/speakers/tp2/gallery/TP2 - in a corner of old english apartment..webp'
      },
      {
        title: 'Handcrafted Excellence',
        description: 'Every TP2 is meticulously handcrafted in Great Britain from premium Baltic Birch plywood. Vacuum-laminated horn curves, precision joinery, and hand-matched veneers ensure that each pair is a masterpiece of both acoustic engineering and fine craftsmanship.',
        image: '/images/speakers/tp2/gallery/TP2 - Close up of lowther logo.webp'
      }
    ],
    customerQuotes: [
      { quote: 'The TP2 fills the room like a living orchestra, effortless and full of life.' },
      { quote: 'They have such command that every note feels anchored and alive.' },
      { quote: 'Even the quietest moments carry weight, presence, and emotion.' },
      { quote: 'The depth is physical, you can feel the room move around the music.' },
      { quote: 'I moved from Klipsch Heritage to the TP2. The scale and control are on another level.' }
    ]
  },
  audiovector: {
    heroImage: '/images/speakers/audiovector/hero/AudioVector-Hero.webp.webp',
    galleryImages: [
      { src: '/images/speakers/audiovector/gallery/Full Audiovector .jpg', alt: 'AudioVector full view' },
      { src: '/images/speakers/audiovector/gallery/Audiovector - Looking beautiful.jpg', alt: 'AudioVector elegant design' },
      { src: '/images/speakers/audiovector/gallery/PM4A in the Audiovector.webp', alt: 'PM4A driver in AudioVector' },
      { src: '/images/speakers/audiovector/gallery/PM4A in the Audiovector front at an angle.webp', alt: 'PM4A driver front angle' },
      { src: '/images/speakers/audiovector/gallery/Audiovector top.jpeg', alt: 'AudioVector top view' },
      { src: '/images/speakers/audiovector/gallery/Audiovector - top reflector.webp', alt: 'AudioVector top reflector detail' },
      { src: '/images/speakers/audiovector/gallery/Audiovector with top reflector.webp', alt: 'AudioVector with top reflector' },
      { src: '/images/speakers/audiovector/gallery/Audiovector back cables.jpeg', alt: 'AudioVector rear connections' }
    ],
    specsImage: '/images/speakers/audiovector/technical/Audiovector specs.svg',
    lifestyleHeading: 'Commanding Presence, Immersive Sound',
    lifestyleImages: [
      { src: '/images/speakers/audiovector/gallery/Full Audiovector .jpg', alt: 'AudioVector in listening room' },
      { src: '/images/speakers/audiovector/gallery/Audiovector - Looking beautiful.jpg', alt: 'AudioVector detail shot' }
    ],
    speakerCraftsmanshipHeading: 'The Details That Define the AudioVector',
    craftsmanshipContent: [
      {
        title: 'The New Reflector',
        description: 'The new limited edition Lowther AudioVector distinguishes itself with a striking top reflector. By helping to disperse sound waves more evenly throughout the listening space, the top reflector ensures a more immersive soundstage, where the clarity and depth of the audio are significantly enhanced.',
        image: '/images/speakers/audiovector/gallery/Audiovector - top reflector.webp'
      },
      {
        title: 'Front Speaker',
        description: 'Integrated into the AudioVector\'s innovative design, the front speaker unit complements the top-firing horn by ensuring that sound is not only dispersed upward but also directly towards the listener, creating a rich and immersive soundstage. This synergy between the front and top units ensures a balanced and coherent sound, characteristic of our commitment to high-fidelity audio reproduction.',
        image: '/images/speakers/audiovector/gallery/PM4A in the Audiovector front at an angle.webp'
      },
      {
        title: 'Top Firing Horn',
        description: 'The AudioVector has one driver dedicated to upward firing. Its role within the acoustically balanced cabinet ensures that sound is dispersed evenly throughout the listening space, mimicking the enveloping experience of live music. This configuration not only improves the spatial distribution of sound but also contributes to the depth and realism of the musics playback, making the AudioVector a standout choice for music enthusiasts seeking an unparalleled listening experience.',
        image: '/images/speakers/audiovector/gallery/Audiovector top.jpeg'
      }
    ],
    customerQuotes: [
      { quote: 'I\'ve never heard stereo imaging this wide, it wraps right around you.' },
      { quote: 'They have the authority of a concert system but the intimacy of a studio monitor.' },
      { quote: 'In mono, it\'s like having a live band in front of you. So real it\'s uncanny.' },
      { quote: 'The dual drivers give a sense of height and air that feels limitless.' },
      { quote: 'They reveal detail I didn\'t know existed on records I\'ve owned for years.' },
      { quote: 'The AudioVectors are commanding, yet elegant. They never sound forced.' }
    ]
  },

  // Hegeman Configuration
  hegeman: {
    heroImage: '/images/speakers/hegeman/hero/hegeman-hero.webp',
    specsImage: '/images/speakers/hegeman/technical/Hegeman specs.svg',
    lifestyleHeading: 'A Historic Collaboration Reimagined',
    speakerVideo: {
      title: 'The Hegeman',
      thumbnail: '/images/speakers/hegeman/details/thumbnail-hegeman.webp',
      videoUrl: 'https://www.youtube.com/embed/zK_7n7ONnrI',
      loopVideo: '/videos/loop-Lowther for life ep5 hegeman.mp4'
    },
    galleryImages: [
      {
        src: '/images/speakers/hegeman/gallery/Hegeman - Room.webp',
        alt: 'Hegeman in listening room'
      },
      {
        src: '/images/speakers/hegeman/gallery/Hegeman - Horn close up.webp',
        alt: 'Hegeman horn detail'
      },
      {
        src: '/images/speakers/hegeman/gallery/Hegeman - Base horn close up.webp',
        alt: 'Hegeman base horn detail'
      },
      {
        src: '/images/speakers/hegeman/gallery/Hegeman - from the side.webp',
        alt: 'Hegeman side view'
      },
      {
        src: '/images/speakers/hegeman/gallery/Hegeman - from the left side.webp',
        alt: 'Hegeman left side view'
      },
      {
        src: '/images/speakers/hegeman/gallery/Lowther PM4A Philharmonic.jpg',
        alt: 'Lowther PM4A Philharmonic driver'
      }
    ],
    lifestyleImages: [
      {
        src: '/images/speakers/hegeman/gallery/Hegeman - Room.webp',
        alt: 'Hegeman in elegant listening room'
      },
      {
        src: '/images/speakers/hegeman/gallery/Hegeman - Stereo pair.webp',
        alt: 'Hegeman stereo pair detail'
      }
    ],
    craftsmanshipContent: [
      {
        title: 'Field Coil',
        description: 'Lowther\'s journey of innovation continues. The modern Hegeman, while honouring its classic roots, houses Lowther\'s groundbreaking field coil driver, alongside the option of the legendary PM4A unit. This blend of old and new engineering offers an unparalleled sonic experience for today\'s audiophile.',
        image: '/images/speakers/hegeman/gallery/Lowther Field Coil Philharmonic.jpg'
      },
      {
        title: 'Dive into History',
        description: 'Stewart Hegeman, an American luminary, sits alongside the likes of Sidney Harman, Avery Fisher, and Saul Marantz in the annals of hi‑fi history. His alliance with Lowther\'s Donald Chave in the 1950s led to the birth of the original Hegeman. Now, six decades on, the Hegeman is reclaiming its crown as the flagship speaker of Lowther\'s Heritage Range, symbolizing a momentous chapter in Hi‑Fi chronicles.',
        image: '/images/speakers/hegeman/gallery/Hegeman - Room.webp'
      },
      {
        title: 'The Art of the Horn',
        description: 'In its initial form, the Hegeman employed a delicate plaster horn. The reimagined Hegeman, however, embraces features an upper-horn crafted from curved composite, which replaces the original\'s fragile plaster and sets a new industry standard. And with veneers that rival the finest Italian craftsmanship, the Hegeman stands as a testament to Lowther\'s dedication to both form and function.',
        image: '/images/speakers/hegeman/gallery/Hegeman - Base horn close up.webp'
      }
    ],
    customerQuotes: [
      { quote: 'The Hegeman brings history to life with every note.' },
      { quote: 'I can feel the heritage and craftsmanship in every detail.' },
      { quote: 'The field coil driver delivers a purity I\'ve never experienced before.' },
      { quote: 'It\'s like having a piece of audio history in my listening room.' },
      { quote: 'The scale and presence are breathtaking, yet the sound remains refined.' },
      { quote: 'Every recording reveals new layers of detail and emotion.' }
    ],
    pressReviews: [
      {
        logo: '/images/speakers/almira/details/Hi-fi+ Logo.webp',
        quote: 'The Hegeman always shows you more of what\'s right with your recordings, rather than what\'s wrong with them.',
        author: 'Jimmy Hughes',
        publication: 'HiFi+',
        link: 'https://hifiplus.com/articles/lowther-hegeman-sound-reproducer-floorstanding-loudspeaker/'
      },
      {
        logo: '/images/speakers/hegeman/gallery/PS Audio Logo.avif',
        quote: 'the Lowther Hegeman speakers delivered scale and soundstage so lifelike and truly grand … so free of artifice that I could have been listening to Quad \'57s on steroids.',
        author: 'Ken Kessler',
        publication: 'PS Audio',
        link: 'https://www.psaudio.com/blogs/copper/stop-press-a-em-copper-em-sneak-preview-back-to-my-reel-to-reel-roots-part-32?srsltid=AfmBOoqUsKD3b9D_-TlT6CwLiWuEty9mP-9hCp75yyjSIlt3qtPZWw1h'
      }
    ]
  },

  // Voigt Horn Configuration
  'voigt-horn': {
    heroImage: '/images/speakers/voigt-horn/gallery/Lowther Voigt Horn.avif',
    heroVideo: '/images/speakers/voigt-horn/hero/Banner-Voigt-Horn.mp4',
    specsImage: '/images/speakers/voigt-horn/technical/Lowther Voigt Horn.svg',
    specsImages: [
      '/images/speakers/voigt-horn/technical/Lowther Voigt Horn.svg',
      '/images/speakers/voigt-horn/technical/Lowther Voigt Horn Measurements.svg'
    ],
    lifestyleHeading: 'The Foundation of Modern Hi‑Fi',
    speakerVideo: {
      title: 'The 4ft Voigt Horn - Presentation Film',
      thumbnail: '/images/speakers/voigt-horn/gallery/Lowther Voigt Horn.avif',
      videoUrl: 'https://www.youtube.com/embed/B90rtoJ21kk'
    },
    remakingVideo: {
      heading: 'Remaking a 100 year old speaker design',
      description: 'Our journey to recreate Paul Voigt\'s legendary horn loudspeaker, bringing a century-old design into the modern era while honouring its timeless principles.',
      title: 'How We Made the Voigt Horn',
      thumbnail: '/images/speakers/voigt-horn/gallery/Lowther Voigt Horn 2.avif',
      videoUrl: 'https://www.youtube.com/embed/B8OTZ63Ns3c'
    },
    galleryImages: [
      {
        src: '/images/speakers/voigt-horn/gallery/Lowther Voigt Horn 2.avif',
        alt: '4ft Voigt Horn detail view'
      },
      {
        src: '/images/speakers/voigt-horn/gallery/Lowther Voigt Horn 3.avif',
        alt: '4ft Voigt Horn side view'
      },
      {
        src: '/images/speakers/voigt-horn/gallery/Lowther Voigt Horn 4.avif',
        alt: '4ft Voigt Horn front view'
      }
    ],
    lifestyleImages: [
      {
        src: '/images/speakers/voigt-horn/gallery/Lowther Voigt Horn.avif',
        alt: '4ft Voigt Horn in room'
      },
      {
        src: '/images/speakers/voigt-horn/gallery/Lowther Voigt Horn 2.avif',
        alt: '4ft Voigt Horn detail'
      }
    ],
    craftsmanshipContent: [
      {
        title: 'Paul Voigt\'s Vision',
        description: 'In the 1920s, Paul Voigt created a horn loudspeaker that would become the foundation of modern Hi‑Fi. This design represents a moment in time when Great Britain was at the forefront of both engineering and creativity.',
        image: '/images/speakers/voigt-horn/gallery/Lowther Voigt Horn.avif'
      },
      {
        title: 'Field Coil Excellence',
        description: 'Our 2024 reproduction is designed for the Field Coil Philharmonic drive unit, pairing Voigt\'s pioneering form with Lowther\'s most coveted instrument. The result is a timeless union of past and present.',
        image: '/images/speakers/voigt-horn/gallery/Voigt-horn-field-coil.jpg'
      },
      {
        title: 'Handcrafted Heritage',
        description: 'Handcrafted in Britain from Baltic Birch with matched veneers, each cabinet is individually built to commission. This is not just a loudspeaker - it is a piece of Hi‑Fi history, preserved in an eternity of music.',
        image: '/images/speakers/voigt-horn/gallery/Lowther Voigt Horn 4.avif'
      }
    ],
    customerQuotes: [
      { quote: 'Hearing the 4ft Voigt Horns was like standing inside the music itself.' },
      { quote: 'It felt like a live performance, not a playback.' },
      { quote: 'I\'ve heard Western Electrics, but these held their own, powerful and pure.' },
      { quote: 'The bass reached through the floor and the highs hung in the air like light.' },
      { quote: 'For something born a century ago, they sound astonishingly alive.' },
      { quote: 'The craftsmanship is beautiful, but the sound is what takes your breath away.' },
      { quote: 'It\'s a rebirth of something truly British, and it made me fall in love with music all over again.' }
    ]
  }
};

