import { useRouter } from 'next/router'
import {
  PropsWithChildren, useCallback, useEffect, useState,
} from 'react'
import { useResizeDetector } from 'react-resize-detector'

import dynamic from 'next/dynamic'
import useHeightScreen from 'src/hooks/useHeightScreen'
import { ReactQueryClientProvider } from 'src/providers/ReactQueryClientProvider'
import Sidebar, { SidebarOverlay } from './Sidebar/Sidebar'
import { nunito } from '@styles/font'
const Header = dynamic(() => import('./Header/Header'), { ssr: false })

export default function Layout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { locale } = router;

  const showFooter = locale === "vi";

  // Show status for xs screen
  const [isShowSidebar, setIsShowSidebar] = useState(false);

  // Show status for md screen and above
  const [isShowSidebarMd, setIsShowSidebarMd] = useState(true);

  const toggleIsShowSidebar = () => {
    setIsShowSidebar(!isShowSidebar);
  };

  // Clear and reset sidebar
  const resetIsShowSidebar = () => {
    setIsShowSidebar(false);
  };

  const onResize = useCallback(() => {
    resetIsShowSidebar();
  }, []);

  const { ref } = useResizeDetector({ onResize });

  // On first time load only
  useEffect(() => {
    const storedSidebarMd = localStorage.getItem('isShowSidebarMd');
    if (storedSidebarMd !== null) {
      setIsShowSidebarMd(storedSidebarMd === 'true');
    }
  }, []);

  const [isShowSidebarToggle, setIsShowSidebarToggle] = useState(true);

  const toggleNavbar = () => {
    setIsShowSidebarToggle(!isShowSidebarToggle);
  };

  return (
    <>
      <ReactQueryClientProvider>
        <div ref={ref}>
          <Sidebar 
            isShow={isShowSidebar} 
            isShowMd={isShowSidebarMd} 
            isShowSidebarToggle={isShowSidebarToggle} 
          />
          <div 
            className={`wrapper d-flex flex-column bg-light mb-6 ${nunito.className}`} 
            style={{ minHeight: `${useHeightScreen() - 30}px` }}
          >
            <Header toggleSidebar={toggleIsShowSidebar} toggleNavbar={toggleNavbar} />
            <div className={`body flex-grow-1 ps-3 bg-primary pb-7 pe-6`}>
              {children}
            </div>
          </div>
          {/* {showFooter && <Footer />} */}
          <SidebarOverlay isShowSidebar={isShowSidebar} toggleSidebar={toggleIsShowSidebar} />
        </div>
      </ReactQueryClientProvider>
    </>
  );
}
