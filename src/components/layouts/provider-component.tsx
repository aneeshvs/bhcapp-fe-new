'use client';
import App from '@/src/App';
import store from '@/src/store';
import { Provider } from 'react-redux';
import React, { ReactNode, Suspense } from 'react';
// import { appWithI18Next } from 'ni18n';
// import { ni18nConfig } from 'ni18n.config.ts';
import Loading from '@/src/components/layouts/loading';

interface IProps {
    children?: ReactNode;
}

const ProviderComponent = ({ children }: IProps) => {
    return (
        <Provider store={store}>
            <Suspense fallback={<Loading />}>
                <App>{children} </App>
            </Suspense>
        </Provider>
    );
};

export default ProviderComponent;
// todo
// export default appWithI18Next(ProviderComponent, ni18nConfig);
