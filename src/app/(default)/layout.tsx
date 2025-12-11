'use client';
import ContentAnimation from '@/src/components/layouts/content-animation';
import Footer from '@/src/components/layouts/footer';
import Header from '@/src/components/layouts/header';
import MainContainer from '@/src/components/layouts/main-container';
import Overlay from '@/src/components/layouts/overlay';
import ScrollToTop from '@/src/components/layouts/scroll-to-top';
import Sidebar from '@/src/components/layouts/sidebar';
import Portals from '@/src/components/portals';
import {  useSelector } from 'react-redux';
import { IRootState } from '@/src/store';



export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    return (
        <>
            {/* BEGIN MAIN CONTAINER */}
            <div className="relative">
                <Overlay />
                <ScrollToTop />

                {/* BEGIN APP SETTING LAUNCHER */}
                {/* END APP SETTING LAUNCHER */}

                <MainContainer>
                    {/* BEGIN SIDEBAR */}
                    <Sidebar />
                    {/* END SIDEBAR */}
                    <div 
                        className="flex flex-1 flex-col min-h-screen transition-all duration-300 relative"
                        style={{ 
                            marginLeft: themeConfig.sidebar ? '260px' : '0',
                            marginRight: themeConfig.rtlClass === 'rtl' && themeConfig.sidebar ? '260px' : '0'
                        }}
                    >
                        {/* BEGIN TOP NAVBAR */}
                        <Header />
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        <ContentAnimation>{children}</ContentAnimation>
                        {/* END CONTENT AREA */}

                        {/* BEGIN FOOTER */}
                        <Footer />
                        {/* END FOOTER */}
                        <Portals />
                    </div>
                </MainContainer>
            </div>
        </>
    );
}
