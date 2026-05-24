import React, { useMemo, useState } from "react";

const plazaImages = {
  hero: "/local_images/plaza-hero.jpg",
  street: "/local_images/plaza-street.jpg",
  courtyard: "/local_images/plaza-courtyard.jpg",
  pond: "/local_images/plaza-pond.jpg",
  garage: "/local_images/plaza-garage.jpg",
};

const plazaLinks = {
  visit: "https://www.google.com/maps/dir/?api=1&destination=438%20Hobron%20Ln%2C%20Honolulu%2C%20HI%2096815",
  parking: "https://www.google.com/maps/dir/?api=1&destination=444%20Hobron%20Ln%2C%20Honolulu%2C%20HI%2096815",
  instagram: "https://www.instagram.com/eatonsquarehi/",
};

function googleDirections(destination) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

const rawBusinesses = [
  ["Food Pantry Eaton Square", "Grocery / convenience", "Essentials", "groceries, deli, poke, prepared food", "Verify current hours", "808-947-3763", "438 Hobron Ln #110, Honolulu, HI 96815", "https://food-pantry-eaton-square.res-menu.net/", "/local_images/food-pantry-eaton-square.jpg", "A neighborhood grocery and deli stop with everyday essentials, prepared foods, sushi, poke, and bakery items."],
  ["kulu kulu", "Japanese-style cake shop", "Food", "cakes, pastries, sweet gifts", "Daily · 8:30 AM–7 PM", "808-931-0506", "438 Hobron Ln Ste 102, Honolulu, HI 96815", "https://www.kulukulucake.com/", "/local_images/kulu-kulu.jpg", "A dessert stop known for Japanese-style cakes, pastries, custom cakes, and quick pickup."],
  ["Komedokoro M’s", "Japanese takeout / musubi / rice bowls", "Food", "musubi, poke bowls, curry bowls", "Mon–Sat · 8 AM–2 PM", "808-913-2021", "438 Hobron Ln #107, Honolulu, HI 96815", "https://www.instagram.com/komedokoromshonolulu/", "/local_images/komedokoro-m-s.jpg", "A Japanese takeout spot associated with musubi, poke bowls, curry bowls, and comfort food."],
  ["Munch N Brunch Waikiki", "Brunch cafe / restaurant", "Food", "breakfast sandwiches, burritos, coffee", "Verify current hours", "", "438 Hobron Ln, Honolulu, HI 96815", "https://www.instagram.com/munchnbrunchwaikiki/", "/local_images/munch-n-brunch-waikiki.jpg", "A brunch cafe inside Eaton Square with iced coffees, breakfast sandwiches, burritos, and weekend energy."],
  ["Mahalo Noodle Waikiki", "Okinawan soba / noodles", "Food", "noodles, soba, casual lunch", "Verify current hours", "", "438 Hobron Ln #109A, Honolulu, HI 96815", "https://www.instagram.com/mahalo_noodle_waikiki/", "/local_images/mahalo-noodle-waikiki.jpg", "A noodle shop inside Eaton Square. Suite details should be confirmed before permanent signage."],
  ["Coco Sand Café", "Japanese sandwich café", "Food", "sandwiches, lattes, casual lunch", "Mon–Fri · 9 AM–2 PM", "808-913-2001", "438 Hobron Ln Ste 107, Honolulu, HI 96815", "https://www.instagram.com/cocosand.cafe/", "/local_images/coco-sand-caf.jpg", "A Japanese sandwich café in Eaton Square for hot and cold sandos, pastas, and grab-and-go lunch."],
  ["Tlacuaches 808", "Mexican street-style food", "Food", "birria tacos, burritos, quick lunch", "Check current hours", "808-784-0060", "438 Hobron Ln Unit 115, Honolulu, HI 96815", "https://www.tlacuaches808.com/", "https://konumusic.com/wp-content/uploads/2026/01/Tlacuaches-808-mexican-1024x576.jpg", "A hidden Eaton Square taqueria serving Mexican street-style food, birria tacos, burritos, and quick lunch plates."],
  ["Pacific Hair Waikiki", "Hair-loss solutions / wigs / extensions", "Beauty", "wigs, extensions, hair-loss support", "Tue–Sat · 11 AM–6 PM", "808-260-4957", "438 Hobron Ln Unit 109B, Honolulu, HI 96815", "https://www.pacifichair.com/", "/local_images/tlacuaches-808.jpg", "A hair-loss solutions and wig studio at Eaton Square."],
  ["Be U Salon", "Hair salon", "Beauty", "haircuts, color, treatments", "10 AM–7 PM · verify days", "808-476-6940", "438 Hobron Ln #PH3, Honolulu, HI 96815", "https://www.shinjihairnewyork.com/", "/local_images/be-u-salon.jpg", "A hair salon offering haircuts, color, treatments, straightening, and perms."],
  ["Hinae Salon", "Hair salon", "Beauty", "haircuts, styling, salon care", "Wed–Mon · 10 AM–6 PM", "808-951-5700", "438 Hobron Ln #220, Honolulu, HI 96815", "https://www.instagram.com/hinaesalon/", "/local_images/hinae-salon.jpg", "A salon inside Eaton Square with current listings pointing to Suite 220."],
  ["Honolulu Nail Academy", "Beauty school / nail training", "Beauty", "nail training, esthetics education", "Mon–Fri · 9 AM–5:30 PM", "808-944-1121", "438 Hobron Ln #207 & #208, Honolulu, HI 96815", "https://www.google.com/search?q=Honolulu+Nail+Academy+438+Hobron+Lane", "/local_images/honolulu-nail-academy.jpg", "A beauty school and training academy listed at Eaton Square."],
  ["Miself Beauty Care", "Skincare / beauty care", "Beauty", "skincare, beauty care, private appointments", "By appointment", "", "438 Hobron Ln Suite 401, Honolulu, HI 96815", "https://www.google.com/search?q=Miself+Beauty+Care+438+Hobron+Suite+401", "/local_images/miself-beauty-care.jpg", "A likely current skincare and beauty-care provider listed at Eaton Square. Confirm signage before permanent publishing."],
  ["Xanadu Massage and Spa", "Massage / facial spa", "Wellness", "massage, facials, spa care", "Daily · 9 AM–6 PM", "808-201-1881", "438 Hobron Ln Suite 207A, Honolulu, HI 96815", "https://www.spaxanaduhawaii.com/contact-5", "/local_images/xanadu-massage-and-spa.jpg", "A massage and spa location inside Eaton Square."],
  ["Red Earth Massage & Wellness", "Massage therapy", "Wellness", "massage, relaxation, bodywork", "Daily · 9 AM–9 PM", "808-942-4325", "438 Hobron Ln Suite 211, Honolulu, HI 96815", "https://www.redearthmassage-waikiki.com/contact", "/local_images/red-earth-massage-wellness.jpg", "A massage and wellness studio at Eaton Square."],
  ["Hale Lumiere Hawaii Spa", "Healing / spa / energy work", "Wellness", "healing, spa, energy work", "By appointment", "702-530-7314", "438 Hobron Ln #215, Honolulu, HI 96815", "https://www.halelumierehawaiispa.com/", "/local_images/hale-lumiere-hawaii-spa.jpg", "A healing and spa studio located at Eaton Square."],
  ["AK Massage & Healing", "Massage salon", "Wellness", "massage, healing, bodywork", "Verify current hours", "808-810-6860", "438 Hobron Ln #216, Honolulu, HI 96815", "https://www.google.com/search?q=AK+Massage+Healing+438+Hobron+216", "/local_images/ak-massage-healing.jpg", "A massage and healing business listed at Suite 216."],
  ["Kao Spa Hawaii", "Med spa / beauty / wellness", "Wellness", "med spa, beauty, self-care", "Mon–Fri & Sun · 9 AM–5 PM", "808-202-2120", "438 Hobron Ln #222, Honolulu, HI 96815", "https://www.kaospahawaii.com/", "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop", "A med spa and beauty/wellness studio at Eaton Square."],
  ["The Mbar Medspa", "Med spa / aesthetics", "Wellness", "aesthetics, skin care, med spa", "Tue–Wed 10 AM–7 PM · Fri–Sat 12 PM–7 PM", "808-888-9153", "438 Hobron Ln Ste 311, Honolulu, HI 96815", "https://www.thembarmedspa.com/", "/local_images/kao-spa-hawaii.jpg", "An aesthetics and med spa studio inside Eaton Square."],
  ["Massaged by Jobe", "Massage therapy / cosmetics", "Wellness", "private massage, skincare, bodywork", "By appointment", "808-497-5623", "438 Hobron Ln Suite 401, Honolulu, HI 96815", "https://www.jobesmassagehawaii.com/", "/local_images/massaged-by-jobe.jpg", "A massage therapy and skincare provider listed at Eaton Square."],
  ["Sunshine Massage & Spa", "Massage & spa", "Wellness", "massage, spa care, relaxation", "Verify current hours", "", "438 Hobron Ln #415, Honolulu, HI 96815", "https://www.google.com/search?q=Sunshine+Massage+Spa+438+Hobron+415", "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop", "A likely current massage and spa provider listed at Eaton Square. Confirm by phone or on-site before permanent signage."],
  ["Mālama Serenity Therapy", "Counseling / therapy group", "Health", "therapy, counseling, mental health support", "By appointment", "808-909-2006", "438 Hobron Ln PH4, Honolulu, HI 96815", "https://malamaserenity.com/contact-us/", "/local_images/sunshine-massage-spa.jpg", "A therapy office with an Eaton Square location."],
  ["Self Help Hawaii, LLC", "Marriage & family therapy", "Health", "individuals, couples, families", "By appointment", "808-793-5633", "438 Hobron Ln Suite 307, Honolulu, HI 96815", "https://www.psychologytoday.com/us/therapists/self-help-hawaii-llc-honolulu-hi/265812", "/local_images/self-help-hawaii-llc.jpg", "A marriage and family therapy practice listed at Eaton Square."],
  ["Aaron Kaplan, Ph.D.", "Psychotherapy / evaluation practice", "Health", "in-person or telehealth therapy", "By appointment", "808-381-6874", "438 Hobron Ln Suite 315, Honolulu, HI 96815", "https://waikikihealth.com/location/", "/local_images/aaron-kaplan-ph-d.jpg", "A psychotherapy office active at Eaton Square. Suite should be confirmed before printed signage."],
  ["Stephen R. Ho, D.D.S.", "Dental practice", "Health", "general dentistry and dental care", "Check current hours", "808-949-4288", "438 Hobron Ln Suite 209, Honolulu, HI 96815", "https://www.stephenrho.com/our-practice/office-tour/", "/local_images/stephen-r-ho-d-d-s.jpg", "A dental practice at Eaton Square."],
  ["Pacific Instruments", "Orthopedic / medical instruments", "Health", "orthopedic and medical instruments", "Verify current hours", "808-941-8880", "438 Hobron Ln Suite 204, Honolulu, HI 96815", "https://www.pacificinstruments.com/", "/local_images/pacific-instruments.jpg", "An orthopedic and medical instruments business listed at Suite 204."],
  ["Manoa Canon Integrated Health", "Integrated medicine / natural health", "Health", "natural health, integrated care", "Verify current hours", "808-913-8840", "438 Hobron Ln Suite 314, Honolulu, HI 96815", "https://manoacanon.com/", "/local_images/manoa-canon-integrated-health.jpg", "An integrated health and natural health office inside Eaton Square."],
  ["Pacific Neuropsychological Services", "Psychology / neuropsychology", "Health", "neuropsychology, psychology services", "Verify current hours", "", "438 Hobron Ln Suite 409, Honolulu, HI 96815", "https://www.google.com/search?q=Pacific+Neuropsychological+Services+438+Hobron+409", "/local_images/pacific-neuropsychological-services.jpg", "A likely current neuropsychology office. Phone verification recommended."],
  ["Optum Xplor Counseling of Hawaii", "Counseling / MFT office", "Health", "counseling, therapy, family support", "Verify current hours", "", "438 Hobron Ln #405, Honolulu, HI 96815", "https://www.google.com/search?q=Optum+Xplor+Counseling+of+Hawaii+438+Hobron+405", "https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=1200&auto=format&fit=crop", "A likely current counseling office listed at Eaton Square. Confirm by phone before permanent signage."],
  ["Aloha Toxicology", "Health / toxicology office", "Health", "toxicology, health office, lab services", "Verify current status", "", "438 Hobron Ln Suite 304, Honolulu, HI 96815", "https://www.google.com/search?q=Aloha+Toxicology+438+Hobron+Suite+304", "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop", "A weak-proof likely current health office listed at Eaton Square. Confirm before public signage."],
  ["Automated Lifestyles Hawaii", "Smart-home / AV / security showroom", "Services", "smart home, AV, security systems", "Verify current hours", "808-330-9490", "438 Hobron Ln Unit 117, Honolulu, HI 96815", "https://www.alohasmarthome.com/", "/local_images/optum-xplor-counseling-of-hawaii.jpg", "A smart-home, AV, and security contractor showroom at Eaton Square."],
  ["Heisei USA", "Travel agency / private transport / tours", "Services", "travel, tours, private transport", "Verify current hours", "808-321-0228", "438 Hobron Ln #207, Honolulu, HI 96815", "https://www.heisei-usa.com/", "/local_images/heisei-usa.jpg", "A travel agency and private transport office listed inside Eaton Square."],
  ["Eaton Square Post Office", "USPS contract postal unit", "Services", "mail, shipping, quick errands", "Mon–Fri 10 AM–1 PM, 1:30–4:30 PM · Sat 9–10:30 AM", "808-973-7515", "438 Hobron Ln Ste P11, Honolulu, HI 96815", "https://tools.usps.com/find-location.htm?location=1439665", "https://www.usps.com/assets/images/home/logo_mobile.svg", "A USPS contract postal unit inside Eaton Square for mail and shipping errands."],
  ["Roberts Hawaii", "Tours / transportation / reservations", "Services", "visitor reservations and transportation help", "Check current hours", "808-539-9400", "438 Hobron Ln Suite 500, Honolulu, HI 96815", "https://www.robertshawaii.com/contact", "https://assets.milestoneinternet.com/cdn-cgi/image/f%3Dauto/c-m-marketing-solutions-llc-parent/roberts-hawaii/siteimages/island-tours/oahu/pearl-harbor-tour-in-honolulu-hi-usa.jpg?height=830&width=1440", "Tours, transportation, and reservations office listed at Eaton Square."],
  ["Hawaii Coworking", "Coworking / meeting rooms / virtual office", "Professional", "workspace, meetings, workshops, virtual office", "Bookable workspace", "808-320-1233", "438 Hobron Ln PH1, Honolulu, HI 96815", "https://hawaiicoworking.co/", "/local_images/eaton-square-post-office.jpg", "A coworking, meeting room, and virtual office space inside Eaton Square."],
  ["Shah and Associates", "Accounting & professional services", "Professional", "tax, accounting, business services", "Mon–Fri · 8 AM–4:30 PM", "808-942-7878", "438 Hobron Ln Suite 212, Honolulu, HI 96815", "https://shahandassociateshi.com/contact-us/", "/local_images/shah-and-associates.jpg", "A professional office offering accounting and business-related services."],
  ["Aloha Hospitality Professionals", "Hospitality staffing / workforce solutions", "Professional", "staffing, hospitality, workforce", "Verify current hours", "", "438 Hobron Ln Suite 312, Honolulu, HI 96815", "https://www.alohahp.com/", "/local_images/aloha-hospitality-professionals.jpg", "A workforce and hospitality staffing office headquartered at Eaton Square."],
  ["Hawaii Internship", "Internship placement / education office", "Professional", "internships, education, placement", "Verify current hours", "", "438 Hobron Ln #205, Honolulu, HI 96815", "https://www.google.com/search?q=Hawaii+Internship+438+Hobron+Lane+205", "/local_images/hawaii-internship.jpg", "A likely current internship and education-placement office listed at Eaton Square. Confirm before permanent publishing."],
  ["Gourmet Events Hawaii", "Event planning / catering / production", "Professional", "events, catering, production", "Verify current hours", "808-888-2908", "438 Hobron Ln Suite 312, Honolulu, HI 96815", "https://www.gourmeteventshawaii.com/", "/local_images/gourmet-events-hawaii.jpg", "An event planning, catering, and production business listed at Eaton Square."],
  ["Denny Wong Designs", "Jewelry design / jewelry business", "Retail", "jewelry design, fine jewelry", "Verify current hours", "808-947-0188", "438 Hobron Ln Suite 202, Honolulu, HI 96815", "https://dennywong.com/", "/local_images/denny-wong-designs.jpg", "A jewelry design business listed at Eaton Square."],
  ["Nikko Gems", "Jewelry & gems", "Retail", "jewelry, gifts, hidden finds", "Confirm current status", "808-949-2797", "438 Hobron Ln Ste 111, Honolulu, HI 96815", "https://www.waikikigetdown.com/d/d/nikko-gems-jewelry-waikiki.html", "https://images1.loopnet.com/i2/zvlbxmUCPu3C8jcHcz_RcHFQRHRCk7vxvFu7lXmBUAo/112/image.jpg", "A jewelry and gems shop with active storefront clues, but current status should be verified on site."],
  ["World Divine Light Hawaii Center", "Spiritual center", "Community", "spiritual practice, community, quiet reflection", "Tue–Sun · 11 AM–6 PM", "808-600-1812", "438 Hobron Ln #100, Honolulu, HI 96815", "https://www.worlddivinelight.org/en", "/local_images/nikko-gems.svg", "A spiritual center located inside Eaton Square at 438 Hobron Lane, #100."],
  ["Prince of Peace Lutheran Church", "Church & community space", "Community", "Sunday service, community, choir practice", "Check current schedule", "808-922-6011", "438 Hobron Ln Suite 208, Honolulu, HI 96815", "https://www.princeofpeacewaikiki.com/", "https://images.squarespace-cdn.com/content/v1/5d52f2d3fdb5b20001f5d5e8/1566094600155-0PITGFFXG9J0T37G2J0Z/Prince+of+Peace+Waikiki+Logo.png", "A Waikiki church located at Eaton Square."],
];

const businesses = rawBusinesses.map(([name, type, category, bestFor, hours, phone, address, website, image, detail]) => ({
  name,
  type,
  category,
  bestFor,
  hours,
  phone,
  address,
  website,
  image,
  detail,
  map: googleDirections(`${name} ${address}`),
}));

const filters = ["All", ...Array.from(new Set(businesses.map((business) => business.category)))];

const happenings = [
  {
    title: "Featured today",
    kicker: "Tenant spotlight",
    text: "Highlight one tenant at a time with one strong image, one sentence, and quick actions.",
    image: plazaImages.courtyard,
  },
  {
    title: "Current specials",
    kicker: "On the table",
    text: "Use this panel for lunch specials, bakery drops, brunch features, grocery deals, salon promos, or limited-time tenant offers.",
    image: plazaImages.courtyard,
  },
  {
    title: "Local events",
    kicker: "In the square",
    text: "Something’s moving.",
    image: plazaImages.courtyard,
  },
];

const visitPanels = {
  location: {
    title: "Eaton Square Waikiki",
    eyebrow: "Visit",
    text: "438 Hobron Lane. Tap for directions to the plaza entrance.",
    image: plazaImages.street,
    link: plazaLinks.visit,
    action: "Open directions",
  },
  parking: {
    title: "Park nearby",
    eyebrow: "Parking",
    text: "Parking is listed at 444 Hobron Lane. Tap for parking directions.",
    image: plazaImages.garage,
    link: plazaLinks.parking,
    action: "Open parking directions",
  },
  social: {
    title: "Social wall",
    eyebrow: "Live plaza feed",
    text: "A visual board for tenant posts, daily specials, tagged photos, and plaza updates.",
    image: plazaImages.courtyard,
    link: "#today",
    action: "View updates",
  },
};

export function filterBusinesses(items, activeFilter, searchQuery) {
  const query = searchQuery.trim().toLowerCase();
  return items.filter((item) => {
    const matchesFilter = activeFilter === "All" || item.category === activeFilter;
    const searchableText = `${item.name} ${item.type} ${item.category} ${item.bestFor} ${item.address}`.toLowerCase();
    return matchesFilter && searchableText.includes(query);
  });
}

function runSmokeTests() {
  console.assert(filterBusinesses(businesses, "All", "").length === businesses.length, "All filter should return every business.");
  console.assert(filterBusinesses(businesses, "Food", "").length === 6, "Food filter should return six food listings.");
  console.assert(filterBusinesses(businesses, "Food", "tlacuaches").some((item) => item.name === "Tlacuaches 808"), "Tlacuaches 808 should be searchable under Food.");
  console.assert(filterBusinesses(businesses, "Food", "coco").some((item) => item.name === "Coco Sand Café"), "Coco Sand Café should be searchable under Food.");
  console.assert(filterBusinesses(businesses, "Services", "heisei").some((item) => item.name === "Heisei USA"), "Heisei USA should be searchable under Services.");
  console.assert(filterBusinesses(businesses, "Beauty", "miself").some((item) => item.name === "Miself Beauty Care"), "Miself Beauty Care should be searchable under Beauty.");
  console.assert(filterBusinesses(businesses, "Wellness", "sunshine").some((item) => item.name === "Sunshine Massage & Spa"), "Sunshine Massage & Spa should be searchable under Wellness.");
  console.assert(filterBusinesses(businesses, "Professional", "internship").some((item) => item.name === "Hawaii Internship"), "Hawaii Internship should be searchable under Professional.");
  console.assert(filterBusinesses(businesses, "Health", "optum").some((item) => item.name === "Optum Xplor Counseling of Hawaii"), "Optum Xplor Counseling of Hawaii should be searchable under Health.");
  console.assert(filterBusinesses(businesses, "Health", "toxicology").some((item) => item.name === "Aloha Toxicology"), "Aloha Toxicology should be searchable under Health.");
  console.assert(filterBusinesses(businesses, "Professional", "coworking").some((item) => item.name === "Hawaii Coworking"), "Coworking should be searchable.");
  console.assert(filterBusinesses(businesses, "Community", "divine").some((item) => item.name === "World Divine Light Hawaii Center"), "World Divine Light should be searchable.");
  console.assert(businesses.every((item) => item.map.includes("google.com/maps/dir")), "Every business should have a directions URL.");
  console.assert(businesses.every((item) => item.phone || item.website), "Every business should have a phone or website fallback.");
  console.assert(!JSON.stringify({ businesses, happenings, visitPanels }).includes("$1"), "No unresolved placeholders should exist.");
  console.assert(visitPanels.parking.image === plazaImages.garage, "Parking panel should use the mapped garage image.");
  console.assert(!businesses.some((item) => item.name === "First Hawaiian Bank"), "First Hawaiian Bank should be removed from the active directory.");
  console.assert(businesses.some((item) => item.name === "Eaton Square Post Office"), "Post office should use the cleaner visitor-facing name.");
  console.assert(businesses.length >= 20, "Directory should include the broader tenant sweep.");
}

runSmokeTests();

function phoneHref(phone) {
  const digits = String(phone || "").replace(/[^0-9]/g, "");
  return digits ? `tel:+1${digits.slice(-10)}` : null;
}

function openExternal(url) {
  if (!url) return;
  if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
}

function callBusiness(business) {
  const callUrl = phoneHref(business.phone);
  if (callUrl && typeof window !== "undefined") {
    window.location.href = callUrl;
    return;
  }
  openExternal(business.website);
}

function SafeImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  return <img src={failed ? plazaImages.courtyard : src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

function ActionButton({ children, variant = "light", onClick }) {
  const styles = variant === "dark" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900 hover:bg-slate-200";
  return (
    <button onClick={onClick} className={`rounded-2xl px-3 py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5 ${styles}`}>
      {children}
    </button>
  );
}

function Modal({ item, onClose }) {
  if (!item) return null;
  const isBusiness = Boolean(item.address);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xl" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-[0_40px_140px_rgba(0,0,0,0.45)]" onClick={(event) => event.stopPropagation()}>
        <div className="relative h-[42vh] min-h-72 overflow-hidden">
          <SafeImage src={item.image} alt={item.title || item.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
          <button onClick={onClose} className="absolute right-5 top-5 rounded-full bg-white/90 p-3 text-slate-950 shadow-lg backdrop-blur transition hover:scale-105">×</button>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <p className="text-sm uppercase tracking-[0.28em] text-white/65">{item.kicker || item.category}</p>
            <h3 className="mt-2 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{item.title || item.name}</h3>
          </div>
        </div>
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <p className="text-lg leading-8 text-slate-700">{item.text || item.detail}</p>
            {item.address && <p className="mt-5 text-sm text-slate-500">{item.address}</p>}
          </div>
          {isBusiness && (
            <div className="grid gap-3 text-sm">
              <button onClick={() => callBusiness(item)} className="rounded-2xl bg-slate-950 px-5 py-4 text-center font-semibold text-white transition hover:-translate-y-0.5">{item.phone ? `Call ${item.phone}` : "Website"}</button>
              <button onClick={() => openExternal(item.map)} className="rounded-2xl bg-[#0A3B66] px-5 py-4 text-center font-semibold text-white transition hover:-translate-y-0.5">Open Map</button>
              <button onClick={() => openExternal(item.website)} className="rounded-2xl bg-slate-100 px-5 py-4 text-center font-semibold text-slate-950 transition hover:bg-slate-200">Website / Social</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BusinessCard({ business, onDetails }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_70px_rgba(11,31,58,0.12)] ring-1 ring-slate-200/70">
      <div className="relative h-60 overflow-hidden">
        <SafeImage src={business.image} alt={`${business.name} at Eaton Square`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
        <div className="absolute left-5 top-5 rounded-2xl bg-white/90 px-3 py-2 text-sm font-semibold text-[#0A3B66] shadow-lg backdrop-blur">{business.category}</div>
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <h3 className="text-2xl font-semibold tracking-tight">{business.name}</h3>
          <p className="mt-1 text-sm text-white/75">{business.type}</p>
        </div>
      </div>
      <div className="space-y-5 p-5">
        <div>
          <p className="rounded-full bg-[#F3F0EA] px-4 py-2 text-sm text-slate-700"><span className="font-semibold text-slate-950">Best for:</span> {business.bestFor}</p>
          <p className="mt-3 text-sm text-slate-500">{business.hours}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <ActionButton variant="dark" onClick={() => onDetails(business)}>Details</ActionButton>
          <ActionButton onClick={() => callBusiness(business)}>Call</ActionButton>
          <ActionButton onClick={() => openExternal(business.map)}>Map</ActionButton>
        </div>
      </div>
    </article>
  );
}

function VisitCard({ active, title, text, onClick }) {
  return (
    <button onClick={onClick} className={`w-full rounded-3xl p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${active ? "bg-[#0A3B66] text-white" : "bg-[#F7F3EA] text-slate-700 hover:bg-[#EFE7D8]"}`}>
      <p className={`font-semibold ${active ? "text-white" : "text-slate-950"}`}>{title}</p>
      <p>{text}</p>
      <p className={`mt-2 text-xs font-semibold ${active ? "text-white/75" : "text-[#0A3B66]"}`}>Tap to preview on the right</p>
    </button>
  );
}

export default function EatonSquareStageOne() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [modalItem, setModalItem] = useState(null);
  const [visitPanel, setVisitPanel] = useState("location");
  const visibleBusinesses = useMemo(() => filterBusinesses(businesses, active, query), [active, query]);
  const currentVisitPanel = visitPanels[visitPanel] || visitPanels.location;

  function handleVisitImageClick() {
    if (currentVisitPanel.link.startsWith("#")) {
      document.querySelector(currentVisitPanel.link)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    openExternal(currentVisitPanel.link);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F3EA] text-slate-950">
      <section className="relative min-h-[92vh] overflow-hidden px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0">
          <SafeImage src={plazaImages.hero} alt="Eaton Square Waikiki exterior" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#082B4C]/95 via-[#0A3B66]/70 to-[#F7F3EA]/10" />
        </div>
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/20 bg-white/10 px-4 py-3 text-white shadow-2xl backdrop-blur-xl">
          <div>
            <p className="text-sm font-semibold leading-none">Eaton Square</p>
            <p className="text-xs text-white/65">Waikiki</p>
          </div>
          <div className="hidden gap-6 text-sm text-white/80 md:flex">
            <a href="#directory" className="hover:text-white">Directory</a>
            <a href="#today" className="hover:text-white">Today</a>
            <a href="#visit" className="hover:text-white">Visit</a>
          </div>
          <a href="#directory" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0A3B66] shadow-lg transition hover:scale-105">Explore</a>
        </nav>
        <div className="relative z-10 mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 pt-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-white">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-xl">On Hobron Lane</div>
            <h1 className="max-w-4xl text-6xl font-semibold tracking-[-0.075em] sm:text-7xl lg:text-8xl">Eaton Square</h1>
            <p className="mt-7 max-w-xl text-xl leading-8 text-white/78">The courtyard with time in it.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#directory" className="inline-flex items-center rounded-full bg-white px-6 py-4 font-semibold text-[#0A3B66] shadow-2xl transition hover:-translate-y-1">See who’s here</a>
              <a href="#visit" className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/20">Find it</a>
            </div>
          </div>
          <div className="relative hidden overflow-hidden rounded-[3rem] border border-white/25 bg-white/15 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:block">
            <div className="relative h-[440px] overflow-hidden rounded-[2rem] bg-[#0A3B66]">
              <SafeImage src={plazaImages.pond} alt="Eaton Square koi pond courtyard" className="h-full w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Today</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Under the surface</h2>
                <p className="mt-3 text-white/70">Just below.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="directory" className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0A3B66]/70">Directory</p>
              <h2 className="mt-3 text-5xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-6xl">One page. Every door.</h2>
            </div>
            <div className="relative w-full max-w-md">
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search food, salon, errands..." className="w-full rounded-full border border-slate-200 bg-white px-6 py-4 shadow-sm outline-none transition focus:ring-4 focus:ring-[#0A3B66]/10" />
            </div>
          </div>
          <div className="mb-10 flex gap-3 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button key={filter} onClick={() => setActive(filter)} className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold transition ${active === filter ? "bg-[#0A3B66] text-white shadow-xl" : "bg-white text-slate-700 hover:bg-slate-100"}`}>{filter}</button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleBusinesses.map((business) => <BusinessCard key={business.name} business={business} onDetails={setModalItem} />)}
          </div>
          {visibleBusinesses.length === 0 && <div className="rounded-[2rem] bg-white p-8 text-center text-slate-600 shadow-sm">No matches yet. Try another category or search term.</div>}
        </div>
      </section>

      <section id="today" className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[#0A3B66] text-white shadow-[0_28px_90px_rgba(10,59,102,0.28)]">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[420px]">
              <SafeImage src={plazaImages.courtyard} alt="Eaton Square courtyard storefronts" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A3B66] via-[#0A3B66]/30 to-transparent" />
            </div>
            <div className="p-8 sm:p-12 lg:p-16">
              <div className="mb-7 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-white/75">Today</div>
              <h2 className="max-w-lg text-5xl font-semibold tracking-[-0.06em]">Under the surface</h2>
              <div className="mt-10 grid gap-4">
                {happenings.map((item) => (
                  <button key={item.title} onClick={() => setModalItem(item)} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/10 p-5 text-left backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm text-white/65">{item.kicker}</p>
                    </div>
                    <span>↗</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="visit" className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[3rem] bg-white p-8 shadow-[0_18px_70px_rgba(11,31,58,0.10)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0A3B66]/70">Visit</p>
            <h2 className="mt-3 text-5xl font-semibold tracking-[-0.06em]">438 Hobron Lane.</h2>
            <div className="mt-8 space-y-4 text-slate-700">
              <VisitCard active={visitPanel === "location"} title="Eaton Square Waikiki" text="438 Hobron Ln, Honolulu, HI 96815" onClick={() => setVisitPanel("location")} />
              <VisitCard active={visitPanel === "parking"} title="Parking nearby" text="Eaton Square parking is listed at 444 Hobron Ln." onClick={() => setVisitPanel("parking")} />
              <VisitCard active={visitPanel === "social"} title="Social wall" text="Tenant posts and plaza updates keep the page moving." onClick={() => setVisitPanel("social")} />
            </div>
          </div>
          <button onClick={handleVisitImageClick} className="relative min-h-[560px] overflow-hidden rounded-[3rem] bg-slate-900 text-left shadow-[0_18px_70px_rgba(11,31,58,0.16)]">
            <SafeImage src={currentVisitPanel.image} alt={currentVisitPanel.title} className="absolute inset-0 h-full w-full object-cover opacity-95" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white sm:p-12">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">{currentVisitPanel.eyebrow}</p>
              <h3 className="mt-3 max-w-xl text-5xl font-semibold tracking-[-0.06em]">{currentVisitPanel.title}</h3>
              <p className="mt-4 max-w-md text-white/75">{currentVisitPanel.text}</p>
              <p className="mt-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">{currentVisitPanel.action}</p>
            </div>
          </button>
        </div>
      </section>

      {modalItem && <Modal item={modalItem} onClose={() => setModalItem(null)} />}
    </main>
  );
}
