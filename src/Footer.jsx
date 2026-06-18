import { GcdsFooter } from '@gcds-core/components-react';

function Footer() {
  return (
    <GcdsFooter
      display="full"
      contextualHeading="Contextual navigation"
      contextualLinks='{ "Why GC Notify": "#", "Features": "#", "Activity on GC Notify": "#" }'
    />
  );
}

export default Footer;
