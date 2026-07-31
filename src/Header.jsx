import {
  GcdsHeader,
  GcdsNavGroup,
  GcdsNavLink,
  GcdsSearch,
  GcdsTopNav,
} from '@gcds-core/components-react';

const STATISTIC_DASHBOARD_URL =
  'https://webdev08.tpsgc-pwgsc.gc.ca/remuneration-compensation/testing/dashboard.html';
const WEB_SWEEP_URL =
  'https://webdev08.tpsgc-pwgsc.gc.ca/remuneration-compensation/testing/CCC-Sweep.html';

function Header() {
  return (
    <GcdsHeader langHref="#" skipToHref="#main-content" lang="en">
      <GcdsSearch
        slot="search"
        action="https://gcintranet-recherche-search.tpsgc-pwgsc.gc.ca/b-eng.php?q={search}&search=&pagesize=10&page=1&checkboxgcintranet=true&language=en#sr"
      />
      <GcdsTopNav slot="menu" label="Top navigation" alignment="left">
        <GcdsNavGroup openTrigger="Tools" menuLabel="Tools">
          <GcdsNavLink href={STATISTIC_DASHBOARD_URL}>Statistic Dashboard</GcdsNavLink>
          <GcdsNavLink href={WEB_SWEEP_URL}>Web Sweep</GcdsNavLink>
        </GcdsNavGroup>
      </GcdsTopNav>
    </GcdsHeader>
  );
}

export default Header;
