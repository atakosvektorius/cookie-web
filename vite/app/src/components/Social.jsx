import DynamicIcon from './DynamicIcon';

const Social = ({ source, className }) => {
  return (
    <ul className={className}>
      {source.map((social) => (
        <li key={social.name}>
          <a aria-label={social.name} href={social.link} target="_blank" rel="noreferrer">
            <span className="sr-only">{social.name}</span>
            <DynamicIcon className="inline-block" icon={social.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Social;
