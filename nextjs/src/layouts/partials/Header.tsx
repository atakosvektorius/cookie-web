"use client";
import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { IoSearch } from "react-icons/io5/index.js";


//  child navigation link interface
export interface IChildNavigationLink {
  name: string;
  url: string;
}

// navigation link interface
export interface INavigationLink {
  name: string;
  url: string;
  hasChildren?: boolean;
  children?: IChildNavigationLink[];
}

const Header = () => {
  const { main }: { main: INavigationLink[] } = menu;
  const { navigation_button, settings } = config;

  let pathname = usePathname();
  console.log(pathname.split('#')[0])

  const router = useRouter();


  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);



  const toggleNav = () => {
    // This assumes that your checkbox has the ID "nav-toggle"
    const navToggle = document.getElementById('nav-toggle') as HTMLInputElement;
    if (navToggle) {
      navToggle.checked = false; // Uncheck the checkbox, which should hide the menu
    }
  };



  const smoothScroll = (e: React.MouseEvent<HTMLElement>, href: string) => {
    toggleNav();

    
    const [pathWithoutAnchor] = href.split('#');

    if (pathname !== pathWithoutAnchor) {
      router.push(href);
    }

    if (href.startsWith('/#')) {      
      e.preventDefault();

      const id = href.substring(1);
      if(id !== "#") {
        const element = document.querySelector(id);  
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      else{
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
      
    }
  };


  // This effect will run once when the component mounts
  useEffect(() => {
    const { hash } = window.location; // Get the hash from the URL

    if (hash) {
      const id = hash.replace('#', ''); // Remove the '#' from the hash
      const element = document.getElementById(id);

      if (element) {
        // Scroll to the element
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  }, [pathname]);





  return (
    <header
      className={`z-30 ${settings.sticky_header ? "sticky top-0" : ""}`}
      style={{
        // padding: 10,
        backgroundColor: "rgba(20, 20, 20, 0.7)", // Use RGBA for transparency
        WebkitBackdropFilter: "blur(20px)", // Use a smaller, more typical blur radius
        backdropFilter: "blur(20px)",
        transform: "translate3d(0,0,0)"
      }}
    >
      <nav className="navbar container">
        {/* logo */}
        <Logo />
        {/* navbar toggler */}
        <input id="nav-toggle" type="checkbox" className="hidden" />
        <label
          htmlFor="nav-toggle"
          className="order-3 cursor-pointer flex items-center lg:hidden text-dark dark:text-white lg:order-1"
        >
          <svg id="show-button" className="h-6 fill-current block" viewBox="0 0 20 20">
            <title>Menu Open</title>
            <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z"></path>
          </svg>
          <svg id="hide-button" className="h-6 fill-current hidden" viewBox="0 0 20 20">
            <title>Menu Close</title>
            <polygon points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2" transform="rotate(45 10 10)"></polygon>
          </svg>
        </label>
        {/* /navbar toggler */}

        <ul
          id="nav-menu"
          className="navbar-nav order-3 hidden w-full pb-6 lg:order-1 lg:flex lg:w-auto lg:space-x-2 lg:pb-0 xl:space-x-8"
        >
          {main.map((menu, i) => (
            <React.Fragment key={`menu-${i}`}>
              {menu.hasChildren ? (
                <li className="nav-item nav-dropdown group relative">
                  <span
                    className={`nav-link inline-flex items-center ${
                      menu.children?.map(({ url }) => url).includes(pathname) ||
                      menu.children
                        ?.map(({ url }) => `${url}/`)
                        .includes(pathname)
                        ? "active"
                        : ""
                    }`}
                  >
                    {menu.name}
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </span>
                  <ul className="nav-dropdown-list hidden group-hover:block lg:invisible lg:absolute lg:block lg:opacity-0 lg:group-hover:visible lg:group-hover:opacity-100">
                    {menu.children?.map((child, i) => (
                      <li className="nav-dropdown-item" key={`children-${i}`}>
                        <Link
                          href={child.url}
                          onClick={(e) => smoothScroll(e, child.url)}
                          className={`nav-dropdown-link block ${
                            (pathname === `${child.url}/` ||
                              pathname === child.url) &&
                            "active"
                          }`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <Link
                    onClick={(e) => smoothScroll(e, menu.url)}
                    href={menu.url}
                    style={{
                      paddingLeft: 20,
                      paddingRight: 20,
                    }}
                    className={`nav-link hover:bg-white hover:text-black rounded-md ${
                      (pathname.split('#')[0] === `${menu.url.split('#')[0]}/` || pathname.split('#')[0] === menu.url.split('#')[0]) &&
                      "underline"
                    }`}
                  >
                    {menu.name}
                  </Link>
                </li>
              )}
            </React.Fragment>
          ))}
          {navigation_button.enable && (
            <li className="mt-4 inline-block lg:hidden">
              <Link
                className="btn btn-outline-primary btn-sm"
                href={navigation_button.link}
              >
                {navigation_button.label}
              </Link>
            </li>
          )}
        </ul>
        <div className="order-1 ml-auto flex items-center md:order-2 lg:ml-0">
          {settings.search && (
            <Link
              className="mr-5 inline-block border-r border-border pr-5 text-xl text-dark hover:text-primary dark:border-darkmode-border dark:text-white"
              href="/search"
              aria-label="search"
            >
              <IoSearch />
            </Link>
          )}
          <ThemeSwitcher className="mr-5" />
          {navigation_button.enable && (
            <Link
              className="btn btn-outline-primary btn-sm hidden lg:inline-block"
              href={navigation_button.link}
            >
              {navigation_button.label}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
