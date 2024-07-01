const formatTimestampToHour = (timestamp: number) => {
    let d = new Date(timestamp * 1000 + 25200000);

    let hours = d.getUTCHours();
    let minutes = d.getUTCMinutes();

    let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return formattedTime;
}
export default formatTimestampToHour;