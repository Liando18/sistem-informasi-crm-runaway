export type Appearance = 'light';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

export function initializeTheme(): void {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
}

export function useAppearance(): UseAppearanceReturn {
    return { appearance: 'light', updateAppearance: () => {} };
}
