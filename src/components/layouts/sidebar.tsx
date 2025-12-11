'use client';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/src/store/themeConfigSlice';
//import AnimateHeight from 'react-animate-height';
import { IRootState } from '@/src/store';
import { useEffect } from 'react';
import IconCaretsDown from '@/src/components/icon/icon-carets-down';
import IconMenuDashboard from '@/src/components/icon/menu/icon-menu-dashboard';
//import IconCaretDown from '@/src/components/icon/icon-caret-down';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/src/i18n';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { t } = getTranslation();
    const pathname = usePathname();
    // const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);

    // const toggleMenu = (value: string) => {
    //     setCurrentMenu((oldValue) => (oldValue === value ? '' : value));
    // };
    /* eslint-disable */
    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);
    /* eslint-enable */
    const setActiveRoute = () => {
        const allLinks = document.querySelectorAll('.sidebar a.text-primary');
        allLinks.forEach((el) => el.classList.remove('text-primary'));
        const selector = document.querySelector('.sidebar a[href="' + window.location.pathname + '"]');
        selector?.classList.add('text-primary');
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] bg-yellow shadow transition-all duration-300 transform ${
                    themeConfig.sidebar ? 'translate-x-0' : '-translate-x-full'
                } ${semidark ? 'text-white-dark' : ''}`}
            >               
                <div className="h-full bg-white dark:bg-black">
                    {/* Logo & Collapse Button */}
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="flex items-center text-2xl font-semibold dark:text-white">
                            BHC
                        </Link>
                        <button
                            type="button"
                            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="rotate-90 dark:text-white" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <PerfectScrollbar className="h-[calc(100vh-80px)] px-4">
                        <ul className="space-y-2">
                            {/* Dashboard */}
                            <li>
                                <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10">
                                    <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
                                    <span className="text-black dark:text-white">{t('dashboard')}</span>
                                </Link>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
