export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const RESTAURANT = {
    name: "Ayanchin Downtown Restaurant",
    shortName: "Ayanchin Downtown",
    tagline: "Modern Mongolian Dining in the Heart of Ulaanbaatar",
    description:
        "Authentic Mongolian flavors, elevated with contemporary culinary craftsmanship.",
    phoneDisplay: "7707 2611",
    phoneHref: "tel:+97677072611",
    address:
        "Olympic Street 12-1, DB Office Building, Olympic Street, 1 Khoroo, Sukhbaatar District, Ulaanbaatar",
    rating: "4.2",
    reviewCount: 133,
    hoursNote: "Open until 12:00 AM",
    services: ["Dine-in", "Takeaway", "No-contact delivery"],
    mapsDirectionsUrl:
        "https://www.google.com/maps/dir/?api=1&destination=47.91504,106.91994",
    mapsEmbedUrl:
        "https://www.google.com/maps?q=47.91504,106.91994&z=17&output=embed",
    reviewsUrl:
        "https://www.google.com/maps/search/?api=1&query=Ayanchin+Downtown+Restaurant%2C+Ulaanbaatar",
};

export const NAV_LINKS = [
    { label: "Home", href: "#home" },
    { label: "Our Story", href: "#story" },
    { label: "Menu", href: "#menu" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#reviews" },
    { label: "Location", href: "#location" },
    { label: "Contact", href: "#contact" },
];

export const MENU_CATEGORIES = [
    "All",
    "Mongolian",
    "Steak & Grill",
    "Soups",
    "Salads",
    "Appetizers",
    "Main Courses",
    "Desserts",
    "Drinks",
];

export const GALLERY_FILTERS = ["All", "Food", "Interior", "Drinks", "Atmosphere", "Events"];

export const HERO_IMAGE =
    "https://images.unsplash.com/photo-1531973968078-9bb02785f13d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBkYXJrJTIwbHV4dXJ5JTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fHx8MTc4NzA1NjcwN3ww&ixlib=rb-4.1.0&q=85";

export const ABOUT_IMAGE =
    "https://images.unsplash.com/photo-1769955817432-641929f613f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxjaGVmJTIwcGxhdGluZyUyMGRpc2glMjBraXRjaGVuJTIwZmluZSUyMGRpbmluZ3xlbnwwfHx8fDE3ODcwNTY4MDF8MA&ixlib=rb-4.1.0&q=85";

export const EXPERIENCE_CARDS = [
    {
        id: "exp-authentic",
        title: "Authentic",
        text: "Traditional Mongolian flavors, prepared with respect for heritage.",
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGR1bXBsaW5ncyUyMGFzaWFuJTIwY3Vpc2luZSUyMGdvdXJtZXR8ZW58MHx8fHwxNzg3MDU2NzkxfDA&ixlib=rb-4.1.0&q=85",
        alt: "Traditional Mongolian dishes served on a wooden table",
        span: "md:col-span-7",
    },
    {
        id: "exp-contemporary",
        title: "Contemporary",
        text: "Modern presentation and international influence.",
        image: "https://images.pexels.com/photos/4253315/pexels-photo-4253315.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        alt: "Chef plating a contemporary dish with precision",
        span: "md:col-span-5",
    },
    {
        id: "exp-downtown",
        title: "Downtown",
        text: "Located in the center of Ulaanbaatar.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXJrJTIwbHV4dXJ5JTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fHx8MTc4NzA1NjcwN3ww&ixlib=rb-4.1.0&q=85",
        alt: "Contemporary downtown dining space",
        span: "md:col-span-5",
    },
    {
        id: "exp-late-evening",
        title: "Late Evening",
        text: "Open until midnight for dinner and late-night dining.",
        image: "https://images.unsplash.com/photo-1778104959469-0861d423de46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxjcmFmdCUyMGNvY2t0YWlscyUyMGJhciUyMGRhcmslMjBtb29keXxlbnwwfHx8fDE3ODcwNTY4MDF8MA&ixlib=rb-4.1.0&q=85",
        alt: "Craft cocktail on the bar late in the evening",
        span: "md:col-span-7",
    },
];

export const slugify = (value) =>
    value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
