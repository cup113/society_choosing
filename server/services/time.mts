export const startTime = new Date('2024-08-27T22:50:00.000+08:00'); // TODO change it

export function get_time_status() {
    const now = new Date();
    const eta = startTime.getTime() - now.getTime();
    if (eta < 0) {
        return {
            open: true,
        };
    } else {
        return {
            open: false,
            eta,
        }
    }
}
