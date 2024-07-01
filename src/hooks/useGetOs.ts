export const getOS = () => {
    let userAgent = typeof window !== 'undefined' ? navigator.userAgent || navigator.vendor : '';

    // Windows
    if (/windows phone/i.test(userAgent)) {
        return "WindowsPhone";
    }
    if (/win/i.test(userAgent)) {
        return "Windows";
    }

    // iOS
    if (/iPad|iPhone|iPod/.test(userAgent)) {
        return "iOS";
    }

    // Android
    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // macOS
    if (/mac/i.test(userAgent)) {
        return "MacOS";
    }

    // Linux
    if (/linux/i.test(userAgent)) {
        return "Linux";
    }

    return "unknown";
};
