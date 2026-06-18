import {
  GcdsBreadcrumbs,
  GcdsBreadcrumbsItem,
  GcdsHeader,
  GcdsNavGroup,
  GcdsNavLink,
  GcdsSearch,
  GcdsTopNav,
} from '@gcds-core/components-react';

function Header() {
  const breadcrumbs = [
    { name: 'PSPC GCintranet ', href: 'https://gcintranet.tpsgc-pwgsc.gc.ca/gc/index-eng.html' },
    { name: 'Compensation', href: '/remuneration-compensation/index-eng.html' },
    { name: 'Compensation community hub', href: '/remuneration-compensation/comm-eng.html' },
    {
      name: 'Pay system instructions and documentation ',
      href: '/remuneration-compensation/instructions-eng.html',
    },
    { name: 'How to use the pay system', href: '/remuneration-compensation/utiliser-use-eng.html' },
    {
      name: 'Phoenix procedures, job aids and instructions',
      href: '/remuneration-compensation/procedures/recherche-search-eng.html',
    },
  ];

  return (
    <GcdsHeader langHref="#" skipToHref="#main-content" lang="en">
      <GcdsSearch
        slot="search"
        action="https://gcintranet-recherche-search.tpsgc-pwgsc.gc.ca/b-eng.php?q={search}&search=&pagesize=10&page=1&checkboxgcintranet=true&language=en#sr"
      />
      <GcdsTopNav slot="menu" label="Top navigation" alignment="left">
        <GcdsNavGroup openTrigger="Compensation" menuLabel="Compensation">
          <GcdsNavLink href="#" current>Compensation community hub</GcdsNavLink>
          <GcdsNavLink href="#">Compensation web applications</GcdsNavLink>
          <GcdsNavLink href="#">Shared Human Resources Services</GcdsNavLink>
          <GcdsNavLink href="#">Pay, pension and benefits</GcdsNavLink>
        </GcdsNavGroup>
        <GcdsNavGroup openTrigger="Procurement" menuLabel="Procurement">
          <GcdsNavLink href="#" current>
            Browse and purchase goods and services
          </GcdsNavLink>
          <GcdsNavLink href="#">Procurement advice, guides and tools</GcdsNavLink>
          <GcdsNavLink href="#">Careers in procurement</GcdsNavLink>
          <GcdsNavLink href="#">Procurement - More</GcdsNavLink>
        </GcdsNavGroup>
        <GcdsNavGroup openTrigger="Building and offices" menuLabel="Building and offices">
          <GcdsNavLink href="#" current>
            Report building and office issues (National Service Call Centre)
          </GcdsNavLink>
          <GcdsNavLink href="#">Property managed by the Government of Canada</GcdsNavLink>
          <GcdsNavLink href="#">Policies and procedures on federal buildings and offices</GcdsNavLink>
          <GcdsNavLink href="#">Find a real property contact          </GcdsNavLink>
            <GcdsNavLink href="#">Real Property Branch service catalogue</GcdsNavLink>
            <GcdsNavLink href="#">Buildings and offices - More</GcdsNavLink>

        </GcdsNavGroup>
        <GcdsNavGroup openTrigger="Government finances" menuLabel="Government finances">
          <GcdsNavLink href="#" current>
            Create reusable templates
            </GcdsNavLink>
  <GcdsNavLink href="#">Issuing payments</GcdsNavLink>
  <GcdsNavLink href="#">Receiving payments</GcdsNavLink>
  <GcdsNavLink href="#">Receiver General central systems</GcdsNavLink>
  <GcdsNavLink href="#">Year-end requirements</GcdsNavLink>
  <GcdsNavLink href="#">Maintaining the accounts of Canada</GcdsNavLink>
  <GcdsNavLink href="#">SIGMA: Finance, procurement and real property system</GcdsNavLink>
  <GcdsNavLink href="#">Government finances - More</GcdsNavLink>

        </GcdsNavGroup>
  

        <GcdsNavGroup openTrigger="More services" menuLabel="More services">
  <GcdsNavLink href="#">Translation Bureau's language services and tools</GcdsNavLink>
  <GcdsNavLink href="#">My Government of Canada Human Resources</GcdsNavLink>
  <GcdsNavLink href="#">Copyright Media Clearance Program</GcdsNavLink>
  <GcdsNavLink href="#">Advertising coordination and partnerships</GcdsNavLink>
  <GcdsNavLink href="#">Public opinion research</GcdsNavLink>
  <GcdsNavLink href="#">Forms catalogue</GcdsNavLink>
  <GcdsNavLink href="#">Services - More</GcdsNavLink>
        </GcdsNavGroup>
      </GcdsTopNav>

      <GcdsBreadcrumbs slot="breadcrumb">
        {breadcrumbs.map((crumb) => (
          <GcdsBreadcrumbsItem key={crumb.href} href={crumb.href}>
            {crumb.name}
          </GcdsBreadcrumbsItem>
        ))}
      </GcdsBreadcrumbs>
    </GcdsHeader>
  );
}

export default Header;
