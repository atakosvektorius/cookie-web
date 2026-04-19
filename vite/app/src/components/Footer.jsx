import { Link } from 'react-router-dom';
import Logo from './Logo';
import Social from './Social';
import config from '@/config/config.json';
import menu from '@/config/menu.json';
import social from '@/config/social.json';
import { markdownify } from '@/utils/textConverter';

const Footer = () => {
  const { copyright } = config.params;

  return (
    <footer className="bg-theme-light dark:bg-darkmode-theme-light">
      <div className="container">
        <div className="row items-center py-10">
          <div className="mb-8 text-center lg:col-3 lg:mb-0 lg:text-left">
            <Logo />
          </div>
          <div className="mb-8 text-center lg:col-6 lg:mb-0">
            <ul>
              {menu.footer.map((item) => (
                <li className="m-3 inline-block" key={item.name}>
                  <Link to={item.url}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-8 text-center lg:col-3 lg:mb-0 lg:mt-0 lg:text-right">
            <Social source={social.main} className="social-icons" />
          </div>
        </div>
      </div>
      <div className="border-t border-border py-7 dark:border-darkmode-border">
        <div className="container text-center text-light dark:text-darkmode-light">
          <p
            dangerouslySetInnerHTML={markdownify(
              copyright.replace('XXXX', new Date().getFullYear().toString())
            )}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
