import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Nav from './Nav'
import Footer from './Footer'

type Props = {
  children?: ReactNode
  title?: string,
  showBackButton?: boolean,
}

const Layout = ({ children, title = 'CloudFirewall', showBackButton = true }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <Nav title={title} showBackButton={showBackButton}/>
    </header>
    {children}
    <footer>
      <Footer/>
    </footer>
  </div>
)

export default Layout
