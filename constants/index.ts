import { FaInstagram, FaGithub, FaTwitter } from "react-icons/fa";

export const SocialMediaData = [
  {
    href: "https://instagram.com",
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://github.com",
    icon: FaGithub,
    label: "GitHub",
  },
  {
    href: "https://twitter.com",
    icon: FaTwitter,
    label: "Twitter",
  },
];

export const FOOTER_ITEMS = [
  {
    title: "Kurumsal",
    items: [
      { label: "Hakkımızda", href: "/about" },
      { label: "İletişim", href: "/contact" },
    ],
  },
  {
    title: "Destek",
    items: [
      { label: "Sık Sorulan Sorular", href: "/faq" },
      { label: "Yardım Merkezi", href: "/help" },
    ],
  },
];
