import { Group, ScrollArea, rem, UnstyledButton, Text, Collapse, ThemeIcon, Box } from '@mantine/core';
import {
  // IconNotes,
  IconGauge,
  IconChevronRight,
  IconUserCircle,
} from '@tabler/icons-react';
import { Logo } from './Logo';
import classes from './sidebar.module.css';
import { FC, useState } from 'react';
import { page_routes } from '../../utils/page_routes';
import { Link } from 'react-router-dom';

const mockdata = [
  { label: 'Dashboard', icon: IconGauge, link: page_routes.dashboard },
  { label: 'Users', icon: IconUserCircle, link: page_routes.users },
  // {
  //   label: 'Market news',
  //   icon: IconNotes,
  //   initiallyOpened: false,
  //   links: [
  //     { label: 'Overview', link: '/' },
  //     { label: 'Forecasts', link: '/' },
  //     { label: 'Outlook', link: '/' },
  //     { label: 'Real time', link: '/' },
  //   ],
  // },
];

function LinkContainer({ icon: Icon, label }: LinksGroupProps) {
  return (
    <Box style={{ display: 'flex', alignItems: 'center' }}>
      <ThemeIcon variant="light" size={30}>
        <Icon style={{ width: rem(18), height: rem(18) }} />
      </ThemeIcon>
      <Box ml="md">{label}</Box>
    </Box>
  )
}

interface LinksGroupProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: { label: string; link: string }[];
}

function LinksGroup({ icon: Icon, label, initiallyOpened, links, link }: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link) => (
    <Text<'a'>
      component="a"
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </Text>
  ));

  return (
    hasLinks ? <>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Group justify="space-between" gap={0}>
          <LinkContainer icon={Icon} label={label} />
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(-90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </> : <>
      <Link to={link ? link : '/'} className={classes.control}>
        <Group justify="space-between" gap={0}>
          <LinkContainer icon={Icon} label={label} />
        </Group>
      </Link>
    </>
  );
}

const Sidebar:FC = () => {
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Logo style={{ width: rem(120) }} />
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>
    </nav>
  );
}

export default Sidebar;