import { Link, useLocation } from 'react-router-dom';
import { humanize } from '@/utils/textConverter';

const Breadcrumbs = ({ className }) => {
  const { pathname } = useLocation();
  const paths = pathname.split('/').filter(Boolean);

  const parts = [{ label: 'Pradžia', href: '/' }];
  paths.forEach((segment, i) => {
    const href = `/${paths.slice(0, i + 1).join('/')}`;
    parts.push({ label: humanize(segment.replace(/[-_]/g, ' ')), href });
  });

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="inline-flex" role="list">
        {parts.map(({ label, href }, index) => (
          <li className="mx-1 capitalize" role="listitem" key={index}>
            {index > 0 && <span className="inline-block mr-1">/</span>}
            {index !== parts.length - 1 ? (
              <Link className="text-primary dark:text-darkmode-primary" to={href}>
                {label}
              </Link>
            ) : (
              <span className="text-light dark:text-darkmode-light">{label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
