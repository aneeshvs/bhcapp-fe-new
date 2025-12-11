'use client';
import { IRootState } from '@/src/store';
import React from 'react';
import { useSelector } from 'react-redux';

const MainContainer = ({ children }: { children: React.ReactNode }) => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    return (
        <div className="flex min-h-screen w-full text-black dark:text-white-dark">
            <div className={`${themeConfig.navbar} w-full`}>
                {children}
            </div>
        </div>
    );};

export default MainContainer;
