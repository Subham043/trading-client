import { Container, rem } from '@mantine/core';
import classes from './footer.module.css';
import { Logo } from '../Sidebar/Logo';
import { FC } from 'react';

const Footer:FC = () => {

  return (
    <div className={classes.footer}>
      <Container className={classes.inner} size='98%'>
        <Logo style={{ width: rem(100) }} />
      </Container>
    </div>
  );
}

export default Footer;