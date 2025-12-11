'use client';
import React, { useEffect, useState } from 'react';

const ScrollToTop = () => {
    const [showTopButton, setShowTopButton] = useState(false);

    const goToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onScrollHandler = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        setShowTopButton(scrollTop > 50);
    };

    useEffect(() => {
        window.addEventListener('scroll', onScrollHandler);
        return () => {
            window.removeEventListener('scroll', onScrollHandler);
        };
    }, []);

    return (
        <div className="fixed bottom-6 z-50 right-6">
            {showTopButton && (
                <button
                    type="button"
                    onClick={goToTop}
                    className="animate-pulse rounded-full bg-white p-3 text-blue-600 shadow-md transition hover:bg-blue-100 dark:bg-gray-900 dark:hover:bg-blue-700 dark:text-white"
                    aria-label="Scroll to top"
                >
                    <svg
                        width="24"
                        height="24"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            opacity="0.5"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 20.75C12.4142 20.75 12.75 20.4142 12.75 20L12.75 10.75L11.25 10.75L11.25 20C11.25 20.4142 11.5858 20.75 12 20.75Z"
                            fill="currentColor"
                        />
                        <path
                            d="M6.00002 10.75C5.69667 10.75 5.4232 10.5673 5.30711 10.287C5.19103 10.0068 5.25519 9.68417 5.46969 9.46967L11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25C12.1989 3.25 12.3897 3.32902 12.5304 3.46967L18.5304 9.46967C18.7449 9.68417 18.809 10.0068 18.6929 10.287C18.5768 10.5673 18.3034 10.75 18 10.75L6.00002 10.75Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ScrollToTop;
