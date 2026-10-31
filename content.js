/* Website content. Edit the values below to update the site. */
window.SITE = {
  name: "Tristan Tucker",
  title: "Electrical Helper / Apprentice",
  location: "Swansea, Massachusetts",
  tagline: "Hands-on technician wiring up a career as a Massachusetts electrician.",
  about: ["Hands-on technician building a career as an electrician. Field experience troubleshooting low-voltage wiring, 900 hours of MTTI training, and currently enrolled in Tri-County's electrical program. OSHA 10 certified, dependable, and ready to log hours toward a Massachusetts license."],
  photo: "",
  status: { show: true, text: "Available for helper / apprentice hours" },
  contact: { email: "Tucker.Tristan57@gmail.com", phone: "(508) 493-7392", resumeFile: "assets/Tristan-Tucker-Resume.pdf" },
  socials: [
    { label: "LinkedIn", url: "" },
    { label: "Instagram", url: "" },
    { label: "Facebook", url: "" },
    { label: "GitHub", url: "" },
    { label: "TikTok", url: "" }
  ],
  facts: [
    { value: "900", unit: "hrs", label: "MTTI hands-on training" },
    { value: "OSHA", unit: "10", label: "Safety certified" },
    { value: "Hot", unit: "Works", label: "Certified" },
    { value: "2026", unit: "Sep–Dec", label: "Tri-County Electrical" }
  ],
  projects: [
    {
      featured: true, title: "3-Way & 4-Way Switching Wall", category: "School",
      meta: "Tri-County Electrical Program · Fall 2026",
      summary: "A full practice wall: single-pole, two 3-ways and a 4-way controlling multiple lights, laid out to code with clean cable routing.",
      description: ["Planned the switch leg and traveler runs before pulling a single cable so the layout stayed efficient and every box had the right fill.", "Terminated devices with consistent hook direction, labeled travelers, and tested every switch position for correct operation.", "Goal was a wall an inspector would sign off on — not just one that lights up."],
      tags: ["Residential wiring", "NM cable", "Switching", "Code compliance"],
      images: ["assets/img/project-switch-wall.jpg"],
      galleryImages: ["assets/img/IMG_3290.jpeg", "assets/img/IMG_3288.jpeg", "assets/img/IMG_3407.jpeg"]
    },
    {
      title: "EMT Conduit Bending", category: "School", meta: "Tri-County · Shop practice",
      summary: "Stub-ups, offsets, and saddles bent to measurement with a hand bender — layout math first, bend second.",
      description: ["Worked through 90° stub-ups, 30° offsets, and three-point saddles, measuring take-up and shrink so pieces land exactly where the drawing says.", "Learned to read the bender's marks and keep bends in plane so multiple runs stack parallel."],
      tags: ["EMT", "Conduit", "Layout math"], images: ["assets/img/project-conduit.jpg"],
      galleryImages: ["assets/img/IMG_3446.jpeg", "assets/img/IMG_3447.jpeg", "assets/img/IMG_3445.jpeg"]
    },
    {
      title: "NEC Load & Motor Circuit Calcs", category: "School", meta: "Tri-County · Code coursework",
      summary: "Dwelling-service load calculations and motor branch-circuit sizing straight out of the NEC.",
      description: ["Standard and optional dwelling calculations: general lighting, small-appliance, laundry, fixed appliances, HVAC and demand factors.", "Motor circuits: FLC tables, conductor sizing at 125%, overload and short-circuit/ground-fault protection."],
      tags: ["NEC", "Calculations", "Service sizing"], images: ["assets/img/project-load-calc.jpg"]
    },
    {
      title: "Phone & Network Line Repair", category: "Field work", meta: "ITG · Apr – Jul 2025",
      summary: "Traced faults in low-voltage communications wiring, then repaired or replaced lines and equipment on site.",
      description: ["Worked independently on service calls: locate the fault, repair or re-terminate, test, and leave clean workmanship behind.", "First real field experience with low-voltage systems — the habits carried straight into electrical work."],
      tags: ["Low voltage", "Telecom", "Troubleshooting"], images: ["assets/img/project-telecom.jpg"],
      galleryImages: ["assets/img/IMG_0518.jpeg", "assets/img/IMG_0433.jpeg", "assets/img/IMG_1110.jpeg", "assets/img/IMG_1151.jpeg", "assets/img/IMG_1046.jpeg"]
    },
    {
      title: "Caterpillar Engine R&R", category: "Mechanical", meta: "Glopes Construction · Dec 2025 – Feb 2026",
      summary: "Assisted with diesel engine removal, installation and leak repairs around heavy equipment.",
      description: ["Supported engine pulls and installs with hoists on an active shop floor, plus leak diagnosis and repair.", "Big-equipment mechanical work that built the discipline for safe, methodical hands-on work."],
      tags: ["Diesel", "Mechanical", "Heavy equipment"], images: ["assets/img/project-diesel.jpg"],
      galleryImages: ["assets/img/IMG_2220.jpeg", "assets/img/IMG_2257.jpeg", "assets/img/IMG_2347.jpeg", "assets/img/IMG_2205.jpeg", "assets/img/IMG_2118.jpeg"]
    }
  ],
  experience: [
    { role: "Parts Specialist", company: "AutoZone", dates: "Aug 2026 – Present", bullets: ["Match parts to specs and diagrams for light- and heavy-duty vehicles"] },
    { role: "Lube Technician", company: "McKay Chevrolet", dates: "Mar 2026 – May 2026", bullets: ["Inspections and maintenance using hand and power tools", "Kept an organized, safe work area in a fast-paced shop"] },
    { role: "Diesel Mechanic Apprentice", company: "Glopes Construction Inc.", dates: "Dec 2025 – Feb 2026", bullets: ["Assisted with Caterpillar engine removal, installation, and leak repairs", "Worked safely around heavy equipment on an active shop floor"] },
    { role: "Automotive Technician", company: "Firestone", dates: "Oct 2025 – Dec 2025", bullets: ["Hands-on troubleshooting and mechanical repairs"] },
    { role: "Telecommunications Technician", company: "ITG", dates: "Apr 2025 – Jul 2025", bullets: ["Traced and repaired faults in low-voltage communications wiring", "Repaired and replaced phone/network lines and equipment", "Worked independently with a focus on safety and clean workmanship"] },
    { role: "Crew Member", company: "Five Guys", dates: "Oct 2022 – Sep 2024", bullets: ["Reliable on every station in a high-volume restaurant"] }
  ],
  education: [
    { school: "Tri-County Regional Vocational Technical High School", program: "Electrical Program", dates: "September 2026 – December 2026", note: "Hands-on training in electrical code and practice (in progress)" },
    { school: "Motor Technical Training Institute (MTTI)", program: "Diploma Graduate", dates: "September 2023 – September 2024", note: "900 hours of hands-on technical training" },
    { school: "Joseph Case High School", program: "Diploma", dates: "September 2019 – May 2023", note: "Computer science focus" }
  ],
  skills: ["Electrical wiring & troubleshooting", "Low-voltage & communications systems", "Electrical code & safe practice", "Hand & power tools (SAE/Metric)", "Reading & following procedures", "Job-site & shop safety (OSHA 10)", "Mechanical aptitude", "Reliable, punctual & eager to learn"],
  certifications: ["OSHA 10", "Hot Works", "Certified PC Pro", "AP Computer Science Award"]
};
