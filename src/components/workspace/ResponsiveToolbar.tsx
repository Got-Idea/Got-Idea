import React, { FC } from 'react';
import { DesktopIcon, TabletIcon, MobileIcon } from '../Icons';

export type Device = 'desktop' | 'tablet' | 'mobile';

const deviceOptions: { id: Device; Icon: FC<{ className?: string }> }[] = [
    { id: 'desktop', Icon: DesktopIcon }, 
    { id: 'tablet', Icon: TabletIcon }, 
    { id: 'mobile', Icon: MobileIcon }
];

type ResponsiveToolbarProps = {
    activeDevice: Device;
    onDeviceChange: (device: Device) => void;
};

const ResponsiveToolbar: FC<ResponsiveToolbarProps> = ({ activeDevice, onDeviceChange }) => (
    <div className="flex-shrink-0 flex items-center justify-center p-2 border-b border-[var(--gotidea-border)] bg-[var(--gotidea-bg-alt)]/80 backdrop-blur-sm space-x-2">
        {deviceOptions.map(({ id, Icon }) => (
            <button 
                key={id} 
                onClick={() => onDeviceChange(id)} 
                title={`Preview on ${id}`} 
                aria-label={`Preview on ${id}`} 
                className={`p-2 rounded-md transition-colors ${activeDevice === id ? 'bg-[var(--gotidea-bg)] text-[var(--gotidea-primary)]' : 'text-[var(--gotidea-text-muted)] hover:bg-[var(--gotidea-bg)] hover:text-[var(--gotidea-text)]'}`}
            >
                <Icon className="w-5 h-5" />
            </button>
        ))}
    </div>
);

export default ResponsiveToolbar;
