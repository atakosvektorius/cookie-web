import config from '@/config/config.json';

const Logo = () => {
  const { logo_darkmode, logo_width, logo_height, logo_text, logo_url, title } = config.site;

  return (
    <a href={logo_url} className="navbar-brand inline-block">
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div style={{ paddingRight: 5, paddingLeft: 5 }}>{logo_text}</div>
        <img
          src={logo_darkmode}
          alt={title}
          style={{
            height: logo_height.replace('px', '') + 'px',
            width: logo_width.replace('px', '') + 'px',
            borderRadius: 10,
          }}
        />
      </div>
    </a>
  );
};

export default Logo;
