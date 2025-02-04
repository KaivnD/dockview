import { fireEvent, render, screen } from '@testing-library/react';
import { DockviewDefaultTab } from '../../dockview/defaultTab';
import * as React from 'react';
import { fromPartial } from '@total-typescript/shoehorn';
import { DockviewApi, DockviewPanelApi } from 'dockview-core';

describe('defaultTab', () => {
    test('has close button by default', async () => {
        const api = fromPartial<DockviewPanelApi>({});
        const containerApi = fromPartial<DockviewApi>({});
        const params = {};

        render(
            <DockviewDefaultTab
                api={api}
                containerApi={containerApi}
                params={params}
            />
        );

        const element = await screen.getByTestId('dockview-default-tab');
        expect(element.querySelector('.dv-react-tab-close-btn')).toBeTruthy();
    });

    test('has no close button when hideClose=true', async () => {
        const api = fromPartial<DockviewPanelApi>({});
        const containerApi = fromPartial<DockviewApi>({});
        const params = {};

        render(
            <DockviewDefaultTab
                api={api}
                containerApi={containerApi}
                params={params}
                hideClose={true}
            />
        );

        const element = await screen.getByTestId('dockview-default-tab');
        expect(element.querySelector('.dv-react-tab-close-btn')).toBeNull();
    });

    test('that settings closeActionOverride skips api.close()', async () => {
        const api = fromPartial<DockviewPanelApi>({
            close: jest.fn(),
        });
        const containerApi = fromPartial<DockviewApi>({});
        const params = {};

        const closeActionOverride = jest.fn();

        render(
            <DockviewDefaultTab
                api={api}
                containerApi={containerApi}
                params={params}
                closeActionOverride={closeActionOverride}
            />
        );

        const element = await screen.getByTestId('dockview-default-tab');
        const btn = element.querySelector(
            '.dv-react-tab-close-btn'
        ) as HTMLElement;
        fireEvent.click(btn);

        expect(closeActionOverride).toBeCalledTimes(1);
        expect(api.close).toBeCalledTimes(0);
    });

    test('that clicking close calls api.close()', async () => {
        const api = fromPartial<DockviewPanelApi>({
            close: jest.fn(),
        });
        const containerApi = fromPartial<DockviewApi>({});
        const params = {};

        render(
            <DockviewDefaultTab
                api={api}
                containerApi={containerApi}
                params={params}
            />
        );

        const element = await screen.getByTestId('dockview-default-tab');
        const btn = element.querySelector(
            '.dv-react-tab-close-btn'
        ) as HTMLElement;
        fireEvent.click(btn);

        expect(api.close).toBeCalledTimes(1);
    });

    test('has close button when hideClose=false', async () => {
        const api = fromPartial<DockviewPanelApi>({});
        const containerApi = fromPartial<DockviewApi>({});
        const params = {};

        render(
            <DockviewDefaultTab
                api={api}
                containerApi={containerApi}
                params={params}
                hideClose={false}
            />
        );

        const element = await screen.getByTestId('dockview-default-tab');
        expect(element.querySelector('.dv-react-tab-close-btn')).toBeTruthy();
    });

    test('that mouseDown on close button prevents panel becoming active', async () => {
        const api = fromPartial<DockviewPanelApi>({
            setActive: jest.fn(),
        });
        const containerApi = fromPartial<DockviewApi>({});
        const params = {};

        render(
            <DockviewDefaultTab
                api={api}
                containerApi={containerApi}
                params={params}
            />
        );

        const element = await screen.getByTestId('dockview-default-tab');
        const btn = element.querySelector(
            '.dv-react-tab-close-btn'
        ) as HTMLElement;

        fireEvent.mouseDown(btn);
        expect(api.setActive).toBeCalledTimes(0);

        fireEvent.click(element);
        expect(api.setActive).toBeCalledTimes(1);
    });
});
