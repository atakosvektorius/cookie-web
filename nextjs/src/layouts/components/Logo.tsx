"use client";

import config from "@/config/config.json";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Logo = ({ src }: { src?: string }) => {
  // destructuring items from config object
  const {
    logo,
    logo_darkmode,
    logo_width,
    logo_height,
    logo_text,
    logo_url,
    title,
  }: {
    logo: string;
    logo_darkmode: string;
    logo_width: any;
    logo_height: any;
    logo_text: string;
    logo_url: string;
    title: string;
  } = config.site;

  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const resolvedLogo =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? logo_darkmode
      : logo;
  const logoPath = src ? src : resolvedLogo;

  return (
    <Link href={logo_url} className="navbar-brand inline-block">
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <div style={{paddingRight: 5, paddingLeft: 5}}>
          {logo_text}
        </div>
        <Image
          src={logoPath}
          width={logo_width.replace("px", "") * 2}
          height={logo_height.replace("px", "") * 2}
          alt={title}
          style={{
            height: logo_height.replace("px", "") + "px",
            width: logo_width.replace("px", "") + "px",
            borderRadius: 10,
          }}
        />
      </div>
    </Link>
  );
};

export default Logo;
