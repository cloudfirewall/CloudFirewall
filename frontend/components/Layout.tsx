import * as React from 'react';
import Nav from './Nav';

type Props = {
  showBackButton: boolean;

}

const Layout: React.FC<Props> = ({showBackButton, children}) => {

  return(

    <>
    <Nav title="CloudFirewall" showBackButton={showBackButton}/>
    <section className="">

    {children}
    </section>

    </>
  );
}

export default Layout;