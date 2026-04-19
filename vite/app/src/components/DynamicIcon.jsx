import * as FaIcons6 from 'react-icons/fa6';

const iconLibraries = { fa: FaIcons6 };

const getIconLibrary = (icon) => {
  const libraryKey = [...icon].reduce((lib, letter, i) => {
    if (letter === letter.toUpperCase() && lib === '' && i > 0) {
      return icon.slice(0, i).toLowerCase();
    }
    return lib;
  }, '');
  return iconLibraries[libraryKey];
};

const DynamicIcon = ({ icon, ...props }) => {
  const IconLibrary = getIconLibrary(icon);
  const Icon = IconLibrary ? IconLibrary[icon] : undefined;
  if (!Icon) return <span className="text-sm">Icon not found</span>;
  return <Icon {...props} />;
};

export default DynamicIcon;
