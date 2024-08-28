export const startTime = new Date('2024-08-28T13:00:00.000+08:00'); // TODO change it

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
